import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Database, RazorpayWebhookPayload } from '@/integrations/supabase/types';
import crypto from 'crypto';

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
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET not configured');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    // Verify webhook signature
    const signature = req.headers['x-razorpay-signature'] as string;
    if (!signature) {
      return res.status(400).json({ error: 'Missing signature' });
    }

    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const webhookPayload: RazorpayWebhookPayload = req.body;
    const { event, payload } = webhookPayload;

    console.log('Razorpay webhook received:', event);

    // Handle different webhook events
    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload.payment.entity);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(payload.payment.entity);
        break;
      
      case 'payment.authorized':
        await handlePaymentAuthorized(payload.payment.entity);
        break;
      
      default:
        console.log('Unhandled webhook event:', event);
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handlePaymentCaptured(payment: any) {
  try {
    const { data: existingPayment, error: fetchError } = await supabase
      .from('payments')
      .select('id, status')
      .eq('razorpay_payment_id', payment.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching payment:', fetchError);
      return;
    }

    if (existingPayment) {
      // Update payment status to success
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'success',
          updated_at: new Date().toISOString(),
        })
        .eq('razorpay_payment_id', payment.id);

      if (updateError) {
        console.error('Error updating payment status:', updateError);
      } else {
        console.log('Payment status updated to success:', payment.id);
      }
    } else {
      // Create new payment record if it doesn't exist
      const { error: insertError } = await supabase
        .from('payments')
        .insert({
          razorpay_payment_id: payment.id,
          amount: payment.amount / 100, // Convert from paise to rupees
          currency: payment.currency,
          status: 'success',
          description: payment.description || 'Payment captured',
          payment_method: payment.method,
        });

      if (insertError) {
        console.error('Error creating payment record:', insertError);
      } else {
        console.log('New payment record created:', payment.id);
      }
    }
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
}

async function handlePaymentFailed(payment: any) {
  try {
    const { data: existingPayment, error: fetchError } = await supabase
      .from('payments')
      .select('id, status')
      .eq('razorpay_payment_id', payment.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching payment:', fetchError);
      return;
    }

    if (existingPayment) {
      // Update payment status to failed
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('razorpay_payment_id', payment.id);

      if (updateError) {
        console.error('Error updating payment status:', updateError);
      } else {
        console.log('Payment status updated to failed:', payment.id);
      }
    } else {
      // Create new payment record if it doesn't exist
      const { error: insertError } = await supabase
        .from('payments')
        .insert({
          razorpay_payment_id: payment.id,
          amount: payment.amount / 100, // Convert from paise to rupees
          currency: payment.currency,
          status: 'failed',
          description: payment.description || 'Payment failed',
          payment_method: payment.method,
        });

      if (insertError) {
        console.error('Error creating payment record:', insertError);
      } else {
        console.log('New failed payment record created:', payment.id);
      }
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

async function handlePaymentAuthorized(payment: any) {
  try {
    const { data: existingPayment, error: fetchError } = await supabase
      .from('payments')
      .select('id, status')
      .eq('razorpay_payment_id', payment.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching payment:', fetchError);
      return;
    }

    if (existingPayment) {
      // Update payment status to pending
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'pending',
          updated_at: new Date().toISOString(),
        })
        .eq('razorpay_payment_id', payment.id);

      if (updateError) {
        console.error('Error updating payment status:', updateError);
      } else {
        console.log('Payment status updated to pending:', payment.id);
      }
    } else {
      // Create new payment record if it doesn't exist
      const { error: insertError } = await supabase
        .from('payments')
        .insert({
          razorpay_payment_id: payment.id,
          amount: payment.amount / 100, // Convert from paise to rupees
          currency: payment.currency,
          status: 'pending',
          description: payment.description || 'Payment authorized',
          payment_method: payment.method,
        });

      if (insertError) {
        console.error('Error creating payment record:', insertError);
      } else {
        console.log('New pending payment record created:', payment.id);
      }
    }
  } catch (error) {
    console.error('Error handling payment authorized:', error);
  }
}
