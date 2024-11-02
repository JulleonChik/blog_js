import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { checkIsAuth, loginUser } from "../redux/features/auth/authSlice";

export const LoginPage = () => {
  // создаём переменные и функции сеттеры для них
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Получаем функцию диспетчеризации из хранилища Redux с помощью хука useDispatch.
  // Эта функция позволяет отправлять действия (actions) в Redux, чтобы изменить состояние хранилища состояния приложения.
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // handleSubmit управляет логикой отправки формы.
  // При вызове dispatch(loginUser({ username, password })) происходит отправка действия в Redux,
  // что запускает асинхронный процесс логина через loginUser.
  const handleSubmit = () => {
    try {
      // Используем функцию dispatch для отправки асинхронного действия loginUser в Redux хранилище.
      // Действие loginUser принимает объект с полями username и password,
      // которые содержат данные, введенные пользователем в форму.
      // При вызове dispatch(loginUser({ username, password })) происходит:
      // 1. Redux получает действие loginUser и передает его в редюсер.
      // 2. Редюсер обрабатывает действие, выполняя асинхронный запрос на сервер для аутентификации.
      // 3. Если запрос успешен, редюсер обновляет состояние аутентификации в хранилище.
      // 4. Если произошла ошибка, редюсер обновляет состояние, чтобы отразить неудачу аутентификации.
      dispatch(loginUser({ username, password }));
    } catch (error) {
      console.log(error); // Логируем ошибку в консоль, если она произошла.
    }
  };

  // Используем хук useSelector, чтобы «поймать» данные из Redux хранилища.
  // useSelector запрашивает текущее состояние хранилища и передаёт его в функцию (state) => state.auth.
  // Мы обращаемся к слайсу auth, где хранится состояние аутентификации пользователя.
  // Затем с помощью деструктуризации извлекаем значение поля status из слайса auth,
  // чтобы использовать его в компоненте, не обращаясь к хранилищу напрямую каждый раз.
  const { status } = useSelector((state) => state.auth);
  const isAuth = useSelector(checkIsAuth);

  // Используем хук useEffect для выполнения побочных эффектов в нашем компоненте.
  // Этот эффект сработает каждый раз, когда изменится значение переменной status.
  // Мы передаем в useEffect функцию, которая будет выполнена при каждом изменении status.
  useEffect(() => {
    // Проверяем, есть ли значение в status.
    // Если status не пустой (например, если это сообщение об ошибке или успехе),
    // мы вызываем функцию toast для отображения уведомления на экране.
    if (status) {
      toast(status); // Отображаем уведомление с текущим статусом.
    }
    if (isAuth) {
      navigate("/");
    }
    // Зависимость [status] указывает, что этот эффект должен срабатывать только при изменении status.
  }, [status, isAuth, navigate]);

  // Возвращаем JSX, описывающий форму логина
  return (
    <form
      onSubmit={(e) => e.preventDefault()} // Предотвращаем отправку формы по умолчанию (стандартное поведение формы - переход на другую страницу или обновление),
      className="w-1/4 h-60 mx-auto mt-40"
    >
      <h1 className="text-lg text-white text-center">Авторизация</h1>
      <label className="text-xs text-gray-400">
        Username:
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)} // Обновляем состояние username при изменении поля.
          value={username}
          placeholder="Username"
          className="mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700"
          autoComplete="username"
        />
      </label>

      <label className="text-xs text-gray-400">
        Password:
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)} // Обновляем состояние password при изменении поля.
          value={password}
          placeholder="Password"
          className="mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700 "
          autoComplete="password"
        />
      </label>

      <div className="flex gap-8 justify-center mt-4">
        <button
          type="submit" // Кнопка отправки формы.
          onClick={handleSubmit} // Вызываем handleSubmit при нажатии на кнопку.
          className="flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4"
        >
          Login
        </button>
        <Link
          to={"/register"} // Ссылка на страницу регистрации.
          className="flex justify-center items-center text-xs text-white"
        >
          I want to register
        </Link>
      </div>
    </form>
  );
};
