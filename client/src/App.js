import { Layout } from "./components/Layout.jsx";
import { Routes, Route } from "react-router-dom";

import { MainPage } from "./pages/MainPage.jsx";
import { PostsPage } from "./pages/PostsPage.jsx";
import { AddPostPage } from "./pages/AddPostPage.jsx";
import { PostPage } from "./pages/PostPage.jsx";
import { EditPostPage } from "./pages/EditPostPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getMe } from "./redux/features/auth/authSlice.js";

function App() {
  // Получение данных об авторизации
  // Эта функция позволяет отправлять действия (actions) в Redux, чтобы изменить состояние хранилища.
  const dispatch = useDispatch();

  // Используем dispatch для отправки асинхронного действия getMe
  const effectFunc = () => {
    dispatch(getMe());
  };

  // Используем хук useEffect для выполнения побочных эффектов.
  // передан пустой массив, это означает, что эффект не зависит от каких-либо переменных из внешней области видимости.
  // useEffect с пустым массивом зависимостей выполняется один раз и не будет повторяться до тех пор,
  // пока компонент не будет размонтирован и не будет смонтирован снова.
  useEffect(effectFunc, [dispatch]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/new" element={<AddPostPage />} />
        <Route path="/:id" element={<PostPage />} />
        <Route path="/:id/edit" element={<EditPostPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>

      <ToastContainer position="bottom-right" />
    </Layout>
  );
}

export default App;
