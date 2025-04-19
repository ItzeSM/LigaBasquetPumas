// conexionSupabase.js

import { createClient } from '@supabase/supabase-js';

// Reemplaza con tu URL y clave de Supabase
const supabaseUrl = 'https://etvwqfxefzvdztxndptn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0dndxZnhlZnp2ZHp0eG5kcHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NDk2MjYsImV4cCI6MjA2MDUyNTYyNn0.2fmsHn64AQPmTTww1i_fT_iPLPU6HwWMzGeJKbnJ_iM';

const supabase = createClient(supabaseUrl, supabaseKey);

// Exportar el cliente para usarlo en otros módulos
export { supabase };
