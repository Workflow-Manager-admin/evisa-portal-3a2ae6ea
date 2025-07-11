// PUBLIC_INTERFACE
/**
 * Supabase Edge Function for handling visa applications.
 * Allows users to submit, update, and fetch their own eVisa applications.
 */
import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  )
  const userId = req.headers.get("x-user-id")
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  if (req.method === "GET") {
    // Get all applications for the user
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", userId)
    if (error) return new Response(error.message, { status: 400 })
    return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } })
  }

  if (req.method === "POST") {
    // Create a new application
    const body = await req.json()
    const insert = { ...body, user_id: userId } // always associate with user
    const { data, error } = await supabase
      .from("applications")
      .insert([insert])
      .select()
      .single()
    if (error) return new Response(error.message, { status: 400 })
    return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } })
  }

  // Update an application (partial)
  if (req.method === "PUT") {
    const body = await req.json()
    if (!body.id) {
      return new Response("Missing application id", { status: 400 })
    }
    // Users can only update their own applications
    const { data, error } = await supabase
      .from("applications")
      .update({ ...body })
      .eq("id", body.id)
      .eq("user_id", userId)
      .select()
      .single()
    if (error) return new Response(error.message, { status: 400 })
    return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } })
  }

  return new Response("Method Not Allowed", { status: 405 })
})
// PUBLIC_INTERFACE END
