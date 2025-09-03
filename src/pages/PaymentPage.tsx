import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowUpRight, ArrowDownLeft, Plus, RefreshCw } from "lucide-react";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";

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

const PaymentPage = () => {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching payments:", error);
        setError(error.message);
        return;
      }

      console.log("Fetched payments data:", data);

      // Map payments table to Transaction format
      const mapped: Transaction[] = (data || []).map((p: any) => ({
        id: p.razorpay_payment_id || p.id,
        type: "received", // Assuming all are incoming for now
        amount: p.amount,
        name: p.description || "Payment",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        date: new Date(p.created_at).toLocaleDateString(),
        time: new Date(p.created_at).toLocaleTimeString(),
      }));

      setTransactions(mapped);
    } catch (err) {
      console.error("Exception in fetchPayments:", err);
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
      console.log("Inserting payment to DB:", payment);
      
      const { data, error } = await supabase.from("payments").insert([
        {
          user_id: user?.id || null, // Use actual user ID if authenticated
          razorpay_payment_id: payment.razorpay_payment_id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          description: payment.description,
          payment_method: "razorpay",
        },
      ]);

      console.log("Insert result:", { data, error });

      if (error) {
        console.error("Error inserting payment:", error);
        console.error("Error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        toast({
          title: "Database Error",
          description: `Payment succeeded but could not save in database: ${error.message}`,
          variant: "destructive",
        });
        return false;
      } else {
        console.log("Payment inserted successfully:", data);
        toast({
          title: "Payment Recorded",
          description: "Payment details have been saved.",
        });
        await fetchPayments(); // Refresh UI immediately
        return true;
      }
    } catch (error) {
      console.error("Exception in insertPaymentToDB:", error);
      toast({
        title: "Database Error",
        description: "Payment succeeded but could not save in database.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handlePayment = async () => {
    if (!user?.id) {
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

      const options = {
        key: "rzp_test_VSkkDl7N8oIENZ",
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
          const success = await insertPaymentToDB({
            razorpay_payment_id: response.razorpay_payment_id,
            amount: 100, // INR
            currency: "INR",
            status: "success",
            description: "Maintenance Payment",
          });

          if (success) {
            console.log("Payment processed and saved successfully");
          }
        },
        prefill: {
          name: user.user_metadata?.full_name || user.email || "User",
          email: user.email || "",
          contact: user.phone || "",
        },
        theme: {
          color: "hsl(var(--primary))",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
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
    if (!authLoading) {
      fetchPayments();
    }
  }, [authLoading]);

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
            disabled={processingPayment || !user?.id}
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
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
