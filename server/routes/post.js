const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("post");
const User = mongoose.model("user");

// Fetch all posts
//show all users post
//phr user ko token milega
router.get("/allpost", requireLogin, async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("postedBy", "_id name dp")
            .populate("comments.postedBy", "_id name")
            .sort("-createdAt");
        res.json({ posts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

// Fetch posts of followed users
//show all users post jinhe user follow karta hai
//populate mtlb jo bhi data hai usko fetch karke dikhana

router.get("/followingpost", requireLogin, async (req, res) => {
    try {
        const posts = await Post.find({ postedBy: { $in: req.user.following } })
            .populate("postedBy", "_id name dp")
            .populate("comments.postedBy", "_id name")
            .sort("-createdAt");
        res.json({ posts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch following posts" });
    }
});

// Create a post
router.post("/createpost", requireLogin, async (req, res) => {
    const { title, body, picture } = req.body;
    if (!title || !body || !picture) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const post = new Post({ title, body, picture, postedBy: req.user });
        const result = await post.save();
        res.json({ post: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create post" });
    }
});

// Fetch logged-in user's posts

router.get("/mypost", requireLogin, async (req, res) => {
    try {
        const mypost = await Post.find({ postedBy: req.user._id }).populate("postedBy", "_id name dp");
        res.json({ mypost });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch your posts" });
    }
});



// Like a post
//populate mtlb jo bhi data hai usko fetch karke dikhana
//like karne ke liye

router.put("/like", requireLogin, async (req, res) => {
    try {
        const result = await Post.findByIdAndUpdate(
            req.body.postId,
            { $addToSet: { likes: req.user._id } }, // Prevent duplicate likes
            { new: true }
        ).populate("comments.postedBy", "_id name").populate("postedBy", "_id name dp");

        if (!result) return res.status(404).json({ error: "Post not found" });
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to like post" });
    }
});

// Unlike a post
router.put("/unlike", requireLogin, async (req, res) => {
    try {
        const result = await Post.findByIdAndUpdate(
            req.body.postId,
            { $pull: { likes: req.user._id } },
            { new: true }
        ).populate("comments.postedBy", "_id name").populate("postedBy", "_id name dp");

        if (!result) return res.status(404).json({ error: "Post not found" });
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to unlike post" });
    }
});

// Comment on a post
router.put("/comment", requireLogin, async (req, res) => {
    const { text, postId } = req.body;
    if (!text) return res.status(400).json({ error: "Comment cannot be empty" });

    try {
        const result = await Post.findByIdAndUpdate(
            postId,
            { $push: { comments: { text, postedBy: req.user._id } } },
            { new: true }
        ).populate("comments.postedBy", "_id name").populate("postedBy", "_id name dp");

        if (!result) return res.status(404).json({ error: "Post not found" });
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add comment" });
    }
});

// Delete a post
router.delete("/deletepost/:postId", requireLogin, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate("postedBy", "_id");
        if (!post) return res.status(404).json({ error: "Post not found" });

        if (post.postedBy._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Unauthorized action" });
        }

        await post.deleteOne();
        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete post" });
    }
});

// Get likes list
router.get("/likeslist/:id", requireLogin, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).select("likes");
        if (!post) return res.status(404).json({ error: "Post not found" });

        const users = await User.find({ _id: { $in: post.likes } }).select("_id name dp");
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch likes list" });
    }
});

module.exports = router;
