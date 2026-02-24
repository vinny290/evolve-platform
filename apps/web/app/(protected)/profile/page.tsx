"use client";

import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";

export default observer(function ProfilePage() {
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await auth.logout();
    router.push("/login");
  };

  return (
    <div>
      <h1>Профиль</h1>
      <p>Email: {auth.user?.email}</p>
      {/* <p>Имя: {auth.user?.name}</p> */}
      <button onClick={handleLogout}>Выйти</button>
    </div>
  );
});
