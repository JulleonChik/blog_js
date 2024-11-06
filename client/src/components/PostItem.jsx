import React from "react";
import { AiFillEye, AiOutlineMessage } from "react-icons/ai";
import Moment from "react-moment";

export const PostItem = ({ post }) => {
  return (
    <div className="flex flex-col basis-1/4 flex-grow">
      <div
        className={post.imageUrl ? "flex rounded-sm h-80" : "flex rounded-sm"}
      >
        {post.imageUrl && (
          <img
            src={`http://localhost:3003/${post.imageUrl}`}
            alt="img"
            className="object-cover w-full"
          />
        )}
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="text-xs text-white opacity-50">{post.username}</div>
        <div className="text-xs text-white opacity-50">
          <Moment date={post.createdAt} format="D MMM YYYY" />
        </div>
      </div>
      <div className="text-white opacity-60 text-xl">{post.title}</div>
      <p className="text-white opacity-60 text-xs pt-4">{post.text}</p>
      <div className="flex items-center gap-3 mt-2">
        <button className="flex items-center justify-center gap-2 text-xs text-white opacity-50">
          <AiFillEye />
          <span>{post.views}</span>
        </button>
        <button className="flex justify-center items-center gap-2 text-xs text-white opacity-50">
          <AiOutlineMessage />
          <span>{post.comments?.length || 0}</span>
        </button>
      </div>
    </div>
  );
};
