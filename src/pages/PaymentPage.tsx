import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpRight, ArrowDownLeft, Plus } from "lucide-react";
import { Header } from "@/components/Header";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: number;
  name: string;
  avatar: string;
  date: string;
  time: string;
}

const PaymentPage = () => {
  const { toast } = useToast();
  
  // Dummy UPI transaction history
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'sent',
      amount: 250,
      name: 'Amit Sharma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      date: 'Today',
      time: '2:30 PM'
    },
    {
      id: '2',
      type: 'received',
      amount: 1200,
      name: 'Priya Singh',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      date: 'Yesterday',
      time: '11:15 AM'
    },
    {
      id: '3',
      type: 'sent',
      amount: 75,
      name: 'Ravi Kumar',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      date: 'Yesterday',
      time: '9:45 AM'
    },
    {
      id: '4',
      type: 'received',
      amount: 500,
      name: 'Sneha Patel',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      date: '2 days ago',
      time: '4:20 PM'
    },
    {
      id: '1',
      type: 'sent',
      amount: 250,
      name: 'Amit Sharma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      date: 'Today',
      time: '2:30 PM'
    }
  ];
  
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      toast({
        title: "Error",
        description: "Razorpay SDK failed to load. Are you online?",
        variant: "destructive",
      });
      return;
    }

    const options = {
      key: 'rzp_test_VSkkDl7N8oIENZ',
      amount: 100, // ₹500 in paise
      currency: 'INR',
      name: 'John Doe',
      description: 'UPI Payment',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      handler: function (response: any) {
        toast({
          title: "Payment Successful!",
          description: `Payment ID: ${response.razorpay_payment_id}`,
        });
      },
      prefill: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        contact: '9999999999'
      },
      theme: {
        color: 'hsl(var(--primary))'
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header pendingCount={0} />
      <div className="p-4 pb-20">
        <div className="max-w-md mx-auto space-y-4">
        
        {/* UPI History Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={transaction.avatar} alt={transaction.name} />
                    <AvatarFallback>{transaction.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{transaction.name}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date} • {transaction.time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`text-sm font-semibold ${
                    transaction.type === 'sent' ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {transaction.type === 'sent' ? '-' : '+'}₹{transaction.amount}
                  </div>
                  {transaction.type === 'sent' ? (
                    <ArrowUpRight className="w-4 h-4 text-red-500" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Payment Button */}
        <Button 
          onClick={handlePayment}
          size="lg"
          className="w-full h-12 text-base font-semibold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Pay Now
        </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;