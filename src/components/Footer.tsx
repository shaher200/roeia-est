
import { MessageCircle, Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const socialLinks = [
    {
      name: 'واتساب',
      href: 'https://wa.me/201270439417',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'تيليجرام',
      href: 'https://t.me/+201270439417',
      icon: Send,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'فيسبوك',
      href: 'https://facebook.com/roiapublishing',
      icon: MessageCircle,
      color: 'bg-blue-700 hover:bg-blue-800'
    }
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="container mx-auto px-4 py-2">
        {isHomePage && (
          <div className="flex justify-center space-x-reverse space-x-4 mb-2">
            {socialLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${link.color} text-white p-2 rounded-full transition-all duration-200 hover:scale-110 shadow-lg`}
                  title={link.name}
                >
                  <IconComponent className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        )}
        <p className="text-center text-gray-600 text-xs">
          © 2024 مؤسسة رؤية للطباعة والنشر. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
