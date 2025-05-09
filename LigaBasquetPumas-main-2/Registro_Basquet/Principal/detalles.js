import { supabase } from '../conexionSupabase.js';

document.addEventListener('DOMContentLoaded', async () => {
  const categoriaId = obtenerCategoriaId();
  if (categoriaId) {
    await cargarDetallesCategoria(categoriaId);
  } else {
    console.error("No se encontró el ID de la categoría.");
  }
});

function obtenerCategoriaId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('categoriaId');
}

async function cargarDetallesCategoria(categoriaId) {
  try {
    const { data: categoria, error: categoriaError } = await supabase
      .from('categorias')
      .select('*')
      .eq('id', categoriaId)
      .single();

    if (categoriaError) throw categoriaError;

    document.getElementById('categoria-nombre').innerText = categoria.Nombre;

    const { data: inscripciones, error: inscripcionError } = await supabase
      .from('inscripciones')
      .select('*, pagos(*)')
      .eq('categoria_id', categoriaId);

    if (inscripcionError) throw inscripcionError;

    let jugadoresHTML = '<ul>';
    inscripciones.forEach(inscripcion => {
      const estadoPago = inscripcion.pagos.length > 0 ? inscripcion.pagos[0].estado_pago : 'Pendiente';
      const claseEstado = estadoPago === 'Pagado' ? 'pagado' : 'pendiente';

      jugadoresHTML += `
        <li>
          <strong>${inscripcion.nombre} ${inscripcion.apellido_paterno} ${inscripcion.apellido_materno}</strong><br>
          Fecha de nacimiento: ${inscripcion.fecha_nacimiento}<br>
          Teléfono: ${inscripcion.telefono}<br>
          Correo: ${inscripcion.correo || 'No especificado'}<br>
          Monto a pagar: $${inscripcion.monto_pago.toFixed(2)}<br>

          <div class="estado-con-boton">
            <span class="estado-pago ${claseEstado}">${estadoPago}</span>
            <button class="cambiar-estado" data-inscripcion-id="${inscripcion.id}" data-estado="${estadoPago}">
              Cambiar estado
            </button>
          </div>
        </li>
      `;
    });
    jugadoresHTML += '</ul>';

    document.getElementById('jugadores-lista').innerHTML = jugadoresHTML;

    document.querySelectorAll('.cambiar-estado').forEach(button => {
      button.addEventListener('click', cambiarEstadoPago);
    });

  } catch (error) {
    console.error("Error cargando los detalles de la categoría: ", error.message);
  }
}

async function cambiarEstadoPago(event) {
  const button = event.target;
  const inscripcionId = button.getAttribute('data-inscripcion-id');
  const estadoActual = button.getAttribute('data-estado');
  const nuevoEstado = estadoActual === 'Pagado' ? 'Pendiente' : 'Pagado';

  try {
    const { data: pagos, error: pagosError } = await supabase
      .from('pagos')
      .select('id')
      .eq('inscripcion_id', inscripcionId)
      .single();

    if (pagosError) throw pagosError;

    const pagoId = pagos.id;

    const { error: updateError } = await supabase
      .from('pagos')
      .update({ estado_pago: nuevoEstado })
      .eq('id', pagoId);

    if (updateError) throw updateError;

    button.setAttribute('data-estado', nuevoEstado);
    const estadoSpan = button.previousElementSibling;
    estadoSpan.innerText = nuevoEstado;
    estadoSpan.className = `estado-pago ${nuevoEstado === 'Pagado' ? 'pagado' : 'pendiente'}`;

  } catch (error) {
    console.error("Error al actualizar el estado de pago: ", error.message);
  }
}
