import { configureStore } from "@reduxjs/toolkit"; // Импортируем функцию configureStore из библиотеки Redux Toolkit для создания хранилища Redux.
import { authSlice } from "./features/auth/authSlice"; // Импортируем слайс из файла authSlice.
import { postSlice } from "./features/post/postSlice";

// Создаем объект редюсеров, где ключ будет использоваться для доступа к состояниям слайсов хранилища
//  и указываем редюсеры слайсов которыйе будут обрабатывать действия и обновлять состояние.
const reducer = {
  auth: authSlice.reducer,
  post: postSlice.reducer,
};

// Создаем объект конфигурации для хранилища.
const configureStoreOptions = {
  reducer, // Передаем объект редюсеров в конфигурацию.
};

// Вызываем функцию configureStore и передаем ей объект конфигурации.
// Результат вызова функции сохраняем в экспортируемую переменную store, тип которой - Store из Redux.
export const store = configureStore(configureStoreOptions);
