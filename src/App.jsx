import React from 'react';
import { Header } from './components/Header';
import { ProductList } from './components/ProductList';
import { CartSidebar } from './components/CartSidebar';
import { ToastNotification } from './components/ToastNotification';

function App() {
  return (
    <>
      <Header />
      <main className="container">
        <ProductList />
      </main>
      <CartSidebar />
      <ToastNotification />
    </>
  );
}

export default App;
