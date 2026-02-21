import { observer } from "mobx-react-lite";
import { authStore } from "../store/authStore";

const DashboardPage = observer(() => {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Добро пожаловать!</h1>
      <button
        onClick={() => authStore.logout()}
        className="bg-red-500 text-white p-2 rounded"
      >
        Выйти
      </button>
    </div>
  );
});

export default DashboardPage;
