import { configureStore } from "@reduxjs/toolkit";
import { CommentLength } from "../Redux/InfoPost";

export const store = configureStore({
    reducer: {
        commentLength: CommentLength,
    }
})