import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { checkIsAuth, logout } from "../redux/features/auth/authSlice";
import { toast } from "react-toastify";

export const Navbar = () => {
  const isAuth = useSelector(checkIsAuth);
  const activeStyles = {
    color: "white",
  };

  const dispatch = useDispatch();

  const handlerLogout = () => {
    dispatch(logout());
    window.localStorage.removeItem("token");
    toast("Successful logout");
  };

  return (
    <div className="flex py-4 justify-between items-center">
      {/* 
        flex: делает контейнер Flexbox, для удобного выравнивания элементов
        py-4: добавляет вертикальные отступы (padding) сверху и снизу по 1 рем (~16px)
        justify-between: распределяет элементы по горизонтали, помещая первый элемент в начале, последний — в конце
        items-center: выравнивает элементы по вертикали по центру
      */}
      <span className="flex justify-center items-center w-10 h-6 bg-gray-600 text-xs text-white rounded-sm">
        {/* 
          flex: делает контейнер Flexbox для выравнивания содержимого
          justify-center: центрирует содержимое по горизонтали
          items-center: центрирует содержимое по вертикали
          w-6: устанавливает ширину 1.5 рем (~24px)
          h-6: устанавливает высоту 1.5 рем (~24px)
          bg-gray-600: задает серый фон с насыщенностью 600
          text-xs: устанавливает размер текста на extra small (xs)
          text-white: делает текст белым
          rounded-sm: добавляет небольшие скругления к углам
        */}
        Logo
      </span>
      {/* 
        Условный рендеринг
      */}
      {isAuth && (
        <ul className="flex gap-8">
          {/* 
          flex: делает контейнер Flexbox
          gap-8: добавляет промежуток 2 рем (~32px) между элементами внутри Flexbox
        */}
          <li>
            <NavLink
              to={"/"}
              href="/"
              className="text-xs text-gray-400 hover:text-white"
              style={({ isActive }) => (isActive ? activeStyles : undefined)}
            >
              Главная
              {/* 
              text-xs: устанавливает размер текста на extra small (xs)
              text-gray-400: делает текст серым с насыщенностью 400
              hover:text-white: при наведении делает текст белым
            */}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/posts"}
              href="/posts"
              className="text-xs text-gray-400 hover:text-white"
              style={({ isActive }) => (isActive ? activeStyles : undefined)}
            >
              Мои посты
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/new"}
              href="/new"
              className="text-xs text-gray-400 hover:text-white"
              style={({ isActive }) => (isActive ? activeStyles : undefined)}
            >
              Добавить пост
            </NavLink>
          </li>
        </ul>
      )}

      <div className="flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm px-4 py-2">
        {isAuth ? (
          <button onClick={handlerLogout}>Logout</button>
        ) : (
          <Link to={"/login"}>Login</Link>
        )}
      </div>
    </div>
  );
};
