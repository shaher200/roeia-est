
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, Calendar, Users, Trophy, Star } from 'lucide-react';

const mockWinners = [
  {
    id: 1,
    name: 'أحمد محمد علي',
    phone: '010****7890',
    sponsor: 'محمد أحمد',
    date: '2024-01-15',
    prize: '5000 جنيه نقداً'
  },
  {
    id: 2,
    name: 'فاطمة السيد',
    phone: '011****2345',
    sponsor: '-',
    date: '2024-02-15',
    prize: '5000 جنيه نقداً'
  },
  {
    id: 3,
    name: 'عبدالله حسن',
    phone: '012****6789',
    sponsor: 'سارة محمد',
    date: '2024-03-15',
    prize: 'عمرة مجانية'
  },
  {
    id: 4,
    name: 'مريم عبدالعزيز',
    phone: '015****1234',
    sponsor: '-',
    date: '2024-04-15',
    prize: '5000 جنيه نقداً'
  }
];

const terms = [
  'الاشتراك 100 جنيه فقط مرة واحدة لمدة سنتين',
  'السحب شهري على جائزة 5000 جنيه نقدًا',
  'يوجد سحب على عمرة شاملة التكاليف',
  'إذا فاز المشترك في أي سحب، لا يدخل أي سحب لاحق',
  'يمكن للشخص الاشتراك أكثر من مرة، وكل اشتراك = فرصة',
  'مثال: إذا اشترك 4 مرات وفاز، يتبقى له 3 فرص في السحوبات التالية',
  'أول سحب: 1 / 9 / 2025',
  'تمتد السحوبات لمدة 20 شهر فقط من هذا التاريخ',
  'أي مشترك جديد يُحسب له الاشتراك لمدة سنتين من تاريخ الدفع، لكنه يدخل فقط ما تبقى من السحوبات ضمن الـ20'
];

const DrawsPrizes = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">السحوبات والجوائز</h1>
          <p className="text-gray-600">تابع الفائزين واطلع على شروط المشاركة</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Winners Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                  قائمة الفائزين
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-3 px-2 font-semibold">اسم الفائز</th>
                        <th className="text-right py-3 px-2 font-semibold">رقم الهاتف</th>
                        <th className="text-right py-3 px-2 font-semibold">الراعي</th>
                        <th className="text-right py-3 px-2 font-semibold">تاريخ السحب</th>
                        <th className="text-right py-3 px-2 font-semibold">الجائزة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockWinners.map((winner) => (
                        <tr key={winner.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-2 font-medium">{winner.name}</td>
                          <td className="py-3 px-2 text-gray-600 ltr text-right">{winner.phone}</td>
                          <td className="py-3 px-2 text-gray-600">
                            {winner.sponsor === '-' ? 
                              <span className="text-gray-400">لا يوجد</span> : 
                              winner.sponsor
                            }
                          </td>
                          <td className="py-3 px-2 text-gray-600">{winner.date}</td>
                          <td className="py-3 px-2">
                            <Badge 
                              variant={winner.prize.includes('عمرة') ? 'default' : 'secondary'}
                              className={winner.prize.includes('عمرة') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                            >
                              {winner.prize}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Draw Info */}
            <Card className="bg-gradient-to-br from-blue-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  السحب القادم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-2">
                    1 سبتمبر 2025
                  </div>
                  <p className="text-gray-600 text-sm mb-4">موعد أول سحب</p>
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center justify-center mb-2">
                      <Gift className="h-6 w-6 text-yellow-600 mr-2" />
                      <span className="font-semibold">الجائزة</span>
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      5000 جنيه نقداً
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-600" />
                  إحصائيات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">إجمالي الفائزين:</span>
                    <span className="font-bold text-blue-600">{mockWinners.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">الجوائز النقدية:</span>
                    <span className="font-bold text-green-600">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">جوائز العمرة:</span>
                    <span className="font-bold text-orange-600">1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">الأعضاء النشطون:</span>
                    <span className="font-bold text-purple-600">1,250</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Terms and Conditions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              شروط المشاركة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {terms.map((term, index) => (
                <div key={index} className="flex items-start space-x-reverse space-x-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{term}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>تنبيه مهم:</strong> يرجى قراءة جميع الشروط بعناية قبل الاشتراك. 
                إدارة المؤسسة لها الحق في تعديل هذه الشروط عند الضرورة.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DrawsPrizes;
