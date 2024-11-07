import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { updatePostById } from "../redux/features/post/postSlice";

export const EditPostPage = () => {
  // Создаём состояния используя хук useState.
  const [oldImage, setOldImage] = useState(""); // Состояние для хранения прежнего image.
  const [newImage, setNewImage] = useState(""); // Состояние для хранения нового image.
  const [title, setTitle] = useState(""); // Состояние для хранения title.
  const [text, setText] = useState(""); // Состояние для хранения text.

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Получаем параметр id из URL, чтобы использовать его в запросе
  const params = useParams();

  // Функция fetchPost — делает асинхронный запрос на сервер для получения данных поста
  const fetchPost = useCallback(async () => {
    try {
      // Запрос к серверу для получения данных поста по ID, полученному из params
      const { data } = await axiosInstance.get(`/posts/${params.id}`);
      // После успешного запроса сохраняем данные поста в локальное состояние
      setTitle(data.title);
      setText(data.text);
      setOldImage(data.imageUrl);
    } catch (error) {
      // Обработка ошибок: выводим ошибку в консоль, если запрос не удался
      console.error("Failed to fetch post:", error);
    }
  }, [params.id]); // Зависимость от params.id — функция обновится, если ID поста изменится

  // Хук useEffect — вызывает функцию fetchPost при монтировании компонента
  useEffect(() => {
    fetchPost(); // Выполняем fetchPost один раз при монтировании
  }, [fetchPost]); // Передаем fetchPost как зависимость, чтобы избежать лишних запросов

  const handlerSubmit = () => {
    try {
      const updatedPost = new FormData();
      updatedPost.append("image", newImage);
      updatedPost.append("title", title);
      updatedPost.append("text", text);
      updatedPost.append("id", params.id);
      dispatch(updatePostById(updatedPost));
      navigate("/posts");
    } catch (error) {
      console.log(error);
    }
  };

  const handlerClearForm = () => {
    setTitle("");
    setText("");
  };

  return (
    <form className="w-1/3 mx-auto py-10" onSubmit={(e) => e.preventDefault()}>
      <label className="flex justify-center items-center border-2 border-dotted bg-gray-600 py-2 mt-2 text-xs text-gray-300 cursor-pointer">
        Прикрепить изображение:
        <input
          type="file"
          className="hidden"
          onChange={(e) => {
            setNewImage(e.target.files[0]);
            setOldImage("");
          }}
        />
      </label>
      <div className="flex py-2 object-cover">
        {/* {image && ...} — это условный рендеринг, который проверяет, существует ли image. 
           Если переменная image содержит значение (например, выбранный файл изображения), 
            то выражение после && выполнится и будет отображено. */}
        {oldImage && (
          <img src={`http://localhost:3003/${oldImage}`} alt={oldImage.name} />
        )}
        {newImage && (
          <img src={URL.createObjectURL(newImage)} alt={newImage.name} />
        )}
      </div>

      <label className="text-xs text-white opacity-70">
        Заголовок поста:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Заголовок"
          className="mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs placeholder:text-gray-700"
        />
      </label>

      <label className="text-xs text-white opacity-70">
        Текст поста:
        <textarea
          placeholder="Текст поста"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 outline-none resize-none h-40 placeholder:text-gray-600"
        />
      </label>

      <div className="flex gap-8 justify-center items-center mt-4">
        <button
          onClick={handlerSubmit}
          className="flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4"
        >
          Обновить пост
        </button>
        <button
          onClick={handlerClearForm}
          className="flex justify-center items-center bg-red-500 text-xs text-white rounded-sm py-2 px-4"
        >
          Отменить
        </button>
      </div>
    </form>
  );
};
