import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpRight, ArrowDownLeft, Plus } from "lucide-react";
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });
      console.log("data", data)

    if (error) {
      console.error("Error fetching payments:", error);
      return;
    }

    // Map payments table to Transaction format
    const mapped: Transaction[] = data.map((p: any) => ({
      id: p.payment_id,
      type: "received", // Assuming all are incoming for now
      amount: p.amount,
      name: p.customer_name || "Unknown",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      date: new Date(p.created_at).toLocaleDateString(),
      time: new Date(p.created_at).toLocaleTimeString(),
    }));

    setTransactions(mapped);
  };

  const insertPaymentToDB = async (payment: {
    payment_id: string;
    order_id?: string;
    amount: number;
    currency: string;
    status: string;
    customer_name: string;
  }) => {
    const { error } = await supabase.from("payments").insert([
      {
        payment_id: payment.payment_id,
        order_id: payment.order_id || null,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        customer_name: payment.customer_name,
      },
    ]);

    if (error) {
      console.error("Error inserting payment:", error);
      toast({
        title: "Database Error",
        description: "Payment succeeded but could not save in database.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Recorded",
        description: "Payment details have been saved.",
      });
      await fetchPayments(); // Refresh UI immediately
    }
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
      key: "rzp_test_VSkkDl7N8oIENZ",
      amount: 100 * 100, // Razorpay uses paise (₹100)
      currency: "INR",
      name: "John Doe",
      description: "UPI Payment",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      handler: async function (response: any) {
        toast({
          title: "Payment Successful!",
          description: `Payment ID: ${response.razorpay_payment_id}`,
        });

        // Insert into DB and refresh list
        await insertPaymentToDB({
          payment_id: response.razorpay_payment_id,
          order_id: response.razorpay_order_id,
          amount: 100, // INR
          currency: "INR",
          status: "success",
          customer_name: "John Doe",
        });
      },
      prefill: {
        name: "John Doe",
        email: "john.doe@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "hsl(var(--primary))",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  useEffect(() => {
    fetchPayments();
  }, []);

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
              {transactions.length === 0 ? (
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
