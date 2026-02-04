
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
    const { vin, authCode } = await req.json()

    const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Fetch Vehicle and its Owner
    const { data: vehicle, error: vehicleError } = await supabaseClient
        .from('vehicles')
        .select('owner_id')
        .eq('vin', vin)
        .single()

    if (vehicleError || !vehicle) {
        return new Response(
            JSON.stringify({ error: "Vehicle not found" }),
            { status: 404, headers: { "Content-Type": "application/json" } }
        )
    }

    // 2. Verify Authorization Code
    // In a real system, this code should be stored in a temporary 'auth_codes' table
    // with an expiration time, linked to the vehicle/owner.
    // Here we simulate a verification logic.

    const isValid = authCode === "OZ-1234" // Mock valid code

    if (isValid) {
        return new Response(
            JSON.stringify({
                success: true,
                message: "Double-Lock Authorized. Maintenance slot opened."
            }),
            { headers: { "Content-Type": "application/json" } }
        )
    } else {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Invalid Authorization Code. Access Denied."
            }),
            { status: 403, headers: { "Content-Type": "application/json" } }
        )
    }
})
