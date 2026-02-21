"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./RegisterForm.module.css";
import { authStore } from "../../app/store/authStore";

const RegisterForm = ({ submitText }: { submitText: string }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authStore.register(email, password);
      const success = await authStore.register(email, password);
      if (success) router.push("/dashboard");
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
        disabled={loading || authStore.loading}
        className={styles.button}
      >
        {loading || authStore.loading ? "Загрузка..." : submitText}
      </button>
    </form>
  );
};

export default RegisterForm;
