
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  cover: string;
  category: string;
}

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book);
    toast({
      title: "تم إضافة الكتاب للسلة",
      description: `تم إضافة "${book.title}" إلى سلة المشتريات`,
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 h-full">
      <CardContent className="p-4">
        <Link to={`/book/${book.id}`}>
          <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3 overflow-hidden">
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 h-10">
            {book.title}
          </h3>
          <p className="text-gray-600 text-xs mb-2">{book.author}</p>
        </Link>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-blue-600 font-bold text-sm">
            {book.price} جنيه
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {book.category}
          </span>
        </div>

        <Button 
          onClick={handleAddToCart}
          size="sm" 
          className="w-full text-xs"
        >
          <ShoppingCart className="h-3 w-3 mr-1" />
          أضف للسلة
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookCard;
