import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPost } from "../redux/features/post/postSlice";

export const AddPostPage = () => {
  // Создаём состояния используя хук useState.
  const [image, setImage] = useState(""); // Состояние для хранения image.
  const [title, setTitle] = useState(""); // Состояние для хранения title.
  const [text, setText] = useState(""); // Состояние для хранения text.

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlerSubmit = () => {
    try {
      const data = new FormData();
      data.append("image", image);
      data.append("title", title);
      data.append("text", text);
      dispatch(createPost(data));
      navigate("/");
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
          onChange={(e) => setImage(e.target.files[0])}
        />
      </label>
      <div className="flex py-2 object-cover">
        {/* {image && ...} — это условный рендеринг, который проверяет, существует ли image. 
           Если переменная image содержит значение (например, выбранный файл изображения), 
            то выражение после && выполнится и будет отображено. */}
        {image && <img src={URL.createObjectURL(image)} alt="img" />}
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
          Добавить пост
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
