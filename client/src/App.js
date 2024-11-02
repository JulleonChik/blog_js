import { Layout } from "./components/Layout.jsx";
import { Routes, Route } from "react-router-dom";

import { MainPage } from "./pages/MainPage.jsx";
import { PostsPage } from "./pages/PostsPage.jsx";
import { AddPostPage } from "./pages/AddPostPage.jsx";
import { PostPage } from "./pages/PostPage.jsx";
import { EditPostPage } from "./pages/EditPostPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/new" element={<AddPostPage />} />
        <Route path="/:id" element={<PostPage />} />
        <Route path="/:id/edit" element={<EditPostPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>

      <ToastContainer position="bottom-right" />
    </Layout>
  );
}

export default App;
