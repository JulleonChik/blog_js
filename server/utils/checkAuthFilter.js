import jwt from "jsonwebtoken";

export const checkAuthFilter = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/^Bearer\s?/, "");

  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.userId = decodedToken.id;
      next();
    } catch (error) {
      console.log(error);
      return res.json({
        message:
          "Authorization error. It is necessary to go through the login procedure again",
      });
    }
  } else {
    return res.json({
      message: "Access is denied",
    });
  }
};
