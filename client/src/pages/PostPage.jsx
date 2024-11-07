import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axios";
import {
  AiFillEye,
  AiOutlineMessage,
  AiTwotoneEdit,
  AiFillDelete,
} from "react-icons/ai";
import Moment from "react-moment";
import { useDispatch, useSelector } from "react-redux";
import { deletePostById } from "../redux/features/post/postSlice";
import {
  createComment,
  getAllPostComments,
} from "../redux/features/comment/commentSlice";
import { toast } from "react-toastify";
import { CommentItem } from "./../components/CommentItem";

// Компонент PostPage — отвечает за отображение одного поста, который загружается через API-запрос
export const PostPage = () => {
  // Инициализация хука для навигации (позволяет вернуться на предыдущую страницу)
  const navigate = useNavigate();
  // Локальное состояние для хранения данных поста, инициализируем null до загрузки данных
  const [post, setPost] = useState(null);
  // Получаем параметр id из URL, чтобы использовать его в запросе
  const params = useParams();

  // Функция fetchPost — делает асинхронный запрос на сервер для получения данных поста
  const fetchPost = useCallback(async () => {
    try {
      // Запрос к серверу для получения данных поста по ID, полученному из params
      const { data } = await axiosInstance.get(`/posts/${params.id}`);
      // После успешного запроса сохраняем данные поста в локальное состояние
      setPost(data);
    } catch (error) {
      // Обработка ошибок: выводим ошибку в консоль, если запрос не удался
      console.error("Failed to fetch post:", error);
    }
  }, [params.id]); // Зависимость от params.id — функция обновится, если ID поста изменится

  // Хук useEffect — вызывает функцию fetchPost при монтировании компонента
  useEffect(() => {
    fetchPost(); // Выполняем fetchPost один раз при монтировании
  }, [fetchPost]); // Передаем fetchPost как зависимость, чтобы избежать лишних запросов

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handlerDeletePost = () => {
    try {
      dispatch(deletePostById(params.id));
      navigate("/posts");
      toast("Пост был успешно удалён");
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const [comment, setComment] = useState("");

  const handlerCommentSubmit = () => {
    try {
      const postId = params.id;
      dispatch(createComment({ postId, comment }));
      setComment("");
    } catch (error) {
      toast("Ошибка при создании комментария.");
      console.error("Failed to submit comment:", error);
    }
  };

  const fetchComments = useCallback(async () => {
    try {
      dispatch(getAllPostComments(params.id));
    } catch (error) {
      toast("Ошибка при получении списка комментариев.");
      console.error("Failed to get all post's comments :", error);
    }
  }, [params.id, dispatch]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const { comments } = useSelector((state) => state.comment);

  // Отображение интерфейса компонента
  return (
    <div>
      {/* Кнопка "Назад", которая возвращает пользователя на предыдущую страницу */}
      <button
        onClick={() => navigate(-1)} // Навигация назад на одну страницу
        className="flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm py-2 px-2"
      >
        Назад
      </button>

      {/* Проверка, загружены ли данные поста */}
      {post ? (
        // Основной контент поста, который отображается при наличии данных
        <div className="flex gap-10 py-8">
          <div className="w-2/3">
            {/* Блок изображения и основной информации о посте */}
            <div className="flex flex-col basis-1/4 flex-grow">
              <div
                className={
                  post.imageUrl ? "flex rounded-sm h-80" : "flex rounded-sm"
                }
              >
                {/* Отображение изображения, если оно есть */}
                {post.imageUrl && (
                  <img
                    src={`http://localhost:3003/${post.imageUrl}`}
                    alt="img"
                    className="object-cover w-full"
                  />
                )}
              </div>
            </div>

            {/* Дата и имя пользователя */}
            <div className="flex justify-between items-center pt-2">
              <div className="text-xs text-white opacity-50">
                {post.username}
              </div>
              <div className="text-xs text-white opacity-50">
                {/* Используем Moment для форматирования даты */}
                <Moment date={post.createdAt} format="D MMM YYYY" />
              </div>
            </div>

            {/* Заголовок и текст поста */}
            <div className="text-white opacity-60 text-xl">{post.title}</div>
            <p className="text-white opacity-60 text-xs pt-4">{post.text}</p>

            {/* Кнопки для отображения количества просмотров и комментариев */}
            <div className="flex items-center gap-3 mt-2 justify-between">
              <div className="flex gap-3 mt-4">
                <button className="flex items-center justify-center gap-2 text-xs text-white opacity-50">
                  <AiFillEye />
                  <span>{post.views}</span>
                </button>
                <button className="flex justify-center items-center gap-2 text-xs text-white opacity-50">
                  <AiOutlineMessage />
                  <span>{post.comments?.length || 0}</span>
                </button>
              </div>

              {user?._id === post.author && (
                <div className="flex gap-3 mt-4">
                  <button className="flex items-center justify-center gap-2 text-white opacity-50">
                    <Link to={`/${params.id}/edit`}>
                      <AiTwotoneEdit />
                    </Link>
                  </button>
                  <button
                    onClick={handlerDeletePost}
                    className="flex justify-center items-center gap-2 text-white opacity-50"
                  >
                    <AiFillDelete />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="w-1/3 p-8 bg-gray-700 flex flex-col gap-2 rounded-sm ">
            <form className="flex  gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comment"
                className="text-black w-full rounded-sm bg-gray-400 border p-2 text-xs outline-none placeholder:text-gray-700"
              />
              <button
                type="submit"
                onClick={handlerCommentSubmit}
                className="flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4"
              >
                Отправить
              </button>
            </form>

            {comments?.map((cmt) => (
              <CommentItem key={cmt._id} cmt={cmt} />
            ))}
          </div>
        </div>
      ) : (
        // Сообщение "Загрузка...", пока данные поста еще не получены
        <p className="text-white">Загрузка...</p>
      )}
    </div>
  );
};

/*
---------------------------------------------------------------------------------------------------------------------
Пояснение к цепочке данных:
1. Инициализация состояния и навигации:
Локальное состояние post инициализируется как null и предназначено для хранения данных о конкретном посте.
Навигация useNavigate добавляет возможность вернуться назад.

2. Функция fetchPost:
  fetchPost делает запрос к API с использованием axiosInstance, получая пост по params.id.
  Данные, полученные с сервера, сохраняются в post с помощью setPost, а в случае ошибки выводится сообщение в консоль.
  useCallback используется для предотвращения лишних рендеров, создавая fetchPost только при изменении params.id.

3. useEffect:
  fetchPost вызывается при монтировании компонента, и единожды, поскольку fetchPost обернут в useCallback и не изменится без изменения params.id.

4. Отображение данных:
  Компонент возвращает JSX, в котором данные поста отображаются только если post не null. 
  Пока данные загружаются, отображается надпись "Загрузка...".
  ---------------------------------------------------------------------------------------------------------------------
*/
