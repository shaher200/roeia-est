import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, ShoppingBag, Award, CreditCard, Trash2, Edit, Plus, Book, Tags, Image } from 'lucide-react';

interface User {
  id: string;
  name: string;
  phone: string;
  created_at: string;
  role: string;
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: any;
  receipt_image?: string;
}

interface Membership {
  id: string;
  name: string;
  phone: string;
  subscription_date: string;
  status: string;
  receipt_image?: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  price: number;
  category_id?: string;
  image_url?: string;
  is_available: boolean;
  created_at: string;
  category?: { name: string };
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    is_available: true
  });
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users from custom_users table
      const { data: usersData, error: usersError } = await supabase
        .from('custom_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

      // Fetch memberships
      const { data: membershipsData, error: membershipsError } = await supabase
        .from('knowledge_club_memberships')
        .select('*')
        .order('subscription_date', { ascending: false });

      if (membershipsError) throw membershipsError;
      setMemberships(membershipsData || []);

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Fetch books with categories
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select('*, category:categories(name)')
        .order('created_at', { ascending: false });

      if (booksError) throw booksError;
      setBooks(booksData || []);

    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('custom_users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.filter(user => user.id !== userId));
      toast({
        title: "تم حذف المستخدم بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في حذف المستخدم",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      toast({
        title: "تم تحديث حالة الطلب",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث الطلب",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateMembershipStatus = async (membershipId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('knowledge_club_memberships')
        .update({ status: newStatus })
        .eq('id', membershipId);

      if (error) throw error;

      setMemberships(memberships.map(membership => 
        membership.id === membershipId ? { ...membership, status: newStatus } : membership
      ));

      toast({
        title: "تم تحديث حالة العضوية",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث العضوية",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createCategory = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([newCategory])
        .select()
        .single();

      if (error) throw error;

      setCategories([data, ...categories]);
      setNewCategory({ name: '', description: '' });
      toast({
        title: "تم إنشاء التصنيف بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء التصنيف",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createBook = async () => {
    try {
      const bookData = {
        ...newBook,
        price: parseFloat(newBook.price),
        category_id: newBook.category_id || null
      };

      const { data, error } = await supabase
        .from('books')
        .insert([bookData])
        .select('*, category:categories(name)')
        .single();

      if (error) throw error;

      setBooks([data, ...books]);
      setNewBook({
        title: '',
        author: '',
        description: '',
        price: '',
        category_id: '',
        image_url: '',
        is_available: true
      });
      toast({
        title: "تم إنشاء الكتاب بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء الكتاب",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      setCategories(categories.filter(cat => cat.id !== categoryId));
      toast({
        title: "تم حذف التصنيف بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في حذف التصنيف",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteBook = async (bookId: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (error) throw error;

      setBooks(books.filter(book => book.id !== bookId));
      toast({
        title: "تم حذف الكتاب بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في حذف الكتاب",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">جاري التحميل...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">لوحة التحكم</h1>
          <p className="text-muted-foreground text-center">إدارة النظام والمستخدمين</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">العضويات</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{memberships.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المبيعات</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.reduce((sum, order) => sum + Number(order.total_amount), 0)} ر.س
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">المستخدمين</TabsTrigger>
            <TabsTrigger value="orders">الطلبات</TabsTrigger>
            <TabsTrigger value="memberships">العضويات</TabsTrigger>
            <TabsTrigger value="categories">التصنيفات</TabsTrigger>
            <TabsTrigger value="books">الكتب</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>إدارة المستخدمين</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>رقم الهاتف</TableHead>
                      <TableHead>الدور</TableHead>
                      <TableHead>تاريخ التسجيل</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          {user.role === 'admin' ? (
                            <Badge variant="destructive">مدير</Badge>
                          ) : (
                            <Badge variant="secondary">مستخدم</Badge>
                          )}
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString('ar')}</TableCell>
                        <TableCell>
                          {user.role !== 'admin' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الطلبات</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم العميل</TableHead>
                      <TableHead>رقم الهاتف</TableHead>
                      <TableHead>العنوان</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الايصال</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.customer_name}</TableCell>
                        <TableCell>{order.customer_phone}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{order.customer_address}</TableCell>
                        <TableCell>{order.total_amount} ر.س</TableCell>
                        <TableCell>
                          <Badge 
                            variant={order.status === 'completed' ? 'default' : 'secondary'}
                          >
                            {order.status === 'pending' ? 'معلق' : 'مكتمل'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {order.receipt_image ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Image className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>صورة الايصال</DialogTitle>
                                </DialogHeader>
                                <img src={order.receipt_image} alt="Receipt" className="w-full" />
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <span className="text-muted-foreground">لا يوجد</span>
                          )}
                        </TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleDateString('ar')}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                              disabled={order.status === 'completed'}
                            >
                              تأكيد
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => updateOrderStatus(order.id, 'pending')}
                              disabled={order.status === 'pending'}
                            >
                              إلغاء
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Memberships Tab */}
          <TabsContent value="memberships" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>إدارة العضويات</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>رقم الهاتف</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الايصال</TableHead>
                      <TableHead>تاريخ الاشتراك</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memberships.map((membership) => (
                      <TableRow key={membership.id}>
                        <TableCell>{membership.name}</TableCell>
                        <TableCell>{membership.phone}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={membership.status === 'active' ? 'default' : 'secondary'}
                          >
                            {membership.status === 'active' ? 'نشط' : 'غير نشط'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {membership.receipt_image ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Image className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>صورة الايصال</DialogTitle>
                                </DialogHeader>
                                <img src={membership.receipt_image} alt="Receipt" className="w-full" />
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <span className="text-muted-foreground">لا يوجد</span>
                          )}
                        </TableCell>
                        <TableCell>{new Date(membership.subscription_date).toLocaleDateString('ar')}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateMembershipStatus(membership.id, 'active')}
                              disabled={membership.status === 'active'}
                            >
                              تفعيل
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => updateMembershipStatus(membership.id, 'inactive')}
                              disabled={membership.status === 'inactive'}
                            >
                              إلغاء
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>إدارة التصنيفات</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      إضافة تصنيف
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>إضافة تصنيف جديد</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="category-name">اسم التصنيف</Label>
                        <Input
                          id="category-name"
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                          placeholder="اسم التصنيف"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category-description">الوصف</Label>
                        <Textarea
                          id="category-description"
                          value={newCategory.description}
                          onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                          placeholder="وصف التصنيف"
                        />
                      </div>
                      <Button onClick={createCategory} className="w-full">
                        إنشاء التصنيف
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم التصنيف</TableHead>
                      <TableHead>الوصف</TableHead>
                      <TableHead>تاريخ الإنشاء</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.description || 'لا يوجد وصف'}</TableCell>
                        <TableCell>{new Date(category.created_at).toLocaleDateString('ar')}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Books Tab */}
          <TabsContent value="books" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>إدارة الكتب</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      إضافة كتاب
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>إضافة كتاب جديد</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="book-title">عنوان الكتاب</Label>
                          <Input
                            id="book-title"
                            value={newBook.title}
                            onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                            placeholder="عنوان الكتاب"
                          />
                        </div>
                        <div>
                          <Label htmlFor="book-author">المؤلف</Label>
                          <Input
                            id="book-author"
                            value={newBook.author}
                            onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                            placeholder="اسم المؤلف"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="book-description">الوصف</Label>
                        <Textarea
                          id="book-description"
                          value={newBook.description}
                          onChange={(e) => setNewBook({...newBook, description: e.target.value})}
                          placeholder="وصف الكتاب"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="book-price">السعر (ر.س)</Label>
                          <Input
                            id="book-price"
                            type="number"
                            value={newBook.price}
                            onChange={(e) => setNewBook({...newBook, price: e.target.value})}
                            placeholder="السعر"
                          />
                        </div>
                        <div>
                          <Label htmlFor="book-category">التصنيف</Label>
                          <Select
                            value={newBook.category_id}
                            onValueChange={(value) => setNewBook({...newBook, category_id: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="اختر التصنيف" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="book-image">رابط الصورة</Label>
                        <Input
                          id="book-image"
                          value={newBook.image_url}
                          onChange={(e) => setNewBook({...newBook, image_url: e.target.value})}
                          placeholder="رابط صورة الكتاب"
                        />
                      </div>
                      <Button onClick={createBook} className="w-full">
                        إنشاء الكتاب
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>العنوان</TableHead>
                      <TableHead>المؤلف</TableHead>
                      <TableHead>التصنيف</TableHead>
                      <TableHead>السعر</TableHead>
                      <TableHead>متاح</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {books.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{book.category?.name || 'بدون تصنيف'}</TableCell>
                        <TableCell>{book.price} ر.س</TableCell>
                        <TableCell>
                          <Badge variant={book.is_available ? 'default' : 'secondary'}>
                            {book.is_available ? 'متاح' : 'غير متاح'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteBook(book.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;