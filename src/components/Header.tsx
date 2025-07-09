
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import TickerBar from './TickerBar';

const Header = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">ر</span>
              </div>
              <div className="mr-3 text-right">
                <h1 className="text-lg font-bold text-gray-900">مؤسسة رؤية</h1>
                <p className="text-xs text-gray-600">للطباعة والنشر</p>
              </div>
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-blue-600 transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="border-t py-2 overflow-x-auto">
            <div className="flex space-x-reverse space-x-6 min-w-max">
              <Link to="/" className="text-gray-700 hover:text-blue-600 text-sm font-medium py-2">
                الرئيسية
              </Link>
              <Link to="/categories" className="text-gray-700 hover:text-blue-600 text-sm font-medium py-2">
                التصنيفات
              </Link>
              <Link to="/knowledge-club" className="text-gray-700 hover:text-blue-600 text-sm font-medium py-2">
                نادي المعرفة
              </Link>
              <Link to="/draws-prizes" className="text-gray-700 hover:text-blue-600 text-sm font-medium py-2">
                السحوبات والجوائز
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 text-sm font-medium py-2">
                من نحن
              </Link>
            </div>
          </nav>
        </div>
      </header>
      <TickerBar />
    </>
  );
};

export default Header;
