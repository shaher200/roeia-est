
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

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
  return (
    <Link to={`/book/${book.id}`}>
      <Card className="hover:shadow-lg transition-shadow duration-200 h-full">
        <CardContent className="p-4">
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
          <div className="flex justify-between items-center">
            <span className="text-blue-600 font-bold text-sm">
              {book.price} جنيه
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {book.category}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BookCard;
