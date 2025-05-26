import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = 3000;

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase setup
const SUPABASE_URL = "https://gyatbfarirtvqupmxbjr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5YXRiZmFyaXJ0dnF1cG14YmpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzczODc0MiwiZXhwIjoyMDYzMzE0NzQyfQ.O6CH0Z6DrQTjvUIStC5IzqpiUkW_ttvgnQGoFFlQy2o";

if (!SUPABASE_KEY) {
  throw new Error("Missing Supabase service key. Please check your .env file.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static frontend files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Homepage route - serves index.html from public
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Loan application form POST route
app.post('/apply', async (req, res) => {
  try {
    const { name, email, phone, loan_type, loan_amount } = req.body;

    // Basic validation (you can expand this)
    if (!name || !email || !phone || !loan_type || !loan_amount) {
      return res.status(400).send('All fields are required.');
    }

    // Insert into Supabase 'loan_applications' table
    const { data, error } = await supabase
      .from('loan_applications')
      .insert([
        { 
          name, 
          email, 
          phone, 
          loan_type, 
          loan_amount: Number(loan_amount) 
        }
      ]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).send('Error saving application.');
    }

    res.send('Application submitted successfully!');
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send('Server error.');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
