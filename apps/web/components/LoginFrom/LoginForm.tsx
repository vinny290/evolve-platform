"use client";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import styles from "./LoginForm.module.css";
import { useState } from "react";
import { rootStore } from "app/stores";

const LoginForm = observer(() => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await rootStore.login(email, password);
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
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
        placeholder="Email"
      />

      <input
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
        placeholder="Password"
      />

      <button type="submit" disabled={loading} className={styles.button}>
        {loading ? "Загрузка..." : "Войти"}
      </button>
    </form>
  );
});

export default LoginForm;
