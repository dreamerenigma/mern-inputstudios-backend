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
         reqired: true,
         unique: true,
      },
   }, { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
