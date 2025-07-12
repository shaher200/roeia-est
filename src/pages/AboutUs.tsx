
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Eye, Target, Heart, Book, Users, Award } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { icon: Book, label: 'الكتب المنشورة', value: '500+' },
    { icon: Users, label: 'أعضاء نادي المعرفة', value: '1,250+' },
    { icon: Award, label: 'سنوات الخبرة', value: '15+' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'الجودة والتميز',
      description: 'نلتزم بتقديم محتوى عالي الجودة يلبي احتياجات قرائنا'
    },
    {
      icon: Users,
      title: 'خدمة المجتمع',
      description: 'نسعى لنشر المعرفة والثقافة في جميع أنحاء الوطن العربي'
    },
    {
      icon: Book,
      title: 'التنوع الثقافي',
      description: 'نقدم محتوى متنوع يشمل جميع المجالات والتخصصات'
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">من نحن</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            مؤسسة رؤية للطباعة والنشر - رائدة في عالم النشر والمعرفة منذ أكثر من عقد من الزمان
          </p>
        </div>

        {/* About Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Eye className="h-6 w-6 mr-2" />
                  رؤيتنا
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  أن نكون المرجع الأول في العالم العربي لنشر المحتوى المعرفي والثقافي المتميز، 
                  ونساهم في بناء جيل واعٍ ومثقف قادر على مواجهة تحديات المستقبل بالعلم والمعرفة.
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <Target className="h-6 w-6 mr-2" />
                  رسالتنا
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  نلتزم بتقديم محتوى عالي الجودة يثري الحياة الثقافية والفكرية لقرائنا، 
                  من خلال نشر الكتب المتنوعة وتوفير منصة معرفية تفاعلية تجمع محبي القراءة والتعلم.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="text-center bg-gradient-to-br from-blue-50 to-orange-50">
                <CardContent className="p-6">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Our Values */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-center text-2xl">قيمنا ومبادئنا</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Story Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">قصتنا</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-center mb-6">
                تأسست مؤسسة رؤية للطباعة والنشر عام 2009 برؤية طموحة لتكون جسراً بين المؤلفين والقراء، 
                ومنصة لنشر المعرفة والثقافة في العالم العربي.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 text-right">
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-blue-600">البدايات</h4>
                  <p>
                    بدأنا كمطبعة صغيرة تخدم المؤلفين المحليين، وسرعان ما نمونا لنصبح 
                    دار نشر معترف بها على مستوى الوطن العربي.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-orange-600">التطور</h4>
                  <p>
                    مع التطور التكنولوجي، أطلقنا منصتنا الرقمية ونادي المعرفة، 
                    لنواكب احتياجات العصر الحديث ونصل إلى شريحة أوسع من القراء.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">تواصل معنا</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">الهاتف</h4>
                <p className="text-gray-600 ltr">01270439417</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                  <Mail className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold mb-2">البريد الإلكتروني</h4>
                <p className="text-gray-600 ltr">roeia.est@outlook.com</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">العنوان</h4>
                <p className="text-gray-600">طريق الكلية البحرية - خلف مدرسة المنار - المعمورة البلد - الاسكندرية</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">نحن هنا لخدمتكم ونتطلع لسماع آرائكم واقتراحاتكم</p>
              <div className="flex justify-center space-x-reverse space-x-4">
                <a
                  href="https://wa.me/201270439417"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  واتساب
                </a>
                <a
                  href="https://t.me/+201270439417"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  تيليجرام
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AboutUs;
