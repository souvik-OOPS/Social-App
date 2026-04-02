import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get("/auth/me");
        return res.data.user;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Session expired");
    }
});

export const signUp = createAsyncThunk("auth/signUp", async (data, { rejectWithValue }) => {
    try {
        const res = await api.post("/auth/signup", data);
        return res.data.user;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
});

export const signIn = createAsyncThunk("auth/signIn", async (data, { rejectWithValue }) => {
    try {
        const res = await api.post("/auth/signin", data);
        return res.data.user;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Signin failed");
    }
});

export const signOut = createAsyncThunk("auth/signOut", async (_, { rejectWithValue }) => {
    try {
        await api.get("/auth/signout");
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Signout failed");
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        checkingSession: true,
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearUser: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCurrentUser.pending, (state) => {
            state.checkingSession = true;
            state.error = null;
        });
        builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
            state.checkingSession = false;
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        });
        builder.addCase(fetchCurrentUser.rejected, (state) => {
            state.checkingSession = false;
            state.user = null;
            state.error = null;
            localStorage.removeItem("user");
        });

        // signUp
        builder.addCase(signUp.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(signUp.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        });
        builder.addCase(signUp.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // signIn
        builder.addCase(signIn.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(signIn.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        });
        builder.addCase(signIn.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // signOut
        builder.addCase(signOut.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(signOut.fulfilled, (state) => {
            state.loading = false;
            state.user = null;
            localStorage.removeItem("user");
        });
        builder.addCase(signOut.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export default authSlice.reducer;
export const {
    setUser,
    clearError,
    clearUser,
} = authSlice.actions;
