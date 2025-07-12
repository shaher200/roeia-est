
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import TickerBar from './TickerBar';

const Header = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/13c0898b-4b2b-4271-b5d7-6bf53372ad7a.png" 
                alt="مؤسسة رؤية للطباعة والنشر" 
                className="w-12 h-12 object-contain"
              />
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

          {/* Navigation - تحسين للموبايل */}
          <nav className="border-t py-2 bg-white">
            <div className="flex justify-center space-x-reverse space-x-1">
              <Link to="/" className="text-blue-800 hover:text-blue-600 text-xs font-medium py-2 px-1">
                الرئيسية
              </Link>
              <Link to="/categories" className="text-blue-800 hover:text-blue-600 text-xs font-medium py-2 px-1">
                التصنيفات
              </Link>
              <Link to="/knowledge-club" className="text-blue-800 hover:text-blue-600 text-xs font-medium py-2 px-1">
                نادي المعرفة
              </Link>
              <Link to="/draws-prizes" className="text-blue-800 hover:text-blue-600 text-xs font-medium py-2 px-1">
                السحوبات
              </Link>
              <Link to="/about" className="text-blue-800 hover:text-blue-600 text-xs font-medium py-2 px-1">
                من نحن
              </Link>
            </div>
          </nav>
        </div>
        <TickerBar />
      </header>
    </>
  );
};

export default Header;
