import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  userId: number;
  role: string;
}

interface ErrorResponse {
  error: string;
}

export async function POST(req: Request) {
  const { email, password }: LoginRequest = await req.json();

  if (!email || !password) {
    return NextResponse.json<ErrorResponse>(
      { error: "Отсутствуют обязательные поля: email или password" },
      { status: 400 },
    );
  }

  try {
    const response = await axios.post<LoginResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return NextResponse.json<LoginResponse>(response.data);
  } catch (error) {
    console.error("Ошибка при обработке ответов:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return NextResponse.json<ErrorResponse>(
        { error: axiosError.response?.data?.error || "Ошибка сервера" },
        { status: axiosError.response?.status || 500 },
      );
    }

    return NextResponse.json<ErrorResponse>(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
