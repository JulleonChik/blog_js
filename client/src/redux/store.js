import { configureStore } from "@reduxjs/toolkit"; // Импортируем функцию configureStore из библиотеки Redux Toolkit для создания хранилища Redux.
import { authSlice } from "./features/auth/authSlice"; // Импортируем слайс из файла authSlice.
import { postSlice } from "./features/post/postSlice";
import { commentSlice } from "./features/comment/commentSlice";

// Компоненты могут получать данные из хранилища с помощью хука useSelector и отправлять
// действия с помощью useDispatch, что позволяет управлять состоянием приложения в реальном времени и реагировать на изменения состояния.

// Таким образом, Redux-хранилище представляет собой централизованное хранилище, расположенное в памяти браузера,
// которое управляется на стороне клиента, обеспечивая единое место для всех данных, которые могут
// понадобиться на разных уровнях приложения.

// Создаем объект редюсеров, где ключ будет использоваться для доступа к состояниям слайсов хранилища
//  и указываем редюсеры слайсов которыйе будут обрабатывать действия и обновлять состояние.
const reducer = {
  auth: authSlice.reducer,
  post: postSlice.reducer,
  comment: commentSlice.reducer,
};

// Создаем объект конфигурации для хранилища.
const configureStoreOptions = {
  reducer, // Передаем объект редюсеров в конфигурацию.
};

// Вызываем функцию configureStore и передаем ей объект конфигурации.
// Результат вызова функции сохраняем в экспортируемую переменную store, тип которой - Store из Redux.
export const store = configureStore(configureStoreOptions);
