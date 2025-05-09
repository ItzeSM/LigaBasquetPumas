import { supabase } from '../conexionSupabase.js';

const form = document.getElementById('form-inscripcion');

let alergias = false;
let cirugias = false;
let afecciones = false;

// Mostrar u ocultar campos de detalle según la selección
function toggleDetalles(selectId, containerId, value) {
  const container = document.getElementById(containerId);
  if (value === 'true') {
    container.classList.remove('oculto');
  } else {
    container.classList.add('oculto');
  }
}

// Botones de Alergias
document.getElementById('alergias_si').addEventListener('click', () => {
  alergias = true;
  toggleDetalles('alergias', 'alergias_detalles_container', 'true');
  document.getElementById('alergias_si').classList.add('btn-activo');
  document.getElementById('alergias_no').classList.remove('btn-activo');
});

document.getElementById('alergias_no').addEventListener('click', () => {
  alergias = false;
  toggleDetalles('alergias', 'alergias_detalles_container', 'false');
  document.getElementById('alergias_no').classList.add('btn-activo');
  document.getElementById('alergias_si').classList.remove('btn-activo');
});

// Botones de Cirugías
document.getElementById('cirugias_si').addEventListener('click', () => {
  cirugias = true;
  toggleDetalles('cirugias', 'cirugias_detalles_container', 'true');
  document.getElementById('cirugias_si').classList.add('btn-activo');
  document.getElementById('cirugias_no').classList.remove('btn-activo');
});

document.getElementById('cirugias_no').addEventListener('click', () => {
  cirugias = false;
  toggleDetalles('cirugias', 'cirugias_detalles_container', 'false');
  document.getElementById('cirugias_no').classList.add('btn-activo');
  document.getElementById('cirugias_si').classList.remove('btn-activo');
});

// Botones de Afecciones
document.getElementById('afecciones_si').addEventListener('click', () => {
  afecciones = true;
  toggleDetalles('afecciones', 'afecciones_detalles_container', 'true');
  document.getElementById('afecciones_si').classList.add('btn-activo');
  document.getElementById('afecciones_no').classList.remove('btn-activo');
});

document.getElementById('afecciones_no').addEventListener('click', () => {
  afecciones = false;
  toggleDetalles('afecciones', 'afecciones_detalles_container', 'false');
  document.getElementById('afecciones_no').classList.add('btn-activo');
  document.getElementById('afecciones_si').classList.remove('btn-activo');
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const fechaNacimiento = new Date(document.getElementById('fecha_nacimiento').value);
    const añoNacimiento = fechaNacimiento.getFullYear();
  
    // Asignación de categoría según el año
    let categoria_id = null;
    if (añoNacimiento >= 2016 && añoNacimiento <= 2017) {
      categoria_id = 'f32277eb-33ed-4373-8f11-68d426a75694'; // Pañales
    } else if (añoNacimiento >= 2014 && añoNacimiento <= 2015) {
      categoria_id = '18180da6-ea02-4e60-9432-8b06499c8afd'; // Macro
    } else if (añoNacimiento >= 2012 && añoNacimiento <= 2013) {
      categoria_id = 'e77c927e-96eb-4770-932c-76b2ca6d5de3'; // Infantil
    } else if (añoNacimiento >= 2010 && añoNacimiento <= 2011) {
      categoria_id = 'dd58d6ec-ceba-4b48-bce3-c2ef2eda5069'; // Pasarela
    } else if (añoNacimiento >= 2008 && añoNacimiento <= 2009) {
      categoria_id = '6e00a99f-96e6-4628-8a8c-9709f215c94d'; // Cadete
    } else {
      alert('La fecha de nacimiento no corresponde a ninguna categoría.');
      return;
    }
  
    // Determinar el monto según la cantidad de personas
    let monto_pago = 250; // Suponemos que es 1 persona
    const numeroPersonas = 1;  // Aquí deberías calcular el número de personas basado en tu lógica
    
    if (numeroPersonas > 1) {
      monto_pago = 200; // Si hay 2 o más personas, el monto cambia
    }
  
    const data = {
      nombre: document.getElementById('nombre').value,
      apellido_paterno: document.getElementById('apellido_paterno').value,
      apellido_materno: document.getElementById('apellido_materno').value,
      genero: document.getElementById('genero').value,
      curp: document.getElementById('curp').value,
      fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
      telefono: document.getElementById('telefono').value,
      correo: document.getElementById('correo').value || null,
      nombre_tutor: document.getElementById('nombre_tutor').value,
      alergias,
      alergias_detalles: document.getElementById('alergias_detalles').value || null,
      cirugias,
      cirugias_detalles: document.getElementById('cirugias_detalles').value || null,
      afecciones,
      afecciones_detalles: document.getElementById('afecciones_detalles').value || null,
      categoria_id,
      monto_pago: monto_pago,  // Aquí asignamos el monto calculado
    };
  
    // Insertar en Supabase
    const { data: insertedData, error } = await supabase
      .from('inscripciones')
      .insert([data])
      .select('id');
  
    if (error) {
      alert('Error al registrar el alumno.');
    } else {
      alert('¡Registro exitoso!');
      const idGenerado = insertedData[0].id;
  
      // Guardar el inscripcion_id en localStorage
      localStorage.setItem('inscripcion_id', idGenerado);
      console.log(`ID de inscripción guardado en localStorage: ${idGenerado}`);
  
      form.reset();
  
      // Redirigir a página de documentos
      window.location.href = 'subirArchivos.html';
    }
  });
  