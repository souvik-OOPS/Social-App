import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// ✅ Async Thunks
export const getFeed = createAsyncThunk("post/getFeed", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get("/posts/feed");
        return res.data.posts;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch feed");
    }
});

export const createPost = createAsyncThunk("post/createPost", async (formData, { rejectWithValue }) => {
    try {
        const res = await api.post("/posts/create", formData);
        return res.data.post;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create post");
    }
});

export const likePost = createAsyncThunk("post/likePost", async (postId, { rejectWithValue }) => {
    try {
        const res = await api.put(`/posts/${postId}/like`);
        return { postId, ...res.data };
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to like post");
    }
});

export const addComment = createAsyncThunk("post/addComment", async ({ postId, text }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/posts/${postId}/comment`, { text });
        return { postId, comment: res.data.comment };
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to add comment");
    }
});

const postSlice = createSlice({
    name: "post",
    initialState: {
        posts: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearPostError: (state) => {
            state.error = null;
        },
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
    },
    extraReducers: (builder) => {
        // getFeed
        builder.addCase(getFeed.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getFeed.fulfilled, (state, action) => {
            state.loading = false;
            state.posts = action.payload;
        });
        builder.addCase(getFeed.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // createPost
        builder.addCase(createPost.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createPost.fulfilled, (state, action) => {
            state.loading = false;
            state.posts.unshift(action.payload);
        });
        builder.addCase(createPost.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // likePost
        builder.addCase(likePost.fulfilled, (state, action) => {
            const post = state.posts.find(p => p._id === action.payload.postId);
            if (post && action.payload.post) {
                Object.assign(post, action.payload.post);
            }
        });

        // addComment
        builder.addCase(addComment.fulfilled, (state, action) => {
            const post = state.posts.find(p => p._id === action.payload.postId);
            if (post) {
                post.comments.push(action.payload.comment);
            }
        });
    },
});

export default postSlice.reducer;
export const {
    clearPostError,
    setPosts,
} = postSlice.actions;