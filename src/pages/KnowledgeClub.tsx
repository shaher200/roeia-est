
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Star, Gift, Users, Video, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const KnowledgeClub = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    sponsorCode: '',
    paymentMethod: '',
    receipt: null as File | null
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const benefits = [
    {
      icon: Gift,
      title: 'سحب شهري 5000 جنيه',
      description: 'فرصة للفوز بجائزة نقدية كل شهر'
    },
    {
      icon: Star,
      title: 'سحب على عمرة مجانية',
      description: 'عمرة شاملة التكاليف'
    },
    {
      icon: Users,
      title: 'خصم 20% على الكتب',
      description: 'خصم حصري لأعضاء النادي'
    },
    {
      icon: MessageSquare,
      title: 'قناة تيليجرام خاصة',
      description: 'محتوى حصري وتفاعل مباشر'
    },
    {
      icon: Video,
      title: 'قناة يوتيوب حصرية',
      description: 'فيديوهات تعليمية مميزة'
    },
    {
      icon: Gift,
      title: 'مكافأة الإحالة',
      description: '100 جنيه لكل 5 أصدقاء تدعوهم'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, receipt: file }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال الاسم الكامل",
        variant: "destructive"
      });
      return false;
    }

    const phoneRegex = /^(010|011|012|015)\d{8}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رقم هاتف صحيح (11 رقم يبدأ بـ 010/011/012/015)",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.paymentMethod) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار طريقة الدفع",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.receipt) {
      toast({
        title: "خطأ",
        description: "يرجى رفع صورة إيصال الدفع",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitted(true);
      toast({
        title: "تم الإرسال بنجاح",
        description: "سيتم مراجعة طلبكم خلال 24 ساعة",
      });
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8">
              <div className="text-green-600 text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                تم الاشتراك بنجاح!
              </h2>
              <p className="text-green-700 text-lg mb-6">
                نشكركم على الاشتراك في نادي المعرفة. سيتم مراجعة الطلب خلال 24 ساعة.
              </p>
              <Button 
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    fullName: '',
                    phoneNumber: '',
                    sponsorCode: '',
                    paymentMethod: '',
                    receipt: null
                  });
                }}
                variant="outline"
              >
                اشتراك جديد
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">نادي المعرفة</h1>
          <p className="text-gray-600 text-lg">
            انضم إلينا واستمتع بتجربة معرفية فريدة مع مزايا حصرية
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Benefits Section */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl text-center text-blue-600">
                  مزايا العضوية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {benefits.map((benefit, index) => {
                    const IconComponent = benefit.icon;
                    return (
                      <div key={index} className="flex items-start space-x-reverse space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                          <p className="text-gray-600 text-sm">{benefit.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Alert className="bg-orange-50 border-orange-200">
              <AlertDescription className="text-orange-800">
                <strong>رسوم الاشتراك:</strong> 100 جنيه فقط لمدة سنتين كاملتين
              </AlertDescription>
            </Alert>
          </div>

          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-center">نموذج التسجيل</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="fullName">الاسم الكامل *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="أدخل اسمك الكامل بالعربية"
                    className="text-right"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNumber">رقم الهاتف *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="text-right ltr"
                    maxLength={11}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    11 رقم يبدأ بـ 010 أو 011 أو 012 أو 015
                  </p>
                </div>

                <div>
                  <Label htmlFor="sponsorCode">كود الراعي (اختياري)</Label>
                  <Input
                    id="sponsorCode"
                    type="text"
                    value={formData.sponsorCode}
                    onChange={(e) => handleInputChange('sponsorCode', e.target.value)}
                    placeholder="أدخل كود الراعي إن وجد"
                    className="text-right"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">طريقة الدفع *</Label>
                  <RadioGroup 
                    value={formData.paymentMethod} 
                    onValueChange={(value) => handleInputChange('paymentMethod', value)}
                    className="mt-3 space-y-4"
                  >
                    <div className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-reverse space-x-2 mb-2">
                        <RadioGroupItem value="vodafone" id="vodafone" />
                        <Label htmlFor="vodafone" className="font-medium">فودافون كاش</Label>
                      </div>
                      {formData.paymentMethod === 'vodafone' && (
                        <div className="mr-6 text-sm text-blue-500 space-y-1">
                          <p>• قم بتحويل المبلغ على محفظة رقم 01026217597</p>
                          <p>• احتفظ بإيصال العملية</p>
                          <p>• ارفق صورة الإيصال أدناه</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-reverse space-x-2 mb-2">
                        <RadioGroupItem value="instapay" id="instapay" />
                        <Label htmlFor="instapay" className="font-medium">انستاباي</Label>
                      </div>
                      {formData.paymentMethod === 'instapay' && (
                        <div className="mr-6 text-sm text-blue-500 space-y-1">
                          <p>• قم بالتحويل عبر انستاباي على رقم 01270439417</p>
                          <p>• احتفظ بإيصال العملية</p>
                          <p>• ارفق صورة الإيصال أدناه</p>
                        </div>
                      )}
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="receipt">صورة إيصال الدفع *</Label>
                  <div className="mt-2">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          {formData.receipt ? formData.receipt.name : 'اضغط لرفع الصورة'}
                        </p>
                      </div>
                      <input
                        id="receipt"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                        required
                      />
                    </label>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  إرسال طلب الاشتراك
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default KnowledgeClub;
