import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Database, CreatePaymentRequest } from '@/integrations/supabase/types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentData, userId }: { 
      paymentData: CreatePaymentRequest; 
      userId: string; 
    } = req.body;

    // Validate required fields
    if (!paymentData.razorpay_payment_id || !paymentData.amount || !paymentData.status) {
      return res.status(400).json({ 
        error: 'Missing required fields: razorpay_payment_id, amount, status' 
      });
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Validate status
    const validStatuses = ['pending', 'success', 'failed', 'cancelled'];
    if (!validStatuses.includes(paymentData.status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    // Check if payment already exists
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('razorpay_payment_id', paymentData.razorpay_payment_id)
      .single();

    if (existingPayment) {
      return res.status(409).json({ 
        error: 'Payment with this Razorpay ID already exists' 
      });
    }

    // Insert payment record
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        amount: paymentData.amount,
        currency: paymentData.currency || 'INR',
        status: paymentData.status,
        description: paymentData.description || null,
        payment_method: paymentData.payment_method || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        error: 'Failed to store payment details',
        details: error.message 
      });
    }

    return res.status(201).json({
      success: true,
      payment,
      message: 'Payment details stored successfully'
    });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
