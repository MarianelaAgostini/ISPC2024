import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   products: localStorage.getItem("recipe") ? JSON.parse(localStorage.getItem("recipe")) : [],
   minPrice: 0,
   maxPrice: 0,
};

const productSlice = createSlice({
   name: "recipe",
   initialState,
   reducers: {
      storeProducts(state, action) {
         state.products = action.payload.products;
         localStorage.setItem("recipe", JSON.stringify(action.payload.products));
      },
      getPriceRange(state, action) {
         const { products } = action.payload;
         const priceArray = products.map((item) => item.price);
         const max = Math.max(...priceArray);
         const min = Math.min(...priceArray);
         state.minPrice = min;
         state.maxPrice = max;
      },
   },
});

export const { storeProducts, getPriceRange } = productSlice.actions;

export default productSlice.reducer;
