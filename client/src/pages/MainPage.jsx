import React, { useEffect } from "react";
import { PostItem } from "../components/PostItem";
import { PopularPost } from "../components/PopularPost";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "../redux/features/post/postSlice";

export const MainPage = () => {
  const dispatch = useDispatch();

  const { posts, popularPosts } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  if (!posts.length) {
    return (
      <div className="text-xl text-center text-white py-10">
        Пока не создано ни одного поста
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto py-10">
      <div className="flex justify-between gap-8 ">
        <div className=" flex flex-col gap-10 basis-4/5 ">
          {posts?.map((post, idx) => {
            return <PostItem post={post} key={idx} />;
          })}
        </div>
        <div className=" basis-1/5 ">
          <div className=" text-xs uppercase text-white">Популярное:</div>

          {popularPosts?.map((post, idx) => {
            return <PopularPost post={post} key={idx} />;
          })}
        </div>
      </div>
    </div>
  );
};
