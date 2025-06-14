import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { supabase } from '../config/supabase.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    await supabase.from('users').select('student_id').limit(1)
    res.json({ status: 'ok' })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
})

// ✅ Add users route
app.get('/api/users', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('student_id', { ascending: true })

  if (error) {
    return res.status(500).json({ success: false, error: error.message })
  }

  res.json({ success: true, data })
})

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
