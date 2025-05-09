import { supabase } from '../conexionSupabase.js';

document.getElementById('registerButton').addEventListener('click', async () => {
  const nombre = document.getElementById("nombre").value;
  const apellidoP = document.getElementById("apellidoP").value;
  const apellidoM = document.getElementById("apellidoM").value;
  const telefono = document.getElementById("telefono").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // Crear usuario en Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          apellidoP,
          apellidoM,
          telefono,
        }
      }
    });

    if (error) throw error;

    alert("✅ Registro exitoso. Verifica tu correo electrónico.");
    window.location.href = "FormularioLogin.html";
  } catch (error) {
    alert("❌ Error al registrarse: " + error.message);
  }
});
