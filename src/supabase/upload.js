import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

// Lee variables de entorno de Vite: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
const SUPABASE_URL = "https://nauibxcauucvnmcvubuu.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdWlieGNhdXVjdm5tY3Z1YnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxODk5MTQsImV4cCI6MjA2Nzc2NTkxNH0.K5cOOpeMeGGBB9StigqxvffWiK9ZzMIXYFZlXnqhrxo"
const SUPABASE_BUCKET = 'elgestormx'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase environment variables not set. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export async function uploadToSupabase(file) {
  if (!file) throw new Error('No file provided')
  const ext = file.name.split('.').pop()
  const fileName = `${uuidv4()}.${ext}`
  const filePath = `${fileName}`

  const { data, error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Supabase upload error:', error)
    throw error
  }

  // Obtener la URL pública (requiere que el bucket sea público o generar signed URL)
  const { data: publicUrlData } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(filePath)
  return publicUrlData?.publicUrl || null
}