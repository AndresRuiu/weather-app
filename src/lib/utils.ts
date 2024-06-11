export const obtenerClima = async (
  ciudad: string,
  API_KEY: string,
  setCargando: (cargando: boolean) => void,
  setDatosClima: (datosClima: any) => void,
  setUltimaCiudadBuscada: (ultimaCiudadBuscada: any) => void,
  setCiudadNoEncontrada: ((ciudadNoEncontrada: boolean) => void) | null
) => {
  try {
    const respuesta = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&lang=es&units=metric`);
    if (respuesta.ok) {
      let datosCiudad = await respuesta.json();
      datosCiudad = Array.isArray(datosCiudad) ? datosCiudad : [datosCiudad];
      setDatosClima(datosCiudad);
      setUltimaCiudadBuscada(datosCiudad);
      if (setCiudadNoEncontrada) {
        setCiudadNoEncontrada(false);
      }
      return datosCiudad;
    } else if (respuesta.status === 404) {
      setDatosClima([]);
      if (setCiudadNoEncontrada) {
        setCiudadNoEncontrada(true);
      }
    } else {
      console.error(`Error HTTP: ${respuesta.status}`);
    }
  } catch (error) {
    console.error(`Error de red o inesperado: ${error}`);
  }
  setCargando(false);
};
