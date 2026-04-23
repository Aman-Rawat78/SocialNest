import { createSlice } from "@reduxjs/toolkit";

const realtimeNotificationSlice = createSlice({
  name: "realtimeNotification",
  initialState: {
    likeNotification: [],
  },
  reducers: {
    setLikeNotification: (state, action) => {
        if(action.payload.type === "like") {
            state.likeNotification.push(action.payload);
        }else if(action.payload.type === "Unlike") {
            state.likeNotification = state.likeNotification.filter(
                (item) =>  !(item.postId === action.payload.postId && item.userId === action.payload.userId)
            );
        }
    },
  },   
});

export const { setLikeNotification } = realtimeNotificationSlice.actions;
export default realtimeNotificationSlice.reducer;