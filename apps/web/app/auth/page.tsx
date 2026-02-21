"use client";
import { observer } from "mobx-react-lite";
import RegisterForm from "../../components/RegisterForm";
import { useState } from "react";
import LoginForm from "../../components/LoginFrom";

const AuthPage = observer(() => {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <div>
      {isAuth ? (
        <RegisterForm submitText="Зарегистрироваться" />
      ) : (
        <LoginForm />
      )}
      <button
        onClick={() => {
          setIsAuth(!isAuth);
        }}
      >
        {isAuth ? "Вход" : "Регистрация"}
      </button>
    </div>
  );
});

export default AuthPage;
