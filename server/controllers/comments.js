import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// Create comment
export const createComment = async (req, res) => {
  try {
    const { postId, comment } = req.body;

    if (!comment) {
      return res.status(400).json({ message: "The comment cannot be empty" });
    }

    // Create and save the new comment
    const newComment = new Comment({
      comment,
      author: req.userId,
    });

    await newComment.save();

    // Add the comment to the post's comments array
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    // Populate author field in the response for more meaningful data
    const populatedComment = await Comment.findById(newComment._id).populate(
      "author"
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Try again later..." });
  }
};
