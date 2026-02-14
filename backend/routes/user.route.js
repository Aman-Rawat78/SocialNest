import express from 'express';
import { register, login, logout, getProfile, editProfile,Suggested,followOrUnfollow} from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
const router = express.Router();

// Example user route
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route("/:id/profile").get(isAuthenticated, getProfile);
router.route("/profile/edit").post(isAuthenticated,upload.single("profilePicture"), editProfile);
router.route('/suggested').get(isAuthenticated, Suggested);
router.route('/followOrUnfollow/:id').get(isAuthenticated, followOrUnfollow);

export default router;