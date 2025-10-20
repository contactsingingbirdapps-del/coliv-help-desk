import { useEffect, useState, memo, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowUpRight, ArrowDownLeft, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { paymentsAPI } from "@/services/api";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Transaction {
  id: string;
  type: "sent" | "received";
  amount: number;
  name: string;
  avatar: string;
  date: string;
  time: string;
}

const PaymentPage = memo(() => {
  const { toast } = useToast();
  const { user, loading: authLoading, isSkipped } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize demo data to prevent recreation
  const demoTransactions = useMemo(() => [
    {
      id: 'demo-1',
      type: 'received' as const,
      amount: 1500,
      name: 'Demo Payment',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    }
  ], []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  
  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      // Security: Show demo data if not authenticated
      if (!user?.uid && !isSkipped) {
        setTransactions(demoTransactions);
        setLoading(false);
        return;
      }

      // Fetch payments from backend API
      const { data, error: apiError } = await paymentsAPI.getAll();

      if (apiError) {
        setTransactions(demoTransactions);
        setLoading(false);
        return;
      }

      if (!data || !data.payments || data.payments.length === 0) {
        setTransactions([]);
        setLoading(false);
        return;
      }

      const parsedTransactions: Transaction[] = data.payments.map((payment: any) => ({
        id: payment.id,
        type: 'received',
        amount: payment.amount || 0,
        name: payment.customer_name || 'Maintenance Payment',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        date: payment.created_at
          ? new Date(payment.created_at).toLocaleDateString()
          : new Date().toLocaleDateString(),
        time: payment.created_at
          ? new Date(payment.created_at).toLocaleTimeString()
          : new Date().toLocaleTimeString(),
      }));

      setTransactions(parsedTransactions);
    } catch (err) {
      setError("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const insertPaymentToDB = async (payment: {
    razorpay_payment_id: string;
    amount: number;
    currency: string;
    status: string;
    description: string;
  }) => {
    try {
      // Save payment via backend API
      const { error: apiError } = await paymentsAPI.create({
        amount: payment.amount,
        customerName: user?.displayName || user?.email || 'Guest',
        customerEmail: user?.email || 'guest@example.com',
        description: payment.description,
        paymentMethod: 'razorpay',
        status: payment.status,
      });

      if (apiError) {
        throw new Error(apiError.message || 'Failed to save payment');
      }
      
      toast({
        title: "Payment Recorded",
        description: "Payment details have been saved.",
      });
      await fetchPayments(); // Refresh UI immediately
      return true;
    } catch (error) {
      toast({
        title: "Database Error",
        description: "Payment succeeded but could not save in database.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handlePayment = async () => {
    if (!user?.uid && !isSkipped) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to make payments",
        variant: "destructive",
      });
      return;
    }

    setProcessingPayment(true);
    
    try {
      const res = await loadRazorpayScript();

      if (!res) {
        toast({
          title: "Error",
          description: "Razorpay SDK failed to load. Are you online?",
          variant: "destructive",
        });
        return;
      }

      // Get user data for Razorpay
      const userName = user?.displayName || user?.email || "Guest User";
      const userEmail = user?.email || "guest@example.com";
      const userPhone = "9999999999";

      // Check if Razorpay key is configured
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        toast({
          title: "Payment Not Configured",
          description: "Payment gateway is not set up. Please contact support.",
          variant: "destructive",
        });
        return;
      }

      const options = {
        key: razorpayKey,
        amount: 100 * 100, // Razorpay uses paise (₹100)
        currency: "INR",
        name: "CoLiving Hub",
        description: "Maintenance Payment",
        image:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        handler: async function (response: any) {
          toast({
            title: "Payment Successful!",
            description: `Payment ID: ${response.razorpay_payment_id}`,
          });

          // Insert into DB and refresh list
          await insertPaymentToDB({
            razorpay_payment_id: response.razorpay_payment_id,
            amount: 100, // INR
            currency: "INR",
            status: "success",
            description: "Maintenance Payment",
          });
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: userPhone,
        },
        theme: {
          color: "hsl(var(--primary))",
        },
      } as any;

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  useEffect(() => {
    // Fetch immediately; don't block on auth. Data will adapt when user changes.
    fetchPayments();
  }, [user?.uid, isSkipped]);

  // Show loading skeleton while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header pendingCount={0} />
        <div className="p-4 pb-20">
          <div className="max-w-md mx-auto space-y-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header pendingCount={0} />
        <div className="p-4 pb-20">
          <div className="max-w-md mx-auto space-y-4">
            <Card>
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={fetchPayments} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header pendingCount={0} />
      <div className="p-4 pb-20">
        <div className="max-w-md mx-auto space-y-4">

          {/* UPI History Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                // Loading skeleton
                [...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))
              ) : transactions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No transactions yet.
                </p>
              ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={transaction.avatar}
                          alt={transaction.name}
                        />
                        <AvatarFallback>
                          {transaction.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{transaction.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.date} • {transaction.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`text-sm font-semibold ${
                          transaction.type === "sent"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {transaction.type === "sent" ? "-" : "+"}₹
                        {transaction.amount}
                      </div>
                      {transaction.type === "sent" ? (
                        <ArrowUpRight className="w-4 h-4 text-red-500" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={processingPayment}
            size="lg"
            className="w-full h-12 text-base font-semibold"
          >
            {processingPayment ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                Pay Now
              </>
            )}
          </Button>

          {/* Refresh Button */}
          <Button
            onClick={fetchPayments}
            variant="outline"
            size="sm"
            className="w-full"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Transactions
          </Button>

          {/* Auth Status */}
          <Card className="border-gray-200">
            <CardContent className="p-3">
              <p className="text-xs text-gray-600">
                <strong>Auth Status:</strong> {user?.uid ? `Logged in (${user.email})` : isSkipped ? 'Guest Mode' : 'Not authenticated'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
});

PaymentPage.displayName = 'PaymentPage';

export default PaymentPage;
