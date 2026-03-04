"use client";

import { apiClient } from "lib/apiClient";
import { makeAutoObservable, runInAction } from "mobx";
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

  title = "";
  description = "";
  isCreating = false;
  levelEducation: LevelEducation = LevelEducation.BEGINNER;
  sphere = "";
  isEditing = false;
  isEditModalOpen = false;
  isDeleting = false;
  isDeleteModalOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

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

  async fetchCourses(page = 0) {
    this.isLoading = true;
    this.error = null;

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
    } catch (e: any) {
      runInAction(() => {
        this.error = e.response?.data?.message || "Ошибка загрузки курсов";
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async getCourseById(id: string) {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.course}/${id}`);
      runInAction(() => {
        this.course = response.data;
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
        this.course = response.data;
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

  async deleteCourse() {
    if (!this.course) return;

    this.isLoading = true;
    this.error = null;
    try {
      const response = await apiClient.delete<Course>(
        `${API_ENDPOINTS.course}/${this.course.id}`,
      );

      return true;
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

  async courseLike(id: string) {
    if (!this.course) return;
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.patch<Course>(
        `${API_ENDPOINTS.course}/${id}/likes`,
      );
      console.log("response.data: ", response.data);
      return response.data;
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
}
