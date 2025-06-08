import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { toast } from "react-hot-toast";

type InitialState = {
  items: CartItem[];
};

type CartItem = {
  _id: string;
  name: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  images?: string[];
  category: string;
  stock: number;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  reviews: number;
};

const initialState: InitialState = {
  items: [],
};

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const { _id, name, price, quantity, discountedPrice, images } = action.payload;
      const existingItem = state.items.find((item) => item._id === _id);      
      if (existingItem) {
        existingItem.quantity += quantity;
        toast.success('Cập nhật số lượng thành công');
        return
      } else {
        state.items.push({
          ...action.payload,
          _id,
          name,
          price,
          quantity,
          discountedPrice,
          images,
        });
      }
      toast.success("Thêm vào giỏ hàng thành công");

    },
    removeItemFromCart: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item._id !== itemId);
      toast.success('Xóa sản phẩm khỏi giỏ hàng thành công');
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item._id === id);

      if (existingItem) {
        existingItem.quantity = quantity;
        toast.success('Cập nhật số lượng thành công');
      }
    },
    removeAllItemsFromCart: (state) => {
      state.items = [];
      toast.success('Xóa tất cả sản phẩm khỏi giỏ hàng thành công');
    },
    clearCart: (state) => {
      state.items = [];
        },
  },
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
  return items.reduce((total, item) => {
    return total + item.discountedPrice * item.quantity;
  }, 0);
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart,
  clearCart
} = cart.actions;
export default cart.reducer;
