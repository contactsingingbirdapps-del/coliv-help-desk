import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_PUBLISHABLE_KEY!
);


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Fetch payments for the user
    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch payments',
        details: error.message 
      });
    }

    // Calculate summary statistics
    const totalPayments = payments?.length || 0;
    const successfulPayments = payments?.filter(p => p.status === 'success').length || 0;
    const totalAmount = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const pendingPayments = payments?.filter(p => p.status === 'pending').length || 0;

    return res.status(200).json({
      success: true,
      payments: payments || [],
      summary: {
        totalPayments,
        successfulPayments,
        pendingPayments,
        totalAmount,
        successRate: totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
