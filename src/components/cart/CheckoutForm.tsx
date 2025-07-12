
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: number;
  title: string;
  author: string;
  price: number;
  cover: string;
  quantity: number;
}

interface CheckoutFormProps {
  items: CartItem[];
  totalPrice: number;
  onOrderSubmit: () => void;
  onBack: () => void;
}

const CheckoutForm = ({ items, totalPrice, onOrderSubmit, onBack }: CheckoutFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    paymentMethod: '',
    receipt: null as File | null
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phoneNumber || !formData.paymentMethod) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    // Phone validation
    const phoneRegex = /^(010|011|012|015)\d{8}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast({
        title: "رقم الهاتف غير صحيح",
        description: "يجب أن يبدأ الرقم بـ 010 أو 011 أو 012 أو 015 ويتكون من 11 رقم",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitted(true);
  };

  const handleNewOrder = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: '',
      phoneNumber: '',
      paymentMethod: '',
      receipt: null
    });
    onOrderSubmit();
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <div className="w-16 h-16 bg-green-500 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              تم شراء الكتب بنجاح
            </h2>
            <p className="text-green-700 text-lg mb-6">
              نشكركم على الشراء من مؤسسة رؤية سيتم التواصل خلال 24 ساعة لاستكمال طلب الشراء وشحن الكتب
            </p>
            <Button 
              onClick={handleNewOrder}
              variant="outline"
            >
              شراء جديد
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">إتمام الطلب</h2>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">ملخص الطلب:</h3>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm mb-1">
              <span>{item.title} × {item.quantity}</span>
              <span>{item.price * item.quantity} جنيه</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2 font-bold">
            <div className="flex justify-between">
              <span>المجموع الكلي:</span>
              <span>{totalPrice} جنيه</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="fullName">الاسم الكامل *</Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="أدخل الاسم الكامل بالعربية"
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
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="01xxxxxxxxx"
              className="text-right"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015
            </p>
          </div>

          <div>
            <Label htmlFor="paymentMethod">طريقة الدفع *</Label>
            <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
              <SelectTrigger>
                <SelectValue placeholder="اختر طريقة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vodafone-cash">فودافون كاش</SelectItem>
                <SelectItem value="instapay">انستاباي</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.paymentMethod && (
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">تعليمات الدفع:</h4>
              {formData.paymentMethod === 'vodafone-cash' && (
                <div className="text-blue-500 text-sm">
                  <p>• قم بتحويل المبلغ إلى محفظة رقم : 01026217597</p>
                  <p>• أرسل صورة من إيصال التحويل</p>
                </div>
              )}
              {formData.paymentMethod === 'instapay' && (
                <div className="text-blue-500 text-sm">
                  <p>• قم بتحويل المبلغ إلى حساب انستاباى رقم: 01270439417</p>
                  <p>• أرسل صورة من إيصال التحويل</p>
                </div>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="receipt">رفع إيصال الدفع</Label>
            <Input
              id="receipt"
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, receipt: e.target.files?.[0] || null })}
              className="text-right"
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              تأكيد الطلب
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
            >
              العودة للسلة
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;
