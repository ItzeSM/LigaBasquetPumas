import { supabase } from '../conexionSupabase.js';

document.getElementById('subirArchivo').addEventListener('click', async function () {
  // Obtener los archivos del formulario
  const curpFile = document.getElementById('curp_file').files[0];
  const actaFile = document.getElementById('acta_file').files[0];
  const credencialFile = document.getElementById('credencial_file').files[0];
  const ineFile = document.getElementById('ine_file').files[0];
  const fotoFile = document.getElementById('foto_file').files[0];

  // Verificar que se haya seleccionado todos los archivos requeridos
  if (!curpFile || !actaFile || !credencialFile || !ineFile || !fotoFile) {
    alert("Por favor, sube todos los archivos requeridos.");
    return;
  }

  try {
    // Subir los archivos a Supabase Storage
    const uploadFile = async (file, folder) => {
      const { data, error } = await supabase.storage
        .from('documentos')  // Asegúrate de que el bucket 'documentos' existe en Supabase
        .upload(`${folder}/${file.name}`, file);

      if (error) {
        console.error(`Error al subir ${file.name}:`, error);
        throw new Error(`Error al subir ${file.name}: ${error.message}`);
      }

      return data;
    };

    // Subir cada archivo y manejar errores por archivo
    const curpData = await uploadFile(curpFile, 'curp');
    const actaData = await uploadFile(actaFile, 'acta');
    const credencialData = await uploadFile(credencialFile, 'credencial');
    const ineData = await uploadFile(ineFile, 'ine');
    const fotoData = await uploadFile(fotoFile, 'foto');

    // Guardar las URLs de los archivos subidos en la base de datos de Supabase
    const { data, error } = await supabase
      .from('documentos')
      .insert([
        {
          curp_url: curpData.Key,
          acta_url: actaData.Key,
          credencial_url: credencialData.Key,
          ine_url: ineData.Key,
          foto_url: fotoData.Key,
          inscripcion_id: localStorage.getItem('inscripcion_id') // Obtener el ID de inscripción
        }
      ]);

    if (error) {
      console.error('Error al guardar los datos en la base de datos:', error);
      alert("Hubo un error al guardar los datos en la base de datos.");
    } else {
      alert("Documentos subidos correctamente.");
      
    }
  } catch (err) {
    console.error("Error al subir los archivos:", err);
    alert(`Error al subir los documentos: ${err.message}`);
  }
});

// Función para regresar al formulario de inscripción
document.getElementById('regresarFormulario').addEventListener('click', function () {
  window.location.href = 'formularioInscripcion.html'; // Asegúrate de que este sea el URL correcto
});
