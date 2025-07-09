
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 rtl">
      <Header />
      <main className="pb-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
