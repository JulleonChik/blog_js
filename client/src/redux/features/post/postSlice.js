import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";

const initialState = {
  posts: [], // Массив для хранения постов
  popularPosts: [], // Массив для хранения популярных постов
  isLoading: false, // Флаг, указывающий на то, происходит ли сейчас асинхронный запрос
};

// Опции для создания слайса, определяющие его поведение
const sliceOptions = {
  name: "post", //  Имя слайса, которое будет использоваться для идентификации его состояния
  initialState: initialState, // Начальное состояние
  reducers: {}, // Синхронные редюсеры для обработки простых действий
  extraReducers: (builder) => {
    builder
      // Сreate Post
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts.push(action.payload);
      })
      .addCase(createPost.rejected, (state) => {
        state.isLoading = false;
      })
      //  Get All Posts
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts;
        state.popularPosts = action.payload.popularPosts;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      // Delete Post By Id
      .addCase(deletePostById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePostById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = state.posts.filter(
          (post) => post._id !== action.payload._id
        );
      })
      .addCase(deletePostById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      // Update Post By Id
      .addCase(updatePostById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePostById.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.posts.findIndex((post) => {
          return post._id === action.payload._id;
        });
        state.posts[index] = action.payload;
      })
      .addCase(updatePostById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  }, // Асинхронные редюсеры для обработки асинхронных действий, созданных через createAsyncThunk
};

// Создаем слайс
export const postSlice = createSlice(sliceOptions);
export default postSlice.reducer;

// -----------------------------------------------------------------------------------------------------------------------------------------------------
//  Aсинхронноые действия отправляемые посредством хука useDispatch() и обрабатываемые редюсерами для изменения состояния слайса (среза) хранилишща постов
// -----------------------------------------------------------------------------------------------------------------------------------------------------

//                      | Сreate Post |

// Создаем префикс для типов действий связанные созданием поста
const createPostTypePrefix = "post/createPost";

// Описываем Функцию, выполняющую асинхронный запрос к серверу на создание поста возвращающую промис с данными или ошибкой для дальнейшей обработки extraReducers
const createPostPayloadCreator = async (params) => {
  try {
    const { data } = await axiosInstance.post("/posts", params);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Асинхронное действие для выполнения запроса к серверу на создание поста
export const createPost = createAsyncThunk(
  createPostTypePrefix,
  createPostPayloadCreator
);

//                      | Get All Posts |

const getAllPostsTypePrefix = "post/getAllPosts";

const getAllPostsPayloadCreator = async () => {
  try {
    const { data } = await axiosInstance.get("/posts");
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Асинхронное действие для выполнения запроса к серверу на получение всех постов и популярных
export const getAllPosts = createAsyncThunk(
  getAllPostsTypePrefix,
  getAllPostsPayloadCreator
);

//                      | Delete Post |
const deletePostTypePrefix = "post/deletePost";
const deletePostPayloadCreator = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/posts/${id}`, id);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Асинхронное действие для выполнения запроса к серверу на удаление поста по id
export const deletePostById = createAsyncThunk(
  deletePostTypePrefix,
  deletePostPayloadCreator
);

//                      | Update Post By Id |
const updatePostByIdTypePrefix = "post/updatePost";
const updatePostByIdPayloadCreator = async (updatedPost) => {
  try {
    const { data } = await axiosInstance.put(
      `/posts/${updatedPost.id}`,
      updatedPost
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Асинхронное действие для выполнения запроса к серверу на обновление поста по id
export const updatePostById = createAsyncThunk(
  updatePostByIdTypePrefix,
  updatePostByIdPayloadCreator
);

/* 
    ---------------------------------------------------------------------------------------------------------------------------------------------------
    При создании асинхронного действия с createAsyncThunk, Redux Toolkit разделяет это действие на три действия (этапа) разных типов
            pending – начало асинхронного действия.
            fulfilled – успешное завершение.
            rejected – завершение с ошибкой.

        Например: 
            с префиксом: post/createPost 
                Redux Toolkit автоматически генерирует три типа действий:
                    post/createPost/pending
                    post/createPost/fulfilled
                    post/createPost/rejected

        При вызове dispatch(createPost(params))
            Процесс выполнения асинхронного действия состоит в следующем:
        1. Redux Toolkit сначала запускает действие с типом post/createPost/pending, автоматически устанавливая статус как "ожидание".
        2. Если промис завершается успешно, createAsyncThunk автоматически отправляет действие post/createPost/fulfilled с результатами, 
            которые становятся доступными через action.payload.
        3. Если промис завершится с ошибкой, createAsyncThunk отправляет действие post/createPost/rejected.

    Таким образом, не нужно вручную отслеживать эти состояния. createAsyncThunk и extraReducers упрощают работу с асинхронными действиями, 
    автоматически разделяя их на три этапа, что позволяет легко управлять состоянием хранилища в зависимости от текущего состояния асинхронного запроса.

    Redux Toolkit отслеживает состояния pending, fulfilled и rejected асинхронного действия автоматически благодаря createAsyncThunk,
       в свою очередь в слайсе для обработки состояний выполнения ассинхронных операций применяются extraReducers
            котрорые непосредственно изменяют состояние хранилища в зависиммости от текущего состояния выполнения асинхронного действия.
    ---------------------------------------------------------------------------------------------------------------------------------------------------
*/
