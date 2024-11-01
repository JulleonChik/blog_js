// Импортируем необходимые функции из Redux Toolkit
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// Импортируем настроенный экземпляр Axios для выполнения HTTP-запросов
import axiosInstance from "../../../utils/axios.js";

// Определяем начальное состояние слайса типа: State
const initialState = {
  user: null, // Здесь будет храниться информация о пользователе после регистрации
  token: null, // Здесь будет храниться токен авторизации после успешной регистрации
  isLoading: false, // Флаг, указывающий на то, происходит ли сейчас загрузка (асинхронный запрос)
  status: null, // Статус запроса, который может содержать сообщения об ошибках или успехе
};

// Создаем префикс для типов действий, который поможет уникально идентифицировать действия, связанные с регистрацией
const registerUserTypePrefix = "auth/registerUser";

// Функция, выполняющая асинхронный запрос на регистрацию пользователя
const registerUserPayloadCreator = async ({ username, password }) => {
  try {
    // Определяем URL, на который будет отправлен запрос
    const url = "/auth/register";
    // Выполняем POST-запрос с использованием axiosInstance и передаем username и password
    const { data } = await axiosInstance.post(url, { username, password });

    // Если в ответе возвращается токен, сохраняем его в localStorage
    if (data.token) {
      window.localStorage.setItem("token", data.token);
    }

    // Возвращаем данные, полученные от сервера (например, информацию о пользователе)
    return data;
  } catch (error) {
    // Логируем ошибку в консоль для отладки
    console.log(error);
    // Пробрасываем ошибку дальше, чтобы она могла быть обработана в слайсе
    throw error;
  }
};

// Создаем асинхронное действие с помощью createAsyncThunk
// Используется замыкание!!!
// пример замыкания:
// Функция createAdder принимает число и возвращает новую функцию
// function createAdder(x) {
//     // Возвращаемая функция принимает одно число y
//     return function (y) {
//       return x + y; // Возвращает сумму x и y
//     };
//   }

//   // Создаём новую функцию, добавляющую 5
//   const add5 = createAdder(5);

//   // Теперь можем использовать эту функцию
//   console.log(add5(10)); // 15
//   console.log(add5(20)); // 25

// createAsyncThunk принимает параметры (например, registerUserTypePrefix и registerUserPayloadCreator)
// и возвращает новую функцию registerUser , которая затем будет использовать эти параметры, при вызове её с данными (в данном случае { username, password }).
export const registerUser = createAsyncThunk(
  registerUserTypePrefix, // Это строка, идентифицирующая действия
  //   то есть будет использоваться для создания уникальных типов действий (например, auth/registerUser/pending)
  registerUserPayloadCreator
  // Это функция, которая будет выполняться при вызове dispatch пример dispatch(registerUser(...))
  //   Функция registerUserPayloadCreator выполняет асинхронную операцию (например, запрос на регистрацию) и возвращает данные или выбрасывает ошибку.
);

// Опции для создания слайса, где мы определяем его поведение
const sliceOptions = {
  name: "auth", // Указываем имя слайса, которое будет использоваться для идентификации его состояния
  initialState: initialState, // Передаем начальное состояние, которое мы определили ранее
  reducers: {}, // Здесь можно добавить синхронные редюсеры для обработки простых действий (пока оставим пустым)

  // Определяем дополнительные редюсеры для обработки состояний асинхронных действий
  extraReducers: (builder) => {
    // Используем builder для добавления обработчиков различных состояний
    builder
      // Обработчик для состояния pending (запрос в процессе)
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true; // Устанавливаем флаг загрузки в true
        state.status = null; // Сбрасываем статус, чтобы не было старых сообщений
      })
      // Обработчик для состояния fulfilled (успешное завершение запроса)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false; // Останавливаем загрузку, так как запрос завершился
        state.status = action.payload.message; // Устанавливаем статус из ответа
        state.user = action.payload.user; // Сохраняем информацию о пользователе из ответа
        state.token = action.payload.token; // Сохраняем в состоянии токен авторизации из ответа
      })
      // Обработчик для состояния rejected (ошибка при выполнении запроса)
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false; // Останавливаем загрузку
        state.status = action.payload.message; // Устанавливаем статус с сообщением об ошибке
      });
  },
};

// Создаем слайс, вызывая функцию createSlice, и записываем результат в переменную authSlice
export const authSlice = createSlice(sliceOptions);

// Экспортируем редюсер, чтобы его можно было использовать в других файлах
// Редюсер отвечает за изменение состояния приложения в зависимости от действий
export default authSlice.reducer;
