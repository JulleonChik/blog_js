import { configureStore } from "@reduxjs/toolkit"; // Импортируем функцию configureStore из библиотеки Redux Toolkit для создания хранилища Redux.
import { authSlice } from "./features/auth/authSlice"; // Импортируем слайс из файла authSlice.

// Создаем объект редюсеров, где ключ 'auth' будет использоваться для доступа к состоянию аутентификации.
const reducer = {
  auth: authSlice.reducer, // Указываем редюсер слайса, который будет обрабатывать действия и обновлять состояние.
};

// Создаем объект конфигурации для хранилища.
const configureStoreOptions = {
  reducer, // Передаем объект редюсеров в конфигурацию.
};

// Вызываем функцию configureStore и передаем ей объект конфигурации.
// Результат вызова функции сохраняем в экспортируемую переменную store, тип которой - Store из Redux.
export const store = configureStore(configureStoreOptions);
