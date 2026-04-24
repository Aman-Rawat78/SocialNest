import express from 'express';
import { CreateNewPost, deletePost,getAllposts,getUserPosts, getCommentsOfPost, likePost,unlikePost, addcomment,BookmarkPost } from '../controllers/post.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router()

router.route("/CreateNewPost").post(isAuthenticated, upload.single("image"), CreateNewPost)
router.route("/delete/:id").delete(isAuthenticated, deletePost)
router.route("/like/:id").put(isAuthenticated, likePost)
router.route("/unlike/:id").put(isAuthenticated, unlikePost)
router.route("/comments/:id").post(isAuthenticated, addcomment)
router.route("/getAllposts").get(isAuthenticated, getAllposts)
router.route("/getUserPosts/:id").get(isAuthenticated, getUserPosts)
router.route("/getCommentsOfPost/:id").get(isAuthenticated, getCommentsOfPost)
router.route("/BookmarkPost/:id").get(isAuthenticated, BookmarkPost)
export default router;   