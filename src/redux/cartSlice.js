import { createSlice } from '@reduxjs/toolkit';
import { localStorageUtils } from '../utils/localStorage';

const initialState = {
  cartItems: localStorageUtils.getCart()
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cartItems.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
      localStorageUtils.saveCart(state.cartItems);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          state.cartItems = state.cartItems.filter(i => i.id !== id);
        }
      }
      localStorageUtils.saveCart(state.cartItems);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
      localStorageUtils.saveCart(state.cartItems);
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorageUtils.clearCart();
    }
  }
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.cartItems;
export const selectTotalItems = (state) =>
  state.cart.cartItems.reduce((total, item) => total + item.quantity, 0);
export const selectTotalPrice = (state) =>
  state.cart.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectItemQuantity = (id) => (state) => {
  const item = state.cart.cartItems.find(item => item.id === id);
  return item ? item.quantity : 0;
};

export default cartSlice.reducer;
