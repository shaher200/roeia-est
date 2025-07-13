
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CheckoutFormProps {
  items: Array<{
    id: number;
    title: string;
    price: number;
    quantity: number;
  }>;
  totalPrice: number;
  onOrderSubmit: () => void;
  onBack: () => void;
}

const CheckoutForm = ({ items, totalPrice, onOrderSubmit, onBack }: CheckoutFormProps) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast({
        title: "خطأ",
        description: "يرجى تعبئة جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save order to database if user is logged in
      if (user) {
        const { error } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            items: items,
            total_amount: totalPrice,
            customer_name: customerInfo.name,
            customer_phone: customerInfo.phone,
            customer_address: customerInfo.address,
            status: 'pending'
          });

        if (error) {
          throw error;
        }
      }

      setShowSuccess(true);
    } catch (error: any) {
      toast({
        title: "خطأ في معالجة الطلب",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewOrder = () => {
    onOrderSubmit();
    setShowSuccess(false);
    setCustomerInfo({ name: '', phone: '', address: '' });
  };

  if (showSuccess) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-green-600 mb-4">تم شراء الكتب بنجاح</h2>
          <p className="text-lg text-gray-700 mb-2">نشكركم على الشراء من مؤسسة رؤية</p>
          <p className="text-gray-600">سيتم التواصل خلال 24 ساعة لاستكمال طلب الشراء وشحن الكتب</p>
        </div>
        <Button onClick={handleNewOrder} className="bg-blue-600 hover:bg-blue-700">
          طلب جديد
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">إتمام الطلب</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">الاسم الكامل *</Label>
          <Input
            id="name"
            type="text"
            value={customerInfo.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            className="text-right"
            placeholder="أدخل اسمك الكامل"
          />
        </div>

        <div>
          <Label htmlFor="phone">رقم الهاتف *</Label>
          <Input
            id="phone"
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            required
            className="text-right"
            placeholder="01xxxxxxxxx"
          />
        </div>

        <div>
          <Label htmlFor="address">العنوان *</Label>
          <Textarea
            id="address"
            value={customerInfo.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            required
            className="text-right min-h-[100px]"
            placeholder="أدخل عنوانك الكامل بالتفصيل"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">ملخص الطلب:</h3>
          <div className="space-y-1">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.title} × {item.quantity}</span>
                <span>{item.price * item.quantity} جنيه</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-2 mt-2 font-bold">
            <div className="flex justify-between">
              <span>الإجمالي:</span>
              <span>{totalPrice} جنيه</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            type="submit" 
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'جارٍ المعالجة...' : 'تأكيد الطلب'}
          </Button>
          <Button type="button" variant="outline" onClick={onBack}>
            رجوع
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
