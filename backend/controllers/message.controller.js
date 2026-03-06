import { Conversation } from "../models/coversation.model.js";
import { Message } from "../models/message.model.js";


export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {message } = req.body;
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        // If no conversation exists, create a new one
        if(!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
       if(newMessage)  conversation.messages.push(newMessage._id);
        await conversation.save();

        //implement socket.io to send real-time messages

        return res.status(200).json({    message: "Message sent successfully",  newMessage, success: true });
    } catch (error) {
        console.log("Error sending message:", error);
        return res.status(500).json({
            message: error.message
        })
    }
}


export const getMessages = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });
        if (!conversation) {
            return res.status(200).json( {success:true, message:[] } );
        }
        return res.status(200).json({ success:true, messages: conversation?.messages });
    } catch (error) {
        console.log("Error getting messages:", error);
        return res.status(500).json({
            message: error.message
        })
    }
}

