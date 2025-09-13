import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, ShoppingBag, Award } from 'lucide-react';

const Profile = () => {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    // تحديث بيانات النموذج من المستخدم الحالي
    setFormData({
      name: user.name || '',
      phone: user.phone || ''
    });
  }, [user, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    // في النظام المخصص الجديد، يمكن تحديث البيانات مباشرة لكن الآن سنعرض رسالة
    toast({
      title: "معلومة",
      description: "يمكنك تحديث بياناتك عبر إعادة التسجيل بالبيانات الجديدة",
    });
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">جارٍ تحميل البيانات...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">حسابي</h1>

          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <User className="h-5 w-5 ml-2" />
                البيانات الشخصية
              </h2>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                size="sm"
              >
                {isEditing ? 'إلغاء' : 'عرض'}
              </Button>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <Label htmlFor="name">الاسم</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="text-right"
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="text-right"
                    readOnly
                  />
                </div>
                <Button type="submit" disabled>تحديث البيانات (قريباً)</Button>
              </form>
            ) : (
              <div className="space-y-3">
                <div>
                  <strong>الاسم:</strong> {user.name}
                </div>
                <div>
                  <strong>رقم الهاتف:</strong> {user.phone}
                </div>
                <div>
                  <strong>الدور:</strong> {user.role === 'admin' ? 'مدير' : 'مستخدم'}
                </div>
              </div>
            )}
          </div>

          {/* Orders History */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold flex items-center mb-4">
              <ShoppingBag className="h-5 w-5 ml-2" />
              تاريخ الطلبات (0)
            </h2>
            
            <p className="text-gray-600">سيتم عرض طلباتك هنا قريباً</p>
          </div>

          {/* Knowledge Club Memberships */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold flex items-center mb-4">
              <Award className="h-5 w-5 ml-2" />
              اشتراكات نادي المعرفة (0)
            </h2>
            
            <p className="text-gray-600">سيتم عرض اشتراكاتك هنا قريباً</p>
          </div>

          {/* Sign Out Button */}
          <div className="text-center">
            <Button onClick={handleSignOut} variant="destructive">
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;