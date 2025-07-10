
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

const CartEmptyState = () => {
  return (
    <div className="text-center">
      <ShoppingCart className="mx-auto h-24 w-24 text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-4">سلة المشتريات فارغة</h2>
      <p className="text-gray-600 mb-6">لا توجد كتب في سلة المشتريات حالياً</p>
      <Link to="/">
        <Button>تصفح الكتب</Button>
      </Link>
    </div>
  );
};

export default CartEmptyState;
