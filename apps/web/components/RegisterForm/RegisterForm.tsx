"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./RegisterForm.module.css";
import { rootStore } from "app/stores";

const RegisterForm = ({ submitText }: { submitText: string }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await rootStore.register(email, password);
      router.push("/courses");
    } catch (e) {
      console.error("Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
      />
      <button
        type="submit"
        disabled={loading || rootStore.authStore.isLoading}
        className={styles.button}
      >
        {loading || rootStore.authStore.isLoading ? "Загрузка..." : submitText}
      </button>
    </form>
  );
};

export default RegisterForm;
