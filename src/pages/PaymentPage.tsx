import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentPage = () => {
  const { toast } = useToast();
  
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
      key: 'rzp_test_123456789',
      amount: 50000, // ₹500 in paise
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="max-w-md mx-auto pt-8 pb-20">
        <Card className="border-0 shadow-lg bg-card/95 backdrop-blur">
          <CardContent className="p-8 text-center space-y-6">
            {/* Profile Image */}
            <div className="flex justify-center">
              <Avatar className="w-24 h-24 ring-4 ring-primary/20">
                <AvatarImage 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" 
                  alt="John Doe"
                />
                <AvatarFallback className="text-2xl font-semibold">JD</AvatarFallback>
              </Avatar>
            </div>

            {/* User Name */}
            <div>
              <h1 className="text-2xl font-bold text-foreground">John Doe</h1>
              <p className="text-muted-foreground text-sm">UPI Payment</p>
            </div>

            {/* Amount */}
            <div className="py-6">
              <div className="text-4xl font-bold text-primary">₹500</div>
              <p className="text-muted-foreground text-sm mt-1">Amount to pay</p>
            </div>

            {/* Pay Now Button */}
            <Button 
              onClick={handlePayment}
              size="lg"
              className="w-full h-14 text-lg font-semibold"
            >
              Pay Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;