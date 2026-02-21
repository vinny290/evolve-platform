"use client";

import { useState } from "react";
import { authStore } from "../app/store/authStore";
import axios from "axios";

interface AuthRequest {
  email: string;
  password: string;
}

export function useLogin() {
  const [loginData, setLoginData] = useState<AuthRequest>({
    email: "",
    password: "",
  });

  const [errorLoginMessage, setErrorLoginMessage] = useState<string | null>(
    null,
  );

  const handleInputLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (errorLoginMessage) {
      setErrorLoginMessage(null);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLoginMessage(null);

    // const success = await authStore.login(loginData.email, loginData.password);
    const response = await axios.post("/api/auth/login", loginData);
    authStore.login(response.data.access_token, response.data.refresh_token);

    // if (!success) {
    //   setErrorLoginMessage("Неверный email или пароль");
    //   return false;
    // }

    return true;
  };

  return {
    loginData,
    handleInputLoginChange,
    handleLogin,
    errorLoginMessage,
    isLoginLoading: authStore.loading, // используем loading из MobX
  };
}
