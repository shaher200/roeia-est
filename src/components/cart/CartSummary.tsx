
import { Card, CardContent } from '@/components/ui/card';

interface CartSummaryProps {
  totalPrice: number;
}

const CartSummary = ({ totalPrice }: CartSummaryProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>المجموع الكلي:</span>
          <span className="text-blue-600">{totalPrice} جنيه</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartSummary;
