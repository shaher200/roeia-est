
import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import BookCard from '@/components/BookCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const categories = [
  { value: 'all', label: 'جميع التصنيفات' },
  { value: 'روايات', label: 'روايات' },
  { value: 'كتب دينية', label: 'كتب دينية' },
  { value: 'تنمية ذاتية', label: 'تنمية ذاتية' },
  { value: 'أطفال', label: 'أطفال' },
];

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredBooks = useMemo(() => {
    if (selectedCategory === 'all') return mockBooks;
    return mockBooks.filter(book => book.category === selectedCategory);
  }, [selectedCategory]);

  const selectedCategoryLabel = categories.find(cat => cat.value === selectedCategory)?.label || 'جميع التصنيفات';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">تصنيفات الكتب</h1>
          <p className="text-gray-600">اختر التصنيف المناسب لك واستكشف مجموعتنا المتنوعة</p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="max-w-xs mx-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full text-right">
                <SelectValue placeholder="اختر التصنيف" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Books Display */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategoryLabel}
            </h2>
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
              <p className="text-gray-500 text-lg">لا توجد كتب في هذا التصنيف حالياً</p>
            </div>
          )}
        </div>

        {/* Category Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {categories.slice(1).map((category) => {
            const count = mockBooks.filter(book => book.category === category.value).length;
            return (
              <div
                key={category.value}
                className={`p-4 rounded-lg text-center cursor-pointer transition-all ${
                  selectedCategory === category.value
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(category.value)}
              >
                <div className="text-2xl font-bold text-blue-600">{count}</div>
                <div className="text-sm text-gray-700">{category.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
