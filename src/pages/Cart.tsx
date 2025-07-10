
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import CartEmptyState from '@/components/cart/CartEmptyState';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import CheckoutForm from '@/components/cart/CheckoutForm';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };

  const handleOrderSubmit = () => {
    clearCart();
    setShowCheckout(false);
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <CartEmptyState />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">سلة المشتريات</h1>

        {!showCheckout ? (
          <>
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            <CartSummary totalPrice={getTotalPrice()} />

            <div className="flex gap-4">
              <Button onClick={() => setShowCheckout(true)} className="flex-1">
                إتمام الطلب
              </Button>
              <Link to="/">
                <Button variant="outline">متابعة التسوق</Button>
              </Link>
            </div>
          </>
        ) : (
          <CheckoutForm
            items={items}
            totalPrice={getTotalPrice()}
            onOrderSubmit={handleOrderSubmit}
            onBack={() => setShowCheckout(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default Cart;
