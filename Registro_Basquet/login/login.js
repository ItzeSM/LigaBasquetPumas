// login.js
import { supabase } from '../conexionSupabase.js';


document.getElementById('loginButton').addEventListener('click', async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    alert("✅ Inicio de sesión exitoso");
    window.location.href = "../Principal/VistaGeneral.html";
  } catch (error) {
    if (error.message === 'Invalid login credentials') {
      alert("❌ Credenciales incorrectas. Por favor, revisa tu correo y contraseña.");
    } else {
      alert("❌ Error al iniciar sesión: " + error.message);
    }
  }
});
