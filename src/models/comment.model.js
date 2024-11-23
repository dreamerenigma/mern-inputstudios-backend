import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
   {
      content: {
         type: String,
         required: true,
      },
      postId: {
         type: String,
         required: true,
      },
      userId: {
         type: String,
         required: true,
      },
      likes: {
         type: Array,
         default: [],
      },
      numberOfLikes: {
         type: Number,
         default: 0,
      },
      replyTo: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment",
         default: null,
      },
   }, { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
