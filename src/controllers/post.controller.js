import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";
import shortid from "shortid";

export const create = async (req, res, next) => {
   if (!req.body.title || !req.body.content) {
      return next(errorHandler(400, "Please provide all required fields"));
   }

   const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

   const newPost = new Post({
      ...req.body,
      slug,
      userId: req.user.id,
      shortId: shortid.generate(),
   });

   try {

      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
   } catch (error) {
      next(error);
   }
};

export const getposts = async (req, res, next) => {
   try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = req.query.limit ? parseInt(req.query.limit) : null;
      const sortDirection = req.query.order === "asc" ? 1 : -1;

      const filters = {
         ...(req.query.category && { category: req.query.category }),
         ...(req.query.slug && { slug: req.query.slug }),
         ...(req.query.postId && { _id: req.query.postId }),
         ...(req.query.searchTerm && {
            $or: [
               { title: { $regex: req.query.searchTerm, $options: "i" } },
               { content: { $regex: req.query.searchTerm, $options: "i" } },
            ],
         }),
      };

      if (req.query.userId) {
         if (req.user.isAdmin || req.query.userId === req.user.id) {
            filters.userId = req.query.userId;
         } else {
            return next(errorHandler(403, "You are not allowed to access these posts"));
         }
      }

      const postsQuery = Post.find(filters).sort({ updatedAt: sortDirection }).skip(startIndex);
      if (limit) postsQuery.limit(limit);

      const posts = await postsQuery;

      const totalPosts = await Post.countDocuments(filters);

      const now = new Date();
      const oneMonthAgo = new Date(
         now.getFullYear(),
         now.getMonth() - 1,
         now.getDate()
      );

      const lastMonthPosts = await Post.countDocuments({
         ...filters,
         createdAt: { $gte: oneMonthAgo },
      });

      res.status(200).json({
         posts,
         totalPosts,
         lastMonthPosts,
      });
   } catch (error) {
      next(error);
   }
};

export const likePost = async (req, res, next) => {
   try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
         return next(errorHandler(404, "Post not found"));
      }

      const userId = req.user.id;

      const isLiked = post.likes.includes(userId);

      if (isLiked) {
         post.likes = post.likes.filter((id) => id !== userId);
         post.numberOfLikes -= 1;
      } else {
         post.likes.push(userId);
         post.numberOfLikes += 1;
      }

      await post.save();

      res.status(200).json({
         likes: post.likes,
         numberOfLikes: post.numberOfLikes,
      });
   } catch (error) {
      next(error);
   }
};

export const dislikePost = async (req, res, next) => {
   try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
         return next(errorHandler(404, "Post not found"));
      }

      const userId = req.user.id;

      const isDisliked = post.dislikes.includes(userId);

      if (isDisliked) {
         post.dislikes = post.dislikes.filter((id) => id !== userId);
         post.numberOfDislikes -= 1;
      } else {

         post.dislikes.push(userId);
         post.numberOfDislikes += 1;
      }

      await post.save();

      res.status(200).json({
         likes: post.likes,
         numberOfLikes: post.numberOfLikes,
         dislikes: post.dislikes,
         numberOfDislikes: post.numberOfDislikes,
      });
   } catch (error) {
      next(error);
   }
};

export const deletepost = async (req, res, next) => {
   if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You are not allowed to delete this post"));
   }
   try {
      await Post.findByIdAndDelete(req.params.postId);
      res.status(200).json("The post has been deleted");
   } catch (error) {
      next(error);
   }
};

export const updatepost = async (req, res, next) => {
   if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You are not allowed to update this post"));
   }
   try {
      const updatePost = await Post.findByIdAndUpdate(
         req.params.postId,
         {
            $set: {
               title: req.body.title,
               content: req.body.content,
               category: req.body.category,
               image: req.body.image,
            },
         },
         { new: true }
      );
      res.status(200).json(updatePost);
   } catch (error) {
      next(error);
   }
};

export const incrementViews = async (req, res, next) => {
   const postId = req.params.postId;
   console.log("Post ID received:", postId);
   try {
      const post = await Post.findById(postId);

      if (!post) {
         return next(errorHandler(404, "Post not found"));
      }

      post.views += 1;
      await post.save();

      res.status(200).json({ views: post.views });
   } catch (error) {
      next(error);
   }
};

export const sharePost = async (req, res) => {
   try {
      const { postId } = req.params;
      const post = await Post.findById(postId);

      if (!post) {
         return res.status(404).json({ message: "Пост не найден" });
      }

      post.shareCount += 1;
      await post.save();

      res.status(200).json({ message: "Пост успешно поделился", shareCount: post.shareCount });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ошибка при обработке запроса" });
   }
};
