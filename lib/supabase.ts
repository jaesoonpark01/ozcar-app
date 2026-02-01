import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * @dev Ozcar Backend Helpers
 */
export const OzcarDB = {
    getVehicleWithHistory: async (vin: string) => {
        const { data, error } = await supabase
            .from('vehicles')
            .select(`
        *,
        maintenance_logs (
          *,
          technicians (*)
        )
      `)
            .eq('vin', vin)
            .single()

        return { data, error }
    },

    createEscrow: async (escrow: any) => {
        return await supabase
            .from('escrow_transactions')
            .insert(escrow)
    }
}
