// App.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AdminRoute, Modal, Navbar, ProductDetails, ProtectedRoute, SobreNosotros } from "./components";
import {
  Admin,
  AllProducts,
  Cart,
  Checkout,
  CheckoutDetails,
  CheckoutSuccess,
  Contact,
  EditarPerfil,
  AddRecipeForm,
  Home,
  Home2,
  Home3,
  NotFound,
  OrderDetails,
  OrderHistory,
  ResetPassword,
  Review,
} from "./pages";
import ItemDetail from "./components/ItemDetail/ItemDetail";
import ItemEdit from "./components/ItemDetail/ItemEdit";
import FAQ from "./components/faq/FAQ";

const App = () => {
  return (
    <>
      <ToastContainer position="bottom-right" autoClose={4000} closeOnClick />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
        <Route path="/order-details/:id" element={<OrderDetails />} />
        <Route
          path="/review-product/:id"
          element={
            <ProtectedRoute>
              <Review />
            </ProtectedRoute>
          }
        />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/EditarPerfil" element={<EditarPerfil />} />
        <Route path="/AddRecipeForm" element={<AddRecipeForm />} />
        <Route path="/SobreNosotros" element={<SobreNosotros />} />
        <Route path="/all" element={<AllProducts />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout-details" element={<CheckoutDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout-success" element={<CheckoutSuccess />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/itemedit/:id" element={<ItemEdit />} />
        <Route path="/category" element={<Home2 />} />
        <Route path="/category/:categoryName" element={<Home3 />} />
        <Route path="/faq" element={<FAQ />} />
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        {/* 404 routes */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Modal />
    </>
  );
};

export default App;
