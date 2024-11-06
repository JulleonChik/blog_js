import Post from "../models/Post.js";
import User from "../models/User.js";

import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Create post
export const createPost = async (req, res) => {
  try {
    const { title, text } = req.body;

    const user = await User.findById(req.userId);

    if (req.files) {
      // Формирование имени сохраняемого файла
      let fileName = Date.now().toString() + req.files.image.name;
      /*   
            Получение текущей директории:
        1) import.meta — это объект который содержит информацию о текущем модуле.
         url — строка с полным URL-адресом файла file:///C:/Users/Leonchik/Desktop/js%20project/2_blog/server/controllers/posts.js
        2) fileURLToPath(import.meta.url) — функция которая преобразует URL в обычный файловый путь.
         удаляет file:/// и возвращает путь к файлу, C:\Users\Leonchik\Desktop\js project\2_blog\server\controllers\posts.js
        3) dirname(fileURLToPath(import.meta.url)) — функция возвращает только директорию файла.
         dirname вернет C:\Users\Leonchik\Desktop\js project\2_blog\server\controllers
      */
      const __dirname = dirname(fileURLToPath(import.meta.url));
      /* 
        path.join(__dirname, "..", "uploads", fileName) — объединяет части пути:
            ".." поднимает на один уровень вверх, то есть переходит от \controllers в \server.
            "uploads" добавляет папку uploads в пути.
            fileName добавляет имя загружаемого файла.
      */
      const pathToSave = path.join(__dirname, "..", "uploads", fileName);
      // перемещаем файл из временной директории в созданный путь
      req.files.image.mv(pathToSave);

      const newPostWithImage = new Post({
        username: user.username,
        title: title,
        text: text,
        imageUrl: fileName,
        author: req.userId,
      });

      await newPostWithImage.save();

      await User.findByIdAndUpdate(req.userId, {
        $push: {
          posts: newPostWithImage,
        },
      });

      return res.json(newPostWithImage);
    }

    const newPostWithoutImage = new Post({
      username: user.username,
      title,
      text,
      imageUrl: "",
      author: req.userId,
    });

    await newPostWithoutImage.save();
    await User.findByIdAndUpdate(req.userId, {
      $push: {
        posts: newPostWithoutImage,
      },
    });

    return res.json(newPostWithoutImage);
  } catch (error) {
    console.log(error);
    res.json({
      message: "Something went wrong. Try again later...",
    });
  }
};

// Get All Posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort("-createdAt");

    if (!posts) {
      return res.json({ message: "Not a single post was found." });
    }
    const popularPosts = await Post.find().limit(5).sort("-views");
    res.json({ posts, popularPosts });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Something went wrong. Try again later...",
    });
  }
};

// Get Post By Id
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id, // Указываем id
      { $inc: { views: 1 } }, // Увеличиваем количество просмотров на 1
      { new: true } // Опция для возвращения обновленного документа
    );

    if (!post) {
      return res.json({
        message:
          "The post was not found by this ID. Perhaps this post was deleted or never existed at all",
      });
    }

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// Get My Posts
export const getMyPosts = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const list = await Promise.all(
      user.posts.map((post) => {
        return Post.findById(post._id);
      })
    );
    res.json(list);
  } catch (error) {
    console.log(error);
    res.json({
      message: "Something went wrong. Try again later...",
    });
  }
};
