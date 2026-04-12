import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import sharp from "sharp";

export const CreateNewPost = async (req, res) => {
    try {
        const authorId = req.id;
        const { caption } = req.body;
       const image = req.file; // Assuming you're using multer for file uploads
       if(!image){
        return res.status(400).json({ message: "Image is required", success: false });
       }

       const optimizedImage = await sharp(image.buffer)
         .resize({ width: 800,height:800, fit:"inside" }) // Resize to a width of 800px, height will be auto-scaled
         .toFormat("jpeg",{quality:80})
         .toBuffer();

         const fileUri = `data:image/jpeg;base64,${optimizedImage.toString('base64')}`;
            const cloudResponse = await cloudinary.uploader.upload(fileUri);
            
        const post = await Post.create({
            author: authorId,
            caption,
            image: cloudResponse.secure_url,
        });

        const user = await User.findById(authorId);
        if(user){
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({path:"author", select:"-password"});
          
        return res.status(201).json({ message: "Post created successfully", success: true, post });
    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found", success: false });
        }
        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized to delete this post", success: false });
        }

        //delete image from cloudinary
        const publicId = post.image.split("/").slice(-1)[0].split(".")[0];
        const img = await cloudinary.uploader.destroy(publicId);
        if(img.error){
            console.error("Cloudinary deletion error:", img.error);
            return res.status(500).json({ message: "Cloudinary deletion error", success: false });
        }

        // Delete the post
        await Post.findByIdAndDelete(postId);

        // Remove the post from the user's posts array
        await User.findByIdAndUpdate(userId, { $pull: { posts: postId } });

        //delete all comments associated with the post
        await Comment.deleteMany({post:postId});
        return res.status(200).json({ message: "Post deleted successfully", success: true });
    } catch (error) {
        console.log("Error deleting post:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const getAllposts = async (req, res) => {
 try {
    const post = await Post.find().sort({createdAt:-1})
                    .populate({path:"author",select:"username profilePicture"})
                    .populate({
                        path:"comments",
                        options: { sort: { createdAt: -1 } },
                        populate:{path:"author", select:"username profilePicture"}
                    })

    return res.status(200).json({message:"Posts fetched successfully", success:true, post})
                       
 } catch (error) {
    console.log("Error fetching posts:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
 }   
}


export const getUserPosts = async (req, res) => {
    try {
        const userId = req.id;  
        const posts = await Post.find({ author: userId }).sort({ createdAt: -1 })
            .populate({ path: "author", select: "username profilePicture" })
            .populate({path:"comments", sort:{createdAt:-1}, populate:{path:"author", select:"username profilePicture"}});
            return res.status(200).json({message:"User posts fetched successfully", success:true, posts})
    }catch (error) {  
        console.log("Error fetching user posts:", error);
        return res.status(500).json({ message: "Internal server error", success: false });  
    }
}

export const likePost = async (req, res) => {
   try {
       const postId = req.params.id;
       const userId = req.id;
       await Post.findByIdAndUpdate( postId, { $addToSet: { likes: userId } }, { new: true })
       return res.status(200).json({ message: "Post liked successfully", success: true });
   } catch (error) {
    console.log("Error liking post:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
   }
}

export const unlikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;
        await Post.findByIdAndUpdate( postId, { $pull: { likes: userId } }, { new: true })
        return res.status(200).json({ message: "Post unliked successfully", success: true });
    }    catch (error) {
     console.log("Error unliking post:", error);
     return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const addcomment = async(req,res)=>{
    try {
         
        const postId = req.params.id;
        const { text } = req.body;
        if(!text){
            return res.status(400).json({ message: "Comment text is required", success: false });
        }
        const post = await Post.findById(postId);
        
        if(!post){
            return res.status(404).json({ message: "Post not found", success: false });
        }

       const comment = await Comment.create({
            text,
            author:req.id,
            post:postId
        })
        await comment.populate({path:"author", select:"username profilePicture"});
       
        post.comments.push(comment._id);
        await post.save();
        return res.status(201).json({ message: "Comment added successfully", success: true, comment });
    } catch (error) {
        console.log("Error adding comment:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}


export const getCommentsOfPost = async(req,res)=>{
    try {
        const postId = req.params.id;
        const comments = await Comment.find({post:postId}).sort({createdAt:-1}).populate({path:"author", select:"username profilePicture"});
       if(comments.length === 0){
        return res.status(404).json({ message: "No comments on this post", success: false });
       }
        return res.status(200).json({ message: "Comments fetched successfully", success: true, comments });
    } catch (error) {
        console.log("Error fetching comments:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const BookmarkPost = async(req,res)=>{
    try {
        const postId = req.params.id;
        const userId = req.id;
        const post = await Post.findById(postId );
        if(!post){
            return res.status(404).json({ message: "Post not found", success: false });
        }
        const user = await User.findById(userId);
        if( user.bookmarks.includes(postId)){
            await User.findByIdAndUpdate(userId, { $pull: { bookmarks: postId } });
            return res.status(200).json({ message: "Post unbookmarked successfully", success: true });
        }else{
            user.bookmarks.push(postId);
            await user.save();
            return res.status(200).json({ message: "Post bookmarked successfully", success: true });
        }
        
       
    }catch (error) {
        console.log("Error bookmarking post:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}