import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { registerUser } from "../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const RegisterPage = () => {
  // useState - Returns a stateful value, and a function to update it.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Returns the dispatch function from the Redux store.
  const dispatch = useDispatch();

  // useSelector — это хук(крючок) из Redux, который позволяет компонентам React получить доступ к состоянию хранилища (store) Redux.
  // обращаемся к хранилищу Redux получаем к текущему слайсу вытаскиваем стейт
  const { status } = useSelector((state) => state.auth);

  useEffect(() => {
    if (status) {
      toast(status);
    }
  }, [status]);

  // при отправке формы регистрации, создаетется асинхронный запрос серверу, который автоматически включает в себя токен авторизации
  const handleSubmit = () => {
    try {
      dispatch(registerUser({ username, password }));
      setUsername("");
      setPassword("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="w-1/4 h-60 mx-auto mt-40"
    >
      <h1 className="text-lg text-white text-center">Регистрация</h1>
      <label className="text-xs text-gray-400">
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700"
          autoComplete="username"
        />
      </label>

      <label className="text-xs text-gray-400">
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700 "
          autoComplete="current-password"
        />
      </label>

      <div className="flex gap-8 justify-center mt-4">
        <button
          type="submit"
          onClick={handleSubmit}
          className="flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4"
        >
          Register
        </button>
        <Link
          to={"/login"}
          className="flex justify-center items-center text-xs text-white"
        >
          I have an account
        </Link>
      </div>
    </form>
  );
};

// Как работает handleSubmit
// Событие отправки формы:

// Когда пользователь отправляет форму (например, нажимая кнопку "Регистрация"), вызывается функция handleSubmit.

// Вызов dispatch(registerUser({ username, password })):
// Внутри handleSubmit происходит вызов функции dispatch с аргументом registerUser({ username, password }).
// Здесь передаетётся объект с username и password, которые пользователь ввел в форму.

// Асинхронное действие:
// registerUser — это функция, созданная с помощью createAsyncThunk, которая инициирует асинхронный процесс регистрации.
// Когда dispatch вызывается с этой функцией, Redux Toolkit автоматически вызывает registerUserPayloadCreator (функцию, отвечающую за выполнение запроса на регистрацию), передавая туда объект { username, password }.

// HTTP-запрос:
// registerUserPayloadCreator выполняет асинхронный запрос к серверу  с использованием Axios для регистрации пользователя.
// Благодаря настройке Axios, в каждый запрос автоматически добавляется токен авторизации, который берется из localStorage.

// Очистка формы:
// После вызова dispatch, в случае успешного выполнения функции, очищаетется поля ввода с помощью setUserName("") и setPassword(""), чтобы форма была готова для нового ввода.

// Обработка ошибок:
// Если в процессе выполнения асинхронного запроса возникнет ошибка (например, если сервер вернет ошибку), она будет поймана в блоке catch, и будет обработана

// Общая логика
// Таким образом, весь процесс выглядит следующим образом:
// Пользователь заполняет форму и отправляет её.
// Приложение инициирует асинхронный запрос на сервер для регистрации с переданными данными (имя пользователя и пароль).
// Токен авторизации автоматически добавляется в запрос.
// Если запрос успешен, пользовательские данные обрабатываются и, возможно, сохраняются в состоянии Redux.
// Форма очищается, и пользователь может ввести новые данные.
// Это обеспечивает плавный и безопасный процесс регистрации, делая взаимодействие с сервером простым и эффективным.
