import axios from "axios";

// WebClient в Spring аналог Axios; оба предназначены для выполнения HTTP-запросов.
// WebClient позволяет делать асинхронные запросы и конфигурировать их, как и Axios в JavaScript.

// и так:
// 1) axios тип: AxiosStatic содержит функцию create, которая настраивает и возвращает экземпляр родительского класса AxiosInstance,
// используя полученный аргумент типа CreateAxiosDefaults, который расширяет AxiosRequestConfig, посредством Omit,
// исключающим поле 'headers' из родительского класса. AxiosRequestConfig содержит поле baseURL?: string; его я и передал в качестве конфигурации.
// Таким образом, создал настроенный экземпляр AxiosInstance и записал в переменную instance.
// 2) AxiosInstance расширяет Axios, который имеет поле с объектом, содержащим два интерсептора (перехватчика):
// request: AxiosInterceptorManager<InternalAxiosRequestConfig>; и response: AxiosInterceptorManager<AxiosResponse>;
// поле request имеет тип AxiosInterceptorManager, параметризованный InternalAxiosRequestConfig.
// Получается, что AxiosInterceptorManager<V> предоставляет методы для управления перехватчиками, включая метод use().
// 3) Я обращаюсь к instance.interceptors.request и вызываю метод use(), который ожидает функцию onFulfilled (при успешном прохождении запроса),
// принимающую объект конфигурации типа InternalAxiosRequestConfig.
// 4) Я создаю функцию addAuthorizationToken, которая принимает параметр config типа InternalAxiosRequestConfig,
// добавляет в его заголовки поле Authorization, устанавливая его значение из localStorage с помощью window.localStorage.getItem("token").
// 5) Эта функция возвращает модифицированный объект config, который теперь включает заголовок Authorization.
// 6) Я передаю функцию addAuthorizationToken в метод use(), тем самым устанавливая ее как перехватчик для запросов,
// который будет выполнен перед отправкой каждого запроса, позволяя модифицировать конфигурацию запроса с добавлением токена авторизации.

// тип: AxiosRequestConfig
const config = {
  baseURL: "http://localhost:3003/api", // Указываем базовый URL сервера для всех запросов.
};

const instance = axios.create(config);

// тип: функция addAuthorizationToken принимает объект config (тип — InternalAxiosRequestConfig),
//  добавляет к нему заголовок Authorization с токеном из localStorage,
// и затем возвращает модифицированный config, который используется при отправке запроса.
const addAuthorizationToken = (config) => {
  config.headers.Authorization = window.localStorage.getItem("token");
  return config; // Возвращаем модифицированный config
};

instance.interceptors.request.use(addAuthorizationToken);

export default instance;
