import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isUserLoggedIn: false,
	email: null,
	userName: null,
	userId: null,
	role: null, // Agrega un campo para el rol en tu estado inicial
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setActiveUser: (state, action) => {
			const { email, userName, userId } = action.payload;
			state.isUserLoggedIn = true;
			state.email = email;
			state.userName = userName;
			state.userId = userId;
		},
		removeActiveUser: (state) => {
			state.isUserLoggedIn = false;
			state.email = null;
			state.userName = null;
			state.userId = null;
			state.role = null; // Limpia el rol cuando el usuario cierra sesión
		},
		setRole: (state, action) => {
			state.role = action.payload; // Agrega un nuevo reducer para establecer el rol
		},
	},
});

export const selectAuthSlice = (store) => store.auth;

export const { setActiveUser, removeActiveUser, setRole } = authSlice.actions; // Exporta tu nueva acción

export default authSlice.reducer;
