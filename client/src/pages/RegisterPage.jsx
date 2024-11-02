import React, { useState, useEffect } from "react"; // Импортируем необходимые библиотеки и хуки.
import { useDispatch, useSelector } from "react-redux"; // Импортируем хуки для работы с Redux.
import { Link, useNavigate } from "react-router-dom"; // Импортируем компонент Link для навигации.
import { checkIsAuth, registerUser } from "../redux/features/auth/authSlice"; // Импортируем действие для регистрации пользователя.
import { toast } from "react-toastify"; // Импортируем библиотеку для уведомлений.
import "react-toastify/dist/ReactToastify.css"; // Импортируем стили для уведомлений.

export const RegisterPage = () => {
  // Создаём состояния для имени пользователя и пароля, используя хук useState.
  const [username, setUsername] = useState(""); // Состояние для хранения имени пользователя.
  const [password, setPassword] = useState(""); // Состояние для хранения пароля.

  // Получаем функцию dispatch из хранилища Redux с помощью хука useDispatch.
  // Эта функция позволяет отправлять действия (actions) в Redux, чтобы изменить состояние хранилища.
  const dispatch = useDispatch();

  // Функция handleSubmit вызывается при отправке формы.
  const handleSubmit = () => {
    try {
      // Используем dispatch для отправки асинхронного действия registerUser.
      // Передаём объект с username и password, которые введены пользователем.
      dispatch(registerUser({ username, password }));

      // Очищаем поля ввода после отправки формы.
      setUsername(""); // Сбрасываем состояние username.
      setPassword(""); // Сбрасываем состояние password.
    } catch (error) {
      // Если возникла ошибка, выводим её в консоль для отладки.
      console.log(error);
    }
  };

  // Используем хук useSelector, чтобы получить состояние из Redux хранилища.
  // Извлекаем поле status из слайса auth, чтобы использовать его в компоненте.
  const { status } = useSelector((state) => state.auth);
  const isAuth = useSelector(checkIsAuth);
  const navigate = useNavigate();

  // Используем хук useEffect для выполнения побочных эффектов.
  // Этот эффект срабатывает каждый раз, когда изменяется значение переменной status.
  useEffect(() => {
    // Если status не пустой, показываем уведомление с его содержимым.
    if (status) {
      toast(status); // Выводим уведомление с помощью toast.
    }

    if (isAuth) {
      navigate("/");
    }
    // Указываем [status] как зависимость, чтобы этот эффект срабатывал только при изменении status.
  }, [status, isAuth, navigate]);

  // Возвращаем JSX, описывающий форму регистрации.
  return (
    <form
      onSubmit={(e) => e.preventDefault()} // Предотвращаем отправку формы по умолчанию (стандартное поведение формы - переход на другую страницу или обновление),
      className="w-1/4 h-60 mx-auto mt-40"
    >
      <h1 className="text-lg text-white text-center">Регистрация</h1>

      <label className="text-xs text-gray-400">
        Username:
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)} // Обновляем состояние при изменении ввода.
          value={username} // Устанавливаем значение из состояния.
          placeholder="Username"
          className="mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700"
          autoComplete="username" // Автозаполнение для имени пользователя.
        />
      </label>

      {/* Поле для ввода пароля */}
      <label className="text-xs text-gray-400">
        Password:
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)} // Обновляем состояние при изменении ввода.
          value={password} // Устанавливаем значение из состояния.
          placeholder="Password"
          className="mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700 "
          autoComplete="current-password" // Автозаполнение для пароля.
        />
      </label>

      {/* Кнопка для отправки формы и ссылка на страницу входа */}
      <div className="flex gap-8 justify-center mt-4">
        <button
          type="submit" // Устанавливаем тип кнопки на submit для отправки формы.
          onClick={handleSubmit} // При нажатии на кнопку вызываем функцию handleSubmit.
          className="flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4"
        >
          Register
        </button>
        <Link
          to={"/login"} // Ссылка на страницу входа.
          className="flex justify-center items-center text-xs text-white"
        >
          I have an account
        </Link>
      </div>
    </form>
  );
};

// Пошаговое объяснение работы функции handleSubmit:
// 1. **Событие отправки формы**:
//    - Когда пользователь нажимает кнопку "Регистрация", вызывается функция handleSubmit.
// 2. **Вызов dispatch(registerUser({ username, password }))**:
//    - Внутри handleSubmit вызывается функция dispatch с аргументом registerUser({ username, password }).
//    - Здесь передается объект с username и password, которые пользователь ввел в форму.
// 3. **Асинхронное действие**:
//    - registerUser — это функция, созданная с помощью createAsyncThunk, инициирующая асинхронный процесс регистрации.
//    - Когда dispatch вызывается с этой функцией, Redux Toolkit автоматически вызывает registerUserPayloadCreator (функцию, отвечающую за выполнение запроса на регистрацию), передавая туда объект { username, password }.
// 4. **HTTP-запрос**:
//    - registerUserPayloadCreator выполняет асинхронный запрос к серверу с использованием Axios для регистрации пользователя.
//    - Благодаря настройке Axios, в каждый запрос автоматически добавляется токен авторизации, который берется из localStorage.
// 5. **Очистка формы**:
//    - После вызова dispatch, если функция успешно выполнена, поля ввода очищаются с помощью setUsername("") и setPassword(""), чтобы форма была готова для нового ввода.
// 6. **Обработка ошибок**:
//    - Если в процессе выполнения асинхронного запроса возникнет ошибка (например, если сервер вернет ошибку), она будет поймана в блоке catch, и будет обработана.

// **Общая логика**:
// Таким образом, весь процесс выглядит следующим образом:
// - Пользователь заполняет форму и отправляет её.
// - Приложение инициирует асинхронный запрос на сервер для регистрации с переданными данными (имя пользователя и пароль).
// - Токен авторизации автоматически добавляется в запрос.
// - Если запрос успешен, пользовательские данные обрабатываются и, возможно, сохраняются в состоянии Redux.
// - Форма очищается, и пользователь может ввести новые данные.
// Это обеспечивает плавный и безопасный процесс регистрации, делая взаимодействие с сервером простым и эффективным.
