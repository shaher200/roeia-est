
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, BookOpen, Trophy, Users, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const KnowledgeClub = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast({
        title: "خطأ",
        description: "يرجى تعبئة جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save membership to database if user is logged in
      if (user) {
        const { error } = await supabase
          .from('knowledge_club_memberships')
          .insert({
            user_id: user.id,
            name: formData.name,
            phone: formData.phone,
            status: 'active'
          });

        if (error) {
          throw error;
        }
      }

      setShowSuccess(true);
      setFormData({ name: '', phone: '' });
    } catch (error: any) {
      toast({
        title: "خطأ في الاشتراك",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">نادي المعرفة</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            انضم إلى مجتمع القراء والمثقفين واستمتع بتجربة تعليمية متميزة مع خصومات حصرية ومسابقات شهرية
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <BookOpen className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <CardTitle className="text-lg">خصومات حصرية</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">احصل على خصم يصل إلى 30% على جميع الكتب</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Trophy className="h-12 w-12 mx-auto text-orange-600 mb-4" />
              <CardTitle className="text-lg">مسابقات شهرية</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">شارك في مسابقات شهرية واربح جوائز قيمة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <CardTitle className="text-lg">مجتمع القراء</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">تفاعل مع مجتمع من محبي القراءة والمعرفة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto text-purple-600 mb-4" />
              <CardTitle className="text-lg">قنوات تعليمية</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">اشترك في قنوات تعليمية خاصة بأعضاء النادي</p>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Section */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">اشترك الآن في نادي المعرفة</CardTitle>
              <CardDescription>
                رسوم الاشتراك السنوي: <span className="text-2xl font-bold text-orange-600">100 جنيه فقط</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!user ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">يجب عليك تسجيل الدخول أولاً للاشتراك في نادي المعرفة</p>
                  <Button onClick={() => window.location.href = '/auth'}>
                    تسجيل الدخول
                  </Button>
                </div>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
                      اشترك الآن
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>تأكيد الاشتراك</DialogTitle>
                      <DialogDescription>
                        اشتراك نادي المعرفة - 100 جنيه سنوياً
                      </DialogDescription>
                    </DialogHeader>

                    {showSuccess ? (
                      <div className="text-center py-6">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-green-600 mb-2">تم الاشتراك بنجاح!</h3>
                        <p className="text-gray-600">مرحباً بك في نادي المعرفة</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="name">الاسم الكامل</Label>
                          <Input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                            className="text-right"
                            placeholder="أدخل اسمك الكامل"
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone">رقم الهاتف</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            required
                            className="text-right"
                            placeholder="01xxxxxxxxx"
                          />
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'جارٍ المعالجة...' : 'تأكيد الاشتراك - 100 جنيه'}
                        </Button>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default KnowledgeClub;
