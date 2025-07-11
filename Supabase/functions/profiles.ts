// PUBLIC_INTERFACE
/**
 * Supabase Edge Function for basic user profile management.
 * Handles creating, updating, reading user profiles.
 */
import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  )
  const { method } = req
  const userId = req.headers.get("x-user-id")
  if (!userId) {
    return new Response("Missing user ID", { status: 401 })
  }

  // Get profile
  if (method === "GET") {
    let { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
    if (error) return new Response(error.message, { status: 400 })
    return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } })
  }

  // Update profile
  if (method === "PUT" || method === "POST") {
    const body = await req.json()
    let { data, error } = await supabase
      .from("profiles")
      .upsert([{ ...body, id: userId }], { onConflict: ['id'] })
      .select()
      .single()
    if (error) return new Response(error.message, { status: 400 })
    return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } })
  }

  return new Response("Not found", { status: 404 })
})
// PUBLIC_INTERFACE END
