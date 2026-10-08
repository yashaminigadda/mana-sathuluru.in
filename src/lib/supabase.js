import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

/**
 * Checks whether valid Supabase credentials have been configured in environment variables.
 * Note: Only public anon keys are used here. Never put service_role secret keys in frontend code!
 */
export const isSupabaseConfigured = () => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim().length > 0 &&
    !supabaseUrl.includes('your-project-id') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim().length > 0 &&
    !supabaseAnonKey.includes('your-anon-public-key')
  )
}

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
  : null

/**
 * Inserts a new private message into the contact_messages table.
 * Protected by Row Level Security (RLS) policies.
 */
export async function submitContactMessage({ name, contactInfo, message }) {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: true,
      fallback: true,
      message: 'Supabase configuration pending. Message processed in fallback mode.',
    }
  }

  try {
    const { data, error } = await supabase.from('contact_messages').insert([
      {
        name: name.trim(),
        contact_info: contactInfo.trim(),
        message: message.trim(),
        status: 'unread',
        created_at: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error('Supabase error saving message:', error.message)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (err) {
    console.error('Unexpected error submitting message to Supabase:', err)
    return { success: false, error: err.message || 'Network error' }
  }
}

/**
 * Records a real-time community contribution/payment into Supabase.
 */
export async function recordContribution({
  payerName,
  contactInfo = '',
  amount,
  upiRefId = '',
  paymentMethod = 'UPI_QR',
  note = ''
}) {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: true,
      fallback: true,
      message: 'Supabase configuration pending. Processed locally.',
    }
  }

  try {
    const { data, error } = await supabase.from('contributions').insert([
      {
        payer_name: payerName.trim(),
        contact_info: contactInfo.trim(),
        amount: Number(amount),
        currency: 'INR',
        upi_ref_id: upiRefId.trim(),
        payment_method: paymentMethod,
        status: upiRefId.trim() ? 'completed' : 'pending_verification',
        note: note.trim(),
        created_at: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error('Supabase error recording contribution:', error.message)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (err) {
    console.error('Unexpected error in recordContribution:', err)
    return { success: false, error: err.message || 'Network error' }
  }
}
