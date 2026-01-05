// src/supabaseClient.js
// Provided by user
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ypapbvklobkapggumxct.supabase.co' //'https://ypapbvklobkapggumxct.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY  // Use env for security
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase