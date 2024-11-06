import React, { useEffect, useState } from "react"; // Импорт React и хуков useEffect и useState
import axiosInstance from "../utils/axios"; // Импорт настроенного экземпляра axios для HTTP-запросов
import { PostItem } from "../components/PostItem"; // Импорт компонента PostItem для отображения каждого поста
import { toast } from "react-toastify"; // Импорт функции toast для уведомлений об ошибках
import "react-toastify/dist/ReactToastify.css"; // Импорт CSS-стилей для Toastify

// Компонент для отображения страницы с постами
export const PostsPage = () => {
  const [posts, setPosts] = useState([]); // Создание состояния для хранения массива постов

  // Асинхронная функция для загрузки постов пользователя
  const fetchMyPosts = async () => {
    try {
      // Отправка GET-запроса для получения постов пользователя
      const { data } = await axiosInstance.get("posts/user/myposts");
      setPosts(data); // Сохранение полученных данных в состояние posts
    } catch (error) {
      // Обработка ошибки при неудачном запросе
      toast.error("Ошибка при загрузке постов: " + error.message); // Отображение уведомления об ошибке
    }
  };

  // Хук useEffect для вызова fetchMyPosts при монтировании компонента
  useEffect(() => {
    fetchMyPosts(); // Вызов функции для получения постов при первом рендере
  }, []); // Пустой массив зависимостей, чтобы выполнить эффект только один раз

  return (
    <div className="w-1/2 mx-auto my-10 flex flex-col gap-10">
      {/* Перебор массива posts и отображение каждого поста с помощью компонента PostItem */}
      {posts?.map((post, idx) => (
        <PostItem post={post} key={idx} /> // Передача каждого поста в компонент PostItem и использование индекса как ключа
      ))}
    </div>
  );
};
