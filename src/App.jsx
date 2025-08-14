import React, { useState, useEffect } from 'react';
import { apiService } from './services/api';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  selectTotalItems,
  selectTotalPrice,
  selectItemQuantity,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart
} from './redux/cartSlice';

import ProductList from './components/ProductList';
import Cart from './components/Cart';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectTotalItems);
  const totalPrice = useSelector(selectTotalPrice);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const desserts = await apiService.getDesserts();
        setProducts(desserts);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleConfirmOrder = () => setShowModal(true);
  const handleStartNewOrder = () => {
    dispatch(clearCart());
    setShowModal(false);
  };
  const handleCloseModal = () => setShowModal(false);

  if (loading) {
    return <div className="app"><p>Loading...</p></div>;
  }

  if (error) {
    return (
      <div className="app">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <main className="main-content">
          <ProductList
            products={products}
            onAddToCart={(p) => dispatch(addToCart(p))}
            getItemQuantity={(id) => useSelector(selectItemQuantity(id))}
            onUpdateQuantity={(id, q) => dispatch(updateQuantity({ id, quantity: q }))}
          />
        </main>

        <aside className="sidebar">
          <Cart
            cartItems={cartItems}
            totalItems={totalItems}
            totalPrice={totalPrice}
            onUpdateQuantity={(id, q) => dispatch(updateQuantity({ id, quantity: q }))}
            onRemoveItem={(id) => dispatch(removeFromCart(id))}
            onConfirmOrder={handleConfirmOrder}
          />
        </aside>
      </div>

      <OrderConfirmationModal
        isOpen={showModal}
        cartItems={cartItems}
        totalPrice={totalPrice}
        onStartNewOrder={handleStartNewOrder}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
