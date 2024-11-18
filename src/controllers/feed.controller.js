export const getfeeds = async (req, res, next) => {
   try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === "asc" ? 1 : -1;
      const posts = await Post.find({
         ...(req.query.userId && { userId: req.query.userId }),
         ...(req.query.category && { category: req.query.category }),
         ...(req.query.slug && { slug: req.query.slug }),
         ...(req.query.feedId && { _id: req.query.postId }),
         ...(req.query.searchTerm && {
            $or: [
               { title: { $regex: req.query.searchTerm, $options: "i" } },
               { content: { $regex: req.query.searchTerm, $options: "i" } },
            ],
         }),
      })
         .sort({ updatedAt: sortDirection })
         .skip(startIndex)
         .limit(limit);
      
      const totalPosts = await Post.countDocuments();
      const now = new Date();
      const oneMonthAgo = new Date(
         now.getFullYear(),
         now.getMonth() - 1,
         now.getDate()
      );

      const lastMonthPosts = await Post.countDocuments({
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
