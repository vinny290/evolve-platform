"use client";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import styles from "./LoginForm.module.css";
import { useLogin } from "../../hooks/useLogin";

const LoginForm = observer(() => {
  const router = useRouter();
  const {
    loginData,
    handleInputLoginChange,
    handleLogin,
    errorLoginMessage,
    isLoginLoading,
  } = useLogin();

  const onSubmit = async (e: React.FormEvent) => {
    const success = await handleLogin(e);
    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <input
        name="email"
        type="email"
        value={loginData.email}
        onChange={handleInputLoginChange}
        className={styles.input}
        placeholder="Email"
      />

      <input
        name="password"
        type="password"
        value={loginData.password}
        onChange={handleInputLoginChange}
        className={styles.input}
        placeholder="Password"
      />

      {errorLoginMessage && (
        <div style={{ color: "red" }}>{errorLoginMessage}</div>
      )}

      <button type="submit" disabled={isLoginLoading} className={styles.button}>
        {isLoginLoading ? "Загрузка..." : "Войти"}
      </button>
    </form>
  );
});

export default LoginForm;
