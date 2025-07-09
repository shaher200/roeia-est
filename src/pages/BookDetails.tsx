
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';

const mockBooks = [
  {
    id: 1,
    title: 'الأسود يليق بك',
    author: 'أحلام مستغانمي',
    price: 85,
    cover: '/placeholder.svg',
    category: 'روايات',
    year: 2020,
    description: 'رواية عاطفية عميقة تتناول قصة حب معقدة تجمع بين الماضي والحاضر، وتكشف عن أسرار الذاكرة والهوية.',
    pages: 320,
    publisher: 'مؤسسة رؤية للطباعة والنشر'
  },
  {
    id: 2,
    title: 'مئة عام من العزلة',
    author: 'جابرييل جارسيا ماركيز',
    price: 120,
    cover: '/placeholder.svg',
    category: 'روايات',
    year: 2019,
    description: 'ملحمة أدبية تروي تاريخ عائلة بوينديا عبر سبعة أجيال في قرية ماكوندو الخيالية.',
    pages: 448,
    publisher: 'مؤسسة رؤية للطباعة والنشر'
  }
];

const BookDetails = () => {
  const { id } = useParams();
  const book = mockBooks.find(b => b.id === parseInt(id || '1'));

  if (!book) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">الكتاب غير موجود</h2>
            <Link to="/">
              <Button>العودة للرئيسية</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowRight className="h-4 w-4 mr-2" />
          العودة للكتب
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Book Cover */}
          <div className="flex justify-center">
            <Card className="max-w-sm">
              <CardContent className="p-6">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
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
              </CardContent>
            </Card>
          </div>

          {/* Book Information */}
          <div className="space-y-6">
            <div>
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mb-3">
                {book.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <User className="h-4 w-4 mr-2" />
                <span>{book.author}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>سنة النشر: {book.year}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Tag className="h-4 w-4 mr-2" />
                <span>عدد الصفحات: {book.pages}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span>الناشر: {book.publisher}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">وصف الكتاب</h3>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-blue-600">
                  {book.price} جنيه
                </span>
                <div className="text-sm text-gray-500">
                  للمراجعة والاطلاع فقط
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-2">
                * هذا الكتاب معروض للتصفح والمراجعة. للحصول على نسخة، يرجى التواصل معنا.
              </p>
            </div>

            {/* Knowledge Club Benefits */}
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-orange-800 mb-2">
                  🎯 مزايا أعضاء نادي المعرفة
                </h4>
                <ul className="text-orange-700 text-sm space-y-1">
                  <li>• خصم 20% على جميع الكتب</li>
                  <li>• الدخول في السحوبات الشهرية</li>
                  <li>• الوصول للقنوات الحصرية</li>
                </ul>
                <Link to="/knowledge-club">
                  <Button size="sm" className="mt-3 bg-orange-500 hover:bg-orange-600">
                    انضم الآن
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookDetails;
