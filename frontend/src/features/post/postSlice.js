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

export const likePost = createAsyncThunk("post/likePost", async ({ postId }, { rejectWithValue }) => {
    try {
        const res = await api.put(`/posts/${postId}/like`);
        return { postId, ...res.data };
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to like post");
    }
});

export const addComment = createAsyncThunk("post/addComment", async ({ postId, text, tempId }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/posts/${postId}/comment`, { text });
        return { postId, comment: res.data.comment, tempId };
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
        builder.addCase(likePost.pending, (state, action) => {
            const { postId, userId, userName } = action.meta.arg;
            const post = state.posts.find((p) => p._id === postId);
            if (!post || !userId) return;

            const alreadyLiked = post.likes?.some(
                (id) => id === userId || id?._id === userId,
            );

            if (alreadyLiked) {
                post.likes = post.likes.filter(
                    (id) => id !== userId && id?._id !== userId,
                );
                if (Array.isArray(post.likedUserNames)) {
                    post.likedUserNames = post.likedUserNames.filter((name) => name !== userName);
                }
            } else {
                post.likes = [...(post.likes || []), userId];
                if (Array.isArray(post.likedUserNames)) {
                    post.likedUserNames = [...post.likedUserNames, userName];
                }
            }
        });
        builder.addCase(likePost.fulfilled, (state, action) => {
            const post = state.posts.find(p => p._id === action.payload.postId);
            if (post && action.payload.post) {
                Object.assign(post, action.payload.post);
            }
        });
        builder.addCase(likePost.rejected, (state, action) => {
            const { postId, userId, userName } = action.meta.arg;
            const post = state.posts.find((p) => p._id === postId);
            if (post && userId) {
                const alreadyLiked = post.likes?.some(
                    (id) => id === userId || id?._id === userId,
                );

                if (alreadyLiked) {
                    post.likes = post.likes.filter(
                        (id) => id !== userId && id?._id !== userId,
                    );
                    if (Array.isArray(post.likedUserNames)) {
                        post.likedUserNames = post.likedUserNames.filter((name) => name !== userName);
                    }
                } else {
                    post.likes = [...(post.likes || []), userId];
                    if (Array.isArray(post.likedUserNames)) {
                        post.likedUserNames = [...post.likedUserNames, userName];
                    }
                }
            }
            state.error = action.payload;
        });

        // addComment
        builder.addCase(addComment.pending, (state, action) => {
            const { postId, text, tempId, userName } = action.meta.arg;
            const post = state.posts.find((p) => p._id === postId);
            if (!post) return;

            post.comments.push({
                _id: tempId,
                text,
                userName,
                createdAt: new Date().toISOString(),
                pending: true,
            });
        });
        builder.addCase(addComment.fulfilled, (state, action) => {
            const post = state.posts.find(p => p._id === action.payload.postId);
            if (post) {
                const commentIndex = post.comments.findIndex(
                    (comment) => comment._id === action.payload.tempId,
                );
                if (commentIndex !== -1) {
                    post.comments[commentIndex] = action.payload.comment;
                } else {
                    post.comments.push(action.payload.comment);
                }
            }
        });
        builder.addCase(addComment.rejected, (state, action) => {
            const { postId, tempId } = action.meta.arg;
            const post = state.posts.find((p) => p._id === postId);
            if (post) {
                post.comments = post.comments.filter((comment) => comment._id !== tempId);
            }
            state.error = action.payload;
        });
    },
});

export default postSlice.reducer;
export const {
    clearPostError,
    setPosts,
} = postSlice.actions;
