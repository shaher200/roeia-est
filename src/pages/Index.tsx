
import Layout from '@/components/Layout';
import BookCard from '@/components/BookCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';

const mockBooks = [
  {
    id: 1,
    title: 'الأسود يليق بك',
    author: 'أحلام مستغانمي',
    price: 85,
    cover: '/placeholder.svg',
    category: 'روايات',
    year: 2020
  },
  {
    id: 2,
    title: 'مئة عام من العزلة',
    author: 'جابرييل جارسيا ماركيز',
    price: 120,
    cover: '/placeholder.svg',
    category: 'روايات',
    year: 2019
  },
  {
    id: 3,
    title: 'فن اللامبالاة',
    author: 'مارك مانسون',
    price: 75,
    cover: '/placeholder.svg',
    category: 'تنمية ذاتية',
    year: 2021
  },
  {
    id: 4,
    title: 'رياض الصالحين',
    author: 'الإمام النووي',
    price: 95,
    cover: '/placeholder.svg',
    category: 'كتب دينية',
    year: 2020
  },
  {
    id: 5,
    title: 'قصص الأنبياء للأطفال',
    author: 'محمد السعيد',
    price: 60,
    cover: '/placeholder.svg',
    category: 'أطفال',
    year: 2022
  },
  {
    id: 6,
    title: 'العادات السبع للناس الأكثر فعالية',
    author: 'ستيفن كوفي',
    price: 110,
    cover: '/placeholder.svg',
    category: 'تنمية ذاتية',
    year: 2020
  }
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = useMemo(() => {
    if (!searchTerm) return mockBooks;
    return mockBooks.filter(book =>
      book.title.includes(searchTerm) ||
      book.author.includes(searchTerm) ||
      book.category.includes(searchTerm)
    );
  }, [searchTerm]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Search Section */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="البحث في الكتب..."
              className="pr-10 text-right"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            مرحباً بكم في مكتبتنا الإلكترونية
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            اكتشف مجموعة واسعة من الكتب المختارة بعناية في جميع المجالات. 
            انضم إلى نادي المعرفة واستفد من العروض الحصرية والمسابقات الشهرية.
          </p>
        </div>

        {/* Featured Books */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">الكتب المميزة</h3>
            <span className="text-sm text-gray-500">
              ({filteredBooks.length}) كتاب
            </span>
          </div>

          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">لم يتم العثور على كتب مطابقة للبحث</p>
            </div>
          )}
        </div>

        {/* Knowledge Club CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-xl p-6 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">انضم إلى نادي المعرفة</h3>
          <p className="mb-4 opacity-90">
            استمتع بخصومات حصرية، مسابقات شهرية، وقنوات تعليمية خاصة
          </p>
          <a
            href="/knowledge-club"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            اشترك الآن - 100 جنيه فقط
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
