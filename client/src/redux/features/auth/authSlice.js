// Импортируем необходимые функции из Redux Toolkit
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// Импортируем настроенный экземпляр Axios для выполнения HTTP-запросов
import axiosInstance from "../../../utils/axios.js";

// RegisterUser
// -----------------------------------------------------------------------------------

// Создаем префикс для типов действий, который поможет уникально идентифицировать действия, связанные с регистрацией
const registerUserTypePrefix = "auth/registerUser";

// Функция, выполняющая асинхронный запрос на регистрацию пользователя
const registerUserPayloadCreator = async ({ username, password }) => {
  try {
    // Определяем URL, на который будет отправлен запрос
    const url = "/auth/register";
    // Выполняем POST-запрос с использованием axiosInstance и передаем username и password
    // axiosInstance.post отправляет запрос на указанный URL и ждет ответа от сервера
    const { data } = await axiosInstance.post(url, { username, password });

    // Если в ответе возвращается токен, сохраняем его в localStorage
    // localStorage позволяет хранить данные в браузере, что делает токен доступным для последующих запросов
    if (data.token) {
      window.localStorage.setItem("token", data.token);
    }

    // Возвращаем данные пользователя, полученные от сервера
    // Это может быть полезно для обновления состояния в Redux после успешной регистрации
    return data;
  } catch (error) {
    console.log(error);
    // Пробрасываем ошибку дальше, чтобы она могла быть обработана в слайсе
    // Если ошибка не пробросится, мы не сможем узнать, что запрос завершился неудачно
    throw error;
  }
};

// Aсинхронное действие для регистрации пользователя в системе - вызывается в компонентах с помощью хука dispatch для отправки асинхронного действия
export const registerUser = createAsyncThunk(
  registerUserTypePrefix, // идентифицирующая действия: используется для создания уникальных типов действий
  //   Пример: auth/registerUser/pending, auth/registerUser/fulfilled, auth/registerUser/rejected
  registerUserPayloadCreator // Функция выполняться при вызове dispatch
  //   выполняет асинхронную операцию: запрос на регистрацию, возвращает данные или выбрасывает ошибку
);

// LoginUser
// -----------------------------------------------------------------------------------

const loginUserTypePrefix = "auth/loginUser";

// Функция, выполняющая асинхронный запрос для аутентификации пользователя
const loginUserPayloadCreator = async ({ username, password }) => {
  try {
    // Определяем URL, на который будет отправлен запрос для аутентификации
    const url = "/auth/login";
    // Выполняем POST-запрос с использованием axiosInstance и передаем username и password
    const { data } = await axiosInstance.post(url, { username, password });

    // Если в ответе возвращается токен, сохраняем его в localStorage
    // Это позволит использовать токен для последующих запросов, требующих авторизации
    if (data.token) {
      window.localStorage.setItem("token", data.token);
    }

    // Возвращаем данные пользователя, полученные от сервера
    return data; // Это может содержать информацию о пользователе и токен
  } catch (error) {
    // Логируем ошибку в консоль для отладки
    console.log(error);
    // Пробрасываем ошибку дальше для обработки
    throw error;
  }
};

// Aсинхронное действие для входа в систему - вызывается в компонентах с помощью хука dispatch для отправки асинхронного действия
export const loginUser = createAsyncThunk(
  loginUserTypePrefix, // Это строка, идентифицирующая действия
  loginUserPayloadCreator // Функция для выполнения запроса
);

