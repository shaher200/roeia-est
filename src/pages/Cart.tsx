
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    paymentMethod: '',
    receipt: null as File | null
  });

  const handleQuantityChange = (id: number, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
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

    toast({
      title: "تم استلام الطلب ✅",
      description: "نشكركم على طلبكم. سيتم التواصل معكم خلال 24 ساعة لتأكيد الطلب والتسليم.",
    });

    clearCart();
    setShowCheckout(false);
    setFormData({
      fullName: '',
      phoneNumber: '',
      paymentMethod: '',
      receipt: null
    });
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <ShoppingCart className="mx-auto h-24 w-24 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">سلة المشتريات فارغة</h2>
            <p className="text-gray-600 mb-6">لا توجد كتب في سلة المشتريات حالياً</p>
            <Link to="/">
              <Button>تصفح الكتب</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">سلة المشتريات</h1>

        {!showCheckout ? (
          <>
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.cover}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{item.author}</p>
                        <p className="text-blue-600 font-bold">{item.price} جنيه</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="mx-2 min-w-[2rem] text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>المجموع الكلي:</span>
                  <span className="text-blue-600">{getTotalPrice()} جنيه</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={() => setShowCheckout(true)} className="flex-1">
                إتمام الطلب
              </Button>
              <Link to="/">
                <Button variant="outline">متابعة التسوق</Button>
              </Link>
            </div>
          </>
        ) : (
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
                    <span>{getTotalPrice()} جنيه</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmitOrder} className="space-y-6">
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
                      <div className="text-orange-700 text-sm">
                        <p>• قم بتحويل المبلغ إلى: 01234567890</p>
                        <p>• أرسل صورة من إيصال التحويل</p>
                      </div>
                    )}
                    {formData.paymentMethod === 'instapay' && (
                      <div className="text-orange-700 text-sm">
                        <p>• قم بتحويل المبلغ إلى: اسم المحفظة</p>
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
                    onClick={() => setShowCheckout(false)}
                  >
                    العودة للسلة
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
