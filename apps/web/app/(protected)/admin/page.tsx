"use client";

import { ProtectedRoute } from "../../../components/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRoles={["ADMIN"]}>
      <div>
        <h1>Админ панель</h1>
        <p>Доступ только для ADMIN</p>
      </div>
    </ProtectedRoute>
  );
}
