import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";

const initialState = {
  comments: [],
  isLoading: false,
};

const sliceOptions = {
  name: "comment",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create comment
      .addCase(createComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments.push(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      // Get All Post's comments
      .addCase(getAllPostComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPostComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload;
      })
      .addCase(getAllPostComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
};

export const commentSlice = createSlice(sliceOptions);
export default commentSlice.reducer;

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
//  Aсинхронноые действия отправляемые посредством хука useDispatch() и обрабатываемые редюсерами extraReducers для изменения состояния слайса (среза) хранилишща
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------

//                      | Сreate Comment |

const createCommentTypePrefix = "comment/createComment";
const createCommentPayloadCreator = async ({ postId, comment }) => {
  try {
    const { data } = await axiosInstance.post(`/comments/${postId}`, {
      postId,
      comment,
    });

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createComment = createAsyncThunk(
  createCommentTypePrefix,
  createCommentPayloadCreator
);

//                      | Get All Post's comments |
// http://localhost:3003/api/posts/:pastId/comments

const getAllPostCommentsTypePrefix = "comment/getAllPostComments";
const getAllPostCommentsPayloadCreator = async (postId) => {
  try {
    const { data } = await axiosInstance.get(`/posts/${postId}/comments`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllPostComments = createAsyncThunk(
  getAllPostCommentsTypePrefix,
  getAllPostCommentsPayloadCreator
);
