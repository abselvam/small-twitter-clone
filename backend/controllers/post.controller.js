import Post from "../models/post.model.js"
import User from "../models/user.model.js"
import Notification from "../models/notification.model.js"
import { v2 as cloudinary } from "cloudinary"


export const createPost = async (req, res) => {

    try {
        const {text} = req.body
        let {img} = req.body
        const userId = req.user._id.toString()
        const user = await User.findById(userId)

        if(!user) return res.status(404).json({message: "user not found"})
        if(!text && !img){
            return res.status(400).json({message: "Post must have text or image"})
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img)
            img = uploadedResponse.secure_url
        }

        const newPost = new Post({
            user: userId,
            text,
            img
        })
        await newPost.save()
        return res.status(201).json(newPost)
    } catch (error) {
        console.log("Error in creatPost controller:", error.message)
        res.status(500).json({error: "Internal server error"})
    }
    
}

export const deletePost = async (req, res) => {
    try {
        const {id} = req.params
        const post = await Post.findById(id)
        if(!post) return res.status(404).json({message: "Post not found"})
        if(post.user.toString() !== req.user._id.toString()){
            return res.status(400).json({message: "You can only dlete your posts"})
        }
        if(post.img){
            const imageId = post.img.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(imageId)
        }

        await Post.findByIdAndDelete(id)
        res.status(200).json({message: "Post deleted successfully"})
    } catch (error) {
        console.log("Error in deletePost controller:", error.message)
        res.status(500).json({error: "Internal server error"})
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const {text} = req.body
        const postId = req.params.id
        const userId = req.user._id
        if(!text){
            return res.status(400).json({error: "Text field is required"})
        }
        const post = await Post.findById(postId)
        if(!post){
            return res.status(404).json({error: "Post not found"})
        }
        const comment = {user: userId, text}
        post.comments.push(comment)
        await post.save()
        return res.status(200).json(post)
    } catch (error) {
        console.log("Error in commentOnPost controller:", error.message)
        res.status(500).json({error: "Internal server error"})
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const postId = req.params.id
        const userId = req.user._id
        const post = await Post.findById(postId)
        if(!post){
            return res.status(404).json({error: "Post not found"})
        }
        if(post.likes.includes(userId)){
            //unlike post
            // await post.updateOne({_id: postId}, {$pull: {likes: userId}})
            await Post.findByIdAndUpdate(
                postId, 
                { $pull: { likes: userId } },
                { new: true } // returns the updated doc
            );
            await User.findByIdAndUpdate(
                userId, 
                { $pull: { likedPosts: postId } },
                { new: true }
            )
            res.status(200).json({error: "Post uliked successfully"})
        }else{
            //like post
            post.likes.push(userId)
            await User.findByIdAndUpdate(
                userId, 
                { $push: { likedPosts: postId } },
                { new: true }
            )
            await post.save()
            
            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            })
            await notification.save()

            res.status(200).json({message: "Post liked successfully"})
        }
    } catch (error) {
        console.log("Error in likeUnlikePost controller:", error.message)
        res.status(500).json({error: "Internal server error"})
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({createdAt: -1}).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        })
        if(posts.length === 0){
            res.status(200).json([])
        }
        res.status(200).json(posts)
    } catch (error) {
        console.log("Error in getALlPosts controller:", error.message)
        res.status(500).json({error: "Internal server error"})
    }
}

export const getLikedPosts = async (req, res) => {
    const userId = req.params.id
    try {
        const user = await User.findById(userId)
        if(!user) return res.status(404).json({message: "User not found"})
        const likedPosts = await Post.find({_id: {$in: user.likedPosts}})
        .populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        })
        res.status(200).json(likedPosts)
    } catch (error) {
        console.log("Error in getLikedPosts controller:", error.message)
        res.status(500).json({error: "Internal server error"})
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId)
        if(!user) return res.status(404).json({error: "User not found"})
        const following = user.following
        const feedPosts = await Post.find({user: {$in: following}})
        .sort({createdAt: -1})
        .populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments",
            select: "-password",
        })
        return res.status(200).json(feedPosts)
    } catch (error) {
        console.log("Error in getLikedPosts controller:", error.message)
        res.status(500).json({error: "Internal server error"})
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const {username} = req.params
        const user = await User.findOne({username})
        if(!user) return res.status(404).json({error: "User not found"})
        const posts = await Post.find({user: user._id}).sort({createdAt: -1})
        .populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        })
        return res.status(200).json(posts)
    } catch (error) {
        console.log("Error in getUserPosts controller:", error.message)
        res.status(500).json({error: "Internal server error"})
    }
}