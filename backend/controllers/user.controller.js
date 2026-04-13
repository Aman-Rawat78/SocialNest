import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(401)
        .json({ message: "All fields are required", success: false });
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(401)
        .json({ message: "email already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    await User.create({ username, email, password: hashedPassword });
    res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .json({ message: "All fields are required", success: false });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Incorrect email or password", success: false });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Incorrect email or password", success: false });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    //populate each post if in the posts arrays
    const populatedPosts = (
      await Promise.all(
        user.posts.map(async (postId) => {
          const post = await Post.findById(postId);
         
          if (post && post.author && post.author.equals(user._id)) {
            return post;
          }
          return null;
        }),
      )
    ).filter(Boolean); //removes all nulls

    const userWithoutPassword = await User.findOne({ email }).select(
      "-password",
    );
    const userData = userWithoutPassword.toObject();

    return res.status(200).json({
      message: `Welcome back ${user.username}`,
      success: true,
      user: { ...userData, posts: populatedPosts },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};

export const logout = async (req, res) => {
  try {
    res
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Logged out successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password").populate({path:'posts',options: { sort: { createdAt: -1 }}}).populate('bookmarks');
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Profile fetched successfully", success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file; // Assuming you're using multer for file uploads

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri, {
        folder: "Instagram_Clone",
      });

      if (cloudResponse.error) {
        console.error("Cloudinary upload error:", cloudResponse.error);
        return res
          .status(500)
          .json({ message: "Cloudinary upload error", success: false });
      }

      // remove the old profile picture from cloudinary if exists
      if (user.profilePicture) {
        const segments = user.profilePicture.split("/");
        const publicId = segments[segments.length - 1].split(".")[0];
        return await cloudinary.uploader.destroy(`Instagram_Clone/${publicId}`);
      }
      user.profilePicture = cloudResponse.secure_url;
    }

    user.gender = gender || user.gender;
    user.bio = bio || user.bio;

    await user.save();

    return res
      .status(200)
      .json({ message: "Profile updated successfully", success: true, user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const Suggested = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } })
      .limit(5)
      .select("-password");
    if (!suggestedUsers) {
      return res
        .status(404)
        .json({ message: "No users found", success: false });
    }
    return res.status(200).json({
      message: "Suggested users fetched successfully",
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const loggedUser = req.id;
    const followingUser = req.params.id;

    const user = await User.findById(loggedUser);
    const targetUser = await User.findById(followingUser);

    if (!user || !targetUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const isFollowing = user.following.includes(followingUser);
    if (isFollowing) {
      user.following.pull(followingUser);
      targetUser.followers.pull(loggedUser);
      await user.save();
      await targetUser.save();
      return res
        .status(200)
        .json({ message: "Unfollowed successfully", success: true });
    } else {
      user.following.push(followingUser);
      targetUser.followers.push(loggedUser);
      await user.save();
      await targetUser.save();
      return res
        .status(200)
        .json({ message: "Followed successfully", success: true });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
