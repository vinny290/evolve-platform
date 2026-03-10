"use client";

import { apiClient } from "lib/apiClient";
import { makeAutoObservable, runInAction, observable } from "mobx";
import { Course, LevelEducation } from "types/course";
import API_ENDPOINTS from "utils/apiEndpoints";

type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

export class CourseStore {
  courses: Course[] = [];
  course: Course | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  page = 0;
  size = 10;
  totalPages = 0;

  // Поля для форм создания/редактирования
  title = "";
  description = "";
  isCreating = false;
  levelEducation: LevelEducation = LevelEducation.BEGINNER;
  sphere = "";
  isEditing = false;
  isEditModalOpen = false;
  isDeleting = false;
  isDeleteModalOpen = false;

  // Реактивный Map для блокировки кнопок лайка (по id курса)
  loadingLikes = observable.map<string, boolean>();

  constructor() {
    makeAutoObservable(this);
  }

  // ========== Сеттеры для форм ==========
  setTitle(value: string) {
    this.title = value;
  }

  setDescription(value: string) {
    this.description = value;
  }

  setLevelEducation(level: LevelEducation) {
    this.levelEducation = level;
  }

  setSphere(value: string) {
    this.sphere = value;
  }

  setCourses(courses: Course[]) {
    this.courses = courses;
  }

  // ========== Управление модалками ==========
  startCreate() {
    this.isEditing = false;
    this.title = "";
    this.description = "";
    this.levelEducation = LevelEducation.BEGINNER;
    this.sphere = "";
    this.isEditModalOpen = true;
  }

  startEdit(course: Course) {
    this.isEditing = true;
    this.course = course;

    this.title = course.title;
    this.description = course.description;
    this.levelEducation = course.levelEducation;
    this.sphere = course.sphere ?? "";

    this.isEditModalOpen = true;
  }

  startDelete(course: Course) {
    this.isDeleting = true;
    this.course = course;
    this.isDeleteModalOpen = true;
  }

  closeModal() {
    this.isEditModalOpen = false;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }

  // ========== Работа со списком курсов ==========
  async fetchCourses(page = 0) {
    this.isLoading = true;

    try {
      const response = await apiClient.get<PageResponse<Course>>(
        API_ENDPOINTS.course,
        {
          params: {
            page,
            size: this.size,
            sort: "id,asc",
          },
        },
      );

      runInAction(() => {
        this.courses = response.data.content;
        this.totalPages = response.data.totalPages;
        this.page = response.data.number;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  // ========== Получение одного курса ==========
  async getCourseById(id: string) {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await apiClient.get<Course>(
        `${API_ENDPOINTS.course}/${id}`,
      );
      const fetchedCourse = response.data;

      runInAction(() => {
        // Сохраняем курс в общий массив (для синхронизации с лайками)
        const index = this.courses.findIndex((c) => c.id === id);
        if (index !== -1) {
          // Если курс уже есть в массиве — обновляем его
          this.courses[index] = fetchedCourse;
        } else {
          // Если нет — добавляем
          this.courses.push(fetchedCourse);
        }
        // Устанавливаем course как ссылку на объект из массива
        this.course = this.courses.find((c) => c.id === id) || null;
      });
    } catch (e: any) {
      runInAction(() => {
        this.error = e.response?.data?.message || "Ошибка загрузки курса";
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  // ========== Создание курса ==========
  async createCourse() {
    if (!this.title || !this.description) return;

    this.isCreating = true;
    this.error = null;

    try {
      await apiClient.post(API_ENDPOINTS.course, {
        title: this.title,
        description: this.description,
        levelEducation: this.levelEducation,
        sphere: this.sphere,
      });

      runInAction(() => {
        this.title = "";
        this.description = "";
        this.sphere = "";
        this.isEditModalOpen = false;
      });

      await this.fetchCourses(this.page);
    } catch (e: any) {
      runInAction(() => {
        this.error = e.response?.data?.message || "Ошибка создания курса";
      });
    } finally {
      runInAction(() => {
        this.isCreating = false;
      });
    }
  }

  // ========== Обновление курса ==========
  async updateCourse() {
    if (!this.course) return;

    this.isLoading = true;
    this.error = null;
    try {
      const response = await apiClient.patch<Course>(
        `${API_ENDPOINTS.course}/${this.course.id}`,
        {
          title: this.title,
          description: this.description,
          levelEducation: this.levelEducation,
          sphere: this.sphere,
        },
      );

      runInAction(() => {
        const updatedCourse = response.data;
        // Обновляем в массиве
        const index = this.courses.findIndex((c) => c.id === updatedCourse.id);
        if (index !== -1) {
          this.courses[index] = updatedCourse;
        }
        // Обновляем текущий курс (как ссылку на элемент массива)
        this.course =
          this.courses.find((c) => c.id === updatedCourse.id) || null;
        this.isEditModalOpen = false;
      });
    } catch (e: any) {
      runInAction(() => {
        this.error = e.response?.data?.message || "Ошибка обновления курса";
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  // ========== Удаление курса ==========
  async deleteCourse() {
    if (!this.course) return;

    this.isLoading = true;
    this.error = null;
    try {
      await apiClient.delete(`${API_ENDPOINTS.course}/${this.course.id}`);

      runInAction(() => {
        // Удаляем из массива
        this.courses = this.courses.filter((c) => c.id !== this.course?.id);
        this.course = null;
        this.isDeleteModalOpen = false;
      });

      return true;
    } catch (e: any) {
      runInAction(() => {
        this.error = e.response?.data?.message || "Ошибка удаления курса";
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  // ========== Оптимистичный лайк (работает и в списке, и на детальной странице) ==========
  async courseLike(id: string) {
    if (this.loadingLikes.get(id)) return;

    const index = this.courses.findIndex((c) => c.id === id);
    if (index === -1) return;

    const course = this.courses[index];
    const oldIsLiked = course.isLiked;
    const oldLikes = course.likes;
    const newIsLiked = !oldIsLiked;
    const newLikes = oldLikes + (newIsLiked ? 1 : -1);

    runInAction(() => {
      // Заменяем объект в массиве новым
      this.courses[index] = { ...course, isLiked: newIsLiked, likes: newLikes };

      // Если это текущий курс на детальной странице — обновляем ссылку
      if (this.course?.id === id) {
        this.course = this.courses[index];
      }

      this.loadingLikes.set(id, true);
    });

    try {
      await apiClient.patch(`${API_ENDPOINTS.course}/${id}/likes`);
    } catch (error: any) {
      runInAction(() => {
        // Откатываем изменения
        this.courses[index] = {
          ...course,
          isLiked: oldIsLiked,
          likes: oldLikes,
        };
        if (this.course?.id === id) {
          this.course = this.courses[index];
        }
        this.error = error.response?.data?.message || "Ошибка при лайке курса";
      });
    } finally {
      runInAction(() => {
        this.loadingLikes.set(id, false);
      });
    }
  }
}
