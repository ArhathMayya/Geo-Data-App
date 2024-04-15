// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  openItem: ['dashboard'],
  defaultId: 'dashboard',
  openComponent: 'buttons',
  drawerOpen: false,
  componentDrawerOpen: true,
  login: false,
  loginpage: true,
  
};

// ==============================|| SLICE - MENU ||============================== //

const menu = createSlice({
  name: 'menu',
  initialState,
  reducers: {


    isLogin(state, action) {
      state.login = action.payload.login;
    },

    isLoginpage(state, action) {
      state.loginpage = action.payload.loginpage;
    }
  }
});

export default menu.reducer;

export const { activeItem, activeComponent, openDrawer, openComponentDrawer, isLogin, isLoginpage } = menu.actions;
