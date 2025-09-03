import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowUpRight, ArrowDownLeft, Plus, RefreshCw, AlertCircle } from "lucide-react";
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
  const { user, loading: authLoading, isSkipped } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

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
      setDebugInfo("Fetching payments...");
      
      console.log("🔍 Starting fetchPayments");
      console.log("🔍 Auth state:", { user: user?.id, authLoading, isSkipped });
      
      // Check if we should show demo data
      if (!user?.id && !isSkipped) {
        setDebugInfo("No user and not skipped - showing demo data");
        setTransactions([
          {
            id: 'demo-1',
            type: 'received',
            amount: 1500,
            name: 'Demo Payment',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
          }
        ]);
        setLoading(false);
        return;
      }

      setDebugInfo("Fetching from database...");
      
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("🔍 Database response:", { data, error });

      if (error) {
        console.error("❌ Error fetching payments:", error);
        setError(error.message);
        setDebugInfo(`Database error: ${error.message}`);
        return;
      }

      console.log("✅ Fetched payments data:", data);

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
      setDebugInfo(`Loaded ${mapped.length} payments`);
    } catch (err) {
      console.error("❌ Exception in fetchPayments:", err);
      setError("Failed to fetch payments");
      setDebugInfo(`Exception: ${err}`);
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
      console.log("💾 Inserting payment to DB:", payment);
      setDebugInfo("Saving payment to database...");
      
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

      console.log("💾 Insert result:", { data, error });

      if (error) {
        console.error("❌ Error inserting payment:", error);
        console.error("❌ Error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        setDebugInfo(`Insert error: ${error.message}`);
        
        toast({
          title: "Database Error",
          description: `Payment succeeded but could not save in database: ${error.message}`,
          variant: "destructive",
        });
        return false;
      } else {
        console.log("✅ Payment inserted successfully:", data);
        setDebugInfo("Payment saved successfully!");
        
        toast({
          title: "Payment Recorded",
          description: "Payment details have been saved.",
        });
        await fetchPayments(); // Refresh UI immediately
        return true;
      }
    } catch (error) {
      console.error("❌ Exception in insertPaymentToDB:", error);
      setDebugInfo(`Exception: ${error}`);
      
      toast({
        title: "Database Error",
        description: "Payment succeeded but could not save in database.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handlePayment = async () => {
    console.log("💳 Starting payment process");
    setDebugInfo("Starting payment...");
    
    if (!user?.id && !isSkipped) {
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
      const userName = user?.user_metadata?.full_name || user?.email || "Guest User";
      const userEmail = user?.email || "guest@example.com";
      const userPhone = user?.phone || "9999999999";

      console.log("👤 User data for payment:", { userName, userEmail, userPhone });

      const options = {
        key: "rzp_test_VSkkDl7N8oIENZ",
        amount: 100 * 100, // Razorpay uses paise (₹100)
        currency: "INR",
        name: "CoLiving Hub",
        description: "Maintenance Payment",
        image:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        handler: async function (response: any) {
          console.log("✅ Payment successful:", response);
          setDebugInfo("Payment successful! Saving to database...");
          
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
            console.log("✅ Payment processed and saved successfully");
            setDebugInfo("Payment completed and saved!");
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: userPhone,
        },
        theme: {
          color: "hsl(var(--primary))",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("❌ Payment error:", error);
      setDebugInfo(`Payment error: ${error}`);
      
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
    console.log("🔄 PaymentPage useEffect triggered");
    console.log("🔄 Auth state:", { user: user?.id, authLoading, isSkipped });
    
    if (!authLoading) {
      console.log("🔄 Auth loading complete, fetching payments");
      fetchPayments();
    } else {
      console.log("🔄 Still loading auth...");
    }
  }, [authLoading, user?.id, isSkipped]);

  // Show loading skeleton while auth is loading
  if (authLoading) {
    console.log("🔄 Showing auth loading skeleton");
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
          {/* Debug Info */}
          {debugInfo && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-3">
                <p className="text-xs text-blue-700 font-mono">{debugInfo}</p>
              </CardContent>
            </Card>
          )}

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
                <strong>Auth Status:</strong> {user?.id ? `Logged in (${user.email})` : isSkipped ? 'Guest Mode' : 'Not authenticated'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