// Get Me
// -----------------------------------------------------------------------------------
const getMeTypePrefix = "auth/getMe";
const getMePayloadCreator = async () => {
  try {
    const { data } = await axiosInstance.get("/auth/me");
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
// Aсинхронное действие для получения данных об авторизации -вызывается в компонентах с помощью хука dispatch для отправки асинхронного действия
export const getMe = createAsyncThunk(getMeTypePrefix, getMePayloadCreator);

// AuthSlice -изменяет состояние State взависимости от результата выполнения асинхронных операций описанных выше
// -----------------------------------------------------------------------------------

// Определяем начальное состояние слайса тип: State
// Здесь мы определяем, как должно выглядеть состояние нашего хранилища для аутентификации
const initialState = {
  user: null, // Здесь будет храниться информация о пользователе после регистрации или входа
  token: null, // Здесь будет храниться токен авторизации после успешного входа или регистрации
  isLoading: false, // Флаг, указывающий на то, происходит ли сейчас загрузка (асинхронный запрос)
  status: null, // Статус запроса, который может содержать сообщения об ошибках или успехе
};

// Опции для создания слайса, где мы определяем его поведение
const sliceOptions = {
  name: "auth", // Указываем имя слайса, которое будет использоваться для идентификации его состояния
  initialState: initialState, // Передаем начальное состояние, которое мы определили ранее
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.status = null;
    },
  }, // Синхронные редюсеры для обработки простых действий

  // Определяем дополнительные редюсеры для обработки состояний асинхронных действий
  extraReducers: (builder) => {
    // Используем builder для добавления обработчиков различных состояний
    builder
      // ---Register user---
      // Обработчик для состояния pending (запрос в процессе)
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true; // Устанавливаем флаг загрузки в true, чтобы показать, что запрос выполняется
        state.status = null; // Сбрасываем статус, чтобы не было старых сообщений, которые могут сбивать с толку
      })
      // Обработчик для состояния fulfilled (успешное завершение запроса)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false; // Останавливаем загрузку, так как запрос завершился успешно
        state.status = action.payload.message; // Устанавливаем статус из ответа, чтобы отобразить сообщение пользователю
        state.user = action.payload.user; // Сохраняем информацию о пользователе из ответа для дальнейшего использования
        state.token = action.payload.token; // Сохраняем токен авторизации из ответа, чтобы использовать его в будущих запросах
      })
      // Обработчик для состояния rejected (ошибка при выполнении запроса)
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false; // Останавливаем загрузку, так как запрос завершился неудачно
        state.status = action.payload.message; // Устанавливаем статус с сообщением об ошибке, чтобы сообщить пользователю
      })
      // ---Login user---
      // Обработчик для состояния pending (запрос в процессе)
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true; // Устанавливаем флаг загрузки в true, чтобы показать, что запрос выполняется
        state.status = null; // Сбрасываем статус, чтобы не было старых сообщений
      })
      // Обработчик для состояния fulfilled (успешное завершение запроса)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false; // Останавливаем загрузку, так как запрос завершился успешно
        state.status = action.payload.message; // Устанавливаем статус из ответа, чтобы отобразить сообщение пользователю
        state.user = action.payload.user; // Сохраняем информацию о пользователе из ответа
        state.token = action.payload.token; // Сохраняем токен авторизации из ответа
      })
      // Обработчик для состояния rejected (ошибка при выполнении запроса)
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false; // Останавливаем загрузку, так как запрос завершился неудачно
        state.status = action.payload.message; // Устанавливаем статус с сообщением об ошибке
      })
      // ---Get me (проверка авторизации)---
      // Обработчик для состояния pending (запрос в процессе)
      .addCase(getMe.pending, (state) => {
        state.isLoading = true; // Устанавливаем флаг загрузки в true, чтобы показать, что запрос выполняется
        state.status = null; // Сбрасываем статус, чтобы не было старых сообщений
      })
      // Обработчик для состояния fulfilled (успешное завершение запроса)
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false; // Останавливаем загрузку, так как запрос завершился успешно
        state.status = null; // Устанавливаем статус null (запрос на проверку авторизации выполняется каждый раз при переходе на защищённый ресурс => какой нахрен статус)
        state.user = action.payload?.user; // Сохраняем если есть информацию о пользователе из ответа
        state.token = action.payload?.token; // Сохраняем если есть токен авторизации из ответа
      })
      // Обработчик для состояния rejected (ошибка при выполнении запроса)
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false; // Останавливаем загрузку, так как запрос завершился неудачно
        state.status = action.payload.message; // Устанавливаем статус с сообщением об ошибке
      });
  },
};

// Эта функция вызывается в компонентах с помощью хука useSelector,
// Функция checkIsAuth принимает состояние Redux (state) в качестве параметра.
// который автоматически передаст в неё параметр state, содержащий текущее состояние всего хранилища.
// Это состояние включает поддерево состояния, связанное с аутентификацией (auth),
// из которого будет получено значение поля токен (token).
// Функция возвращает булево значение: true, если токен существует (пользователь авторизован),
// и false, если токен отсутствует (пользователь не авторизован).
export const checkIsAuth = (state) => Boolean(state.auth.token);

// Создаем слайс, вызывая функцию createSlice, и записываем результат в переменную authSlice
// Это функция, которая объединяет все части нашего состояния и редюсеры в один объект
export const authSlice = createSlice(sliceOptions);

export const { logout } = authSlice.actions;

// Экспортируем редюсер, чтобы его можно было использовать в других файлах
// Редюсер отвечает за изменение состояния приложения в зависимости от исполняемых действий
export default authSlice.reducer;
