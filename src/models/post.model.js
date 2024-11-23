import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
   {
      shortId: { 
         type: String, 
         unique: true 
      },
      userId: {
         type: String,
         required: true,
      },
      content: {
         type: String,
         required: true,
      },
      title: {
         type: String,
         required: true,
         unique: true,
      },
      image: {
         type: String,
         default: "https://i.ibb.co/s2jhDPr/blog-post.webp",
      },
      category: {
         type: String,
         default: "uncategorized",
      },
      slug: {
         type: String,
         required: true,
         unique: true,
      },
      views: {
         type: Number,
         default: 0,
      },
      likes: {
         type: [String],
         default: [],
      },
      numberOfLikes: {
         type: Number,
         default: 0,
      },
      dislikes: {
         type: [String],
         default: [],
      },
      numberOfDislikes: {
         type: Number,
         default: 0,
      },
      shareCount: {
         type: Number,
         default: 0,
      }
   }, { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
