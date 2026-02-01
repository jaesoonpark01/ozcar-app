import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
    const { vin } = await req.json()

    const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Fetch Vehicle History
    const { data: logs } = await supabaseClient
        .from('maintenance_logs')
        .select('*')
        .eq('vin', vin)

    // 2. Mock AI Logic (In production, call an LLM or ML Model here)
    const integrityIndex = logs ? (logs.length * 10) : 0
    const defenseBonus = logs ? (logs.filter(l => l.severity === 'NONE').length * 200000) : 0

    const report = {
        vin,
        estimatedLoss: 3000000 - defenseBonus,
        marketAvgLoss: 3000000,
        defenseBonus,
        aiAttentionScore: integrityIndex / 100,
        confidenceScore: 95.5,
        reasoning: `Analysis of ${logs?.length || 0} on-chain logs suggests strong structural defense due to certified shop presence.`
    }

    return new Response(
        JSON.stringify(report),
        { headers: { "Content-Type": "application/json" } },
    )
})
