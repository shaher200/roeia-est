
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, ShoppingBag, Award } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  phone: string;
  email: string | null;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: any[];
}

interface Membership {
  id: string;
  name: string;
  phone: string;
  subscription_date: string;
  status: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchProfile();
    fetchOrders();
    fetchMemberships();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setProfile(data);
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || ''
      });
    }
  };

  const fetchOrders = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setOrders(data);
    }
  };

  const fetchMemberships = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('knowledge_club_memberships')
      .select('*')
      .eq('user_id', user.id);

    if (data) {
      setMemberships(data);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "خطأ في التحديث",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم تحديث البيانات بنجاح",
      });
      setIsEditing(false);
      fetchProfile();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user || !profile) {
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
                {isEditing ? 'إلغاء' : 'تعديل'}
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
                  />
                </div>
                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="text-right"
                  />
                </div>
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="text-right"
                  />
                </div>
                <Button type="submit">حفظ التغييرات</Button>
              </form>
            ) : (
              <div className="space-y-3">
                <div>
                  <strong>الاسم:</strong> {profile.name}
                </div>
                <div>
                  <strong>رقم الهاتف:</strong> {profile.phone}
                </div>
                <div>
                  <strong>البريد الإلكتروني:</strong> {profile.email || 'غير محدد'}
                </div>
              </div>
            )}
          </div>

          {/* Orders History */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold flex items-center mb-4">
              <ShoppingBag className="h-5 w-5 ml-2" />
              تاريخ الطلبات ({orders.length})
            </h2>
            
            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">طلب رقم: {order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString('ar-EG')}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{order.total_amount} جنيه</p>
                        <p className={`text-sm ${
                          order.status === 'completed' ? 'text-green-600' :
                          order.status === 'pending' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {order.status === 'completed' ? 'مكتمل' :
                           order.status === 'pending' ? 'قيد المعالجة' :
                           'ملغي'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">لا توجد طلبات سابقة</p>
            )}
          </div>

          {/* Knowledge Club Memberships */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold flex items-center mb-4">
              <Award className="h-5 w-5 ml-2" />
              اشتراكات نادي المعرفة ({memberships.length})
            </h2>
            
            {memberships.length > 0 ? (
              <div className="space-y-3">
                {memberships.map((membership) => (
                  <div key={membership.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">اشتراك نادي المعرفة</p>
                        <p className="text-sm text-gray-600">
                          تاريخ الاشتراك: {new Date(membership.subscription_date).toLocaleDateString('ar-EG')}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className={`text-sm font-medium ${
                          membership.status === 'active' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {membership.status === 'active' ? 'نشط' : 'غير نشط'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">لا توجد اشتراكات في نادي المعرفة</p>
            )}
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
