
const TickerBar = () => {
  const tickerMessages = [
    'سحب شهري بقيمة 5000 جنيه نقدًا',
    'سحب على عمرة مجانية',
    'خصم نقدي 20% على جميع الكتب لأعضاء نادي المعرفة',
    'قناة تيليجرام خاصة لأعضاء النادي',
    'قناة يوتيوب حصرية لأعضاء النادي',
    'ادعُ 5 من أصدقائك للاشتراك في النادي واحصل على مكافأة مالية 100 جنيه'
  ];

  return (
    <div className="bg-orange-500 text-white py-2 overflow-hidden">
      <div className="ticker-content-rtl whitespace-nowrap">
        <span className="inline-block px-8">
          {tickerMessages.map((message, index) => (
            <span key={index} className="mx-8 text-sm font-medium">
              ⭐ {message}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
};

export default TickerBar;
