"use client";

import { observer } from "mobx-react-lite";
import { useAuth } from "../../../hooks/useAuth";

export default observer(function DashboardPage() {
  const auth = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Добро пожаловать, {auth.user?.name}</p>
    </div>
  );
});
