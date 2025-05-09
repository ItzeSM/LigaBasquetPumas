import { supabase } from '../conexionSupabase.js';


document.addEventListener('DOMContentLoaded', async () => {
  try {
    await cargarCategorias();
  } catch (error) {
    console.error("Error al cargar las categorías:", error.message);
  }
});

// Cargar las categorías en el panel principal
async function cargarCategorias() {
  try {
    // Limpiar el contenedor de categorías antes de agregar nuevas
    const categoriasContainer = document.getElementById('categorias');
    categoriasContainer.innerHTML = '';

    // Obtener categorías desde Supabase
    const { data: categorias, error: categoriaError } = await supabase
      .from('categorias')
      .select('*');

    if (categoriaError) throw categoriaError;

    // Si no hay categorías, mostrar un mensaje
    if (!categorias || categorias.length === 0) {
      categoriasContainer.innerHTML = '<p>No hay categorías disponibles.</p>';
      return;
    }

    // Iterar sobre las categorías y mostrarlas
    for (let categoria of categorias) {
      // Obtener los números de alumnos por estado de pago
      const totalAlumnos = await obtenerJugadoresPorCategoria(categoria.id);
      const pagosRealizados = await obtenerPagosRealizados(categoria.id);
      const pagosPendientes = totalAlumnos - pagosRealizados;

      const categoriaElement = document.createElement('div');
      categoriaElement.classList.add('categoria');
      
      categoriaElement.innerHTML = `
        <h3>${categoria.Nombre}</h3>
        <p>👥 Jugadores: <strong>${totalAlumnos}</strong></p>
        <p>✅ Pagados: <strong>${pagosRealizados}</strong></p>
        <p>❌ Pendientes: <strong>${pagosPendientes}</strong></p>
        <p>💸 Próximo pago: <strong>${obtenerProximoPago()}</strong></p>
        <button class="ver-detalles" data-categoria-id="${categoria.id}">Ver detalles</button>
      `;

      categoriasContainer.appendChild(categoriaElement);
    }

    // Agregar el evento de "Ver detalles"
    document.querySelectorAll('.ver-detalles').forEach(button => {
      button.addEventListener('click', (e) => {
        const categoriaId = e.target.getAttribute('data-categoria-id');
        window.location.href = `detalles.html?categoriaId=${categoriaId}`;
      });
    });

  } catch (error) {
    console.error("Error cargando las categorías: ", error.message);
  }
}

// ================== FUNCIONES AUXILIARES ==================

async function obtenerJugadoresPorCategoria(categoriaId) {
  const { data: jugadores, error } = await supabase
    .from('inscripciones')
    .select('id')
    .eq('categoria_id', categoriaId);

  if (error) {
    console.error("Error al obtener jugadores:", error.message);
    return 0;
  }

  return jugadores.length;
}

async function obtenerPagosRealizados(categoriaId) {
  const { data: inscripciones } = await supabase
    .from('inscripciones')
    .select('id')
    .eq('categoria_id', categoriaId);

  if (!inscripciones || inscripciones.length === 0) return 0;

  const inscripcionIds = inscripciones.map(i => i.id);

  const { data: pagos, error } = await supabase
    .from('pagos')
    .select('id')
    .in('inscripcion_id', inscripcionIds)
    .eq('estado_pago', 'Pagado');

  if (error) {
    console.error("Error al obtener pagos realizados:", error.message);
    return 0;
  }

  return pagos.length;
}

function obtenerProximoPago() {
  const hoy = new Date();
  const dia = hoy.getDate();
  const mes = hoy.getMonth() + 1;
  const anio = hoy.getFullYear();

  if (dia <= 5) {
    return `05/${mes.toString().padStart(2, '0')}/${anio}`;
  } else if (dia <= 20) {
    return `20/${mes.toString().padStart(2, '0')}/${anio}`;
  } else {
    const siguienteMes = mes === 12 ? 1 : mes + 1;
    const siguienteAnio = mes === 12 ? anio + 1 : anio;
    return `05/${siguienteMes.toString().padStart(2, '0')}/${siguienteAnio}`;
  }
}
