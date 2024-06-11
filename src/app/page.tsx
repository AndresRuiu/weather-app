"use client"

const API_KEY = '093adf4cfad7ed6349be0f6efe53c574'

import { useState, useEffect, useContext } from 'react';
import { obtenerClima } from '@/lib/utils';
import CiudadCard from '@/app/components/CiudadCard';
import Nav from '@/app/components/Nav';
import axios from 'axios';
import  {ClimaContext}  from './layout';

interface Clima {
  temp: number;
  temp_max: number;
  temp_min: number;
  humidity: number;
}

interface Weather {
  icon: string;
}

interface DatosCiudad {
  id: number;
  name: string;
  main: Clima;
  weather: Weather[];
}

const Weather: React.FC = () => {
  const [datosClima, setDatosClima] = useState<DatosCiudad[] | null>(null);
  const [ultimaCiudadBuscada, setUltimaCiudadBuscada] = useState<DatosCiudad[] | null>(null);
  const [ciudadBuscada, setCiudadBuscada] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(false);
  const [ciudadNoEncontrada, setCiudadNoEncontrada] = useState<boolean>(false);
  const { updateCities } = useContext(ClimaContext);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ciudad = e.target.value;
    setCiudadBuscada(ciudad);
    if (ciudad.length === 0) {
      setDatosClima(ultimaCiudadBuscada);
      setCargando(false);
      setCiudadNoEncontrada(false);
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  const handleEnter = async () => {
    if (ciudadBuscada.length >= 3) {
      try {
        const datosClima = await obtenerClima(ciudadBuscada, API_KEY, setCargando, setDatosClima, setUltimaCiudadBuscada, setCiudadNoEncontrada);
        if (datosClima && datosClima.length > 0) {
          const temperatura = datosClima[0].main.temp;
          const temperaturaMax = datosClima[0].main.temp_max
          const temperaturaMin = datosClima[0].main.temp_min
          const humedad = datosClima[0].main.humidity
          const nombreCiudad = capitalizeFirstLetter(ciudadBuscada);
          const response = await axios.post('/api/clima', { nombreCiudad, temperatura, temperaturaMax, temperaturaMin, humedad });
          console.log(response.data);
          updateCities();
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(`Error al obtener el clima: ${JSON.stringify(error.response, null, 2)}`);
        } else {
          console.error(error);
        }
      } finally {
        setCargando(false);
      }
    }
  };
  
  

  const handleApretarTecla = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await handleEnter();
      setCiudadBuscada('');
    }
  };

  const geolocalizacion = async () => {
    setCargando(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const respuesta = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=es&units=metric`);
      const datosCiudad = await respuesta.json();
      setDatosClima([datosCiudad]);
      setUltimaCiudadBuscada([datosCiudad]);
      setCargando(false);
    }, () => {
      setDatosClima([]);
      setCargando(false);
    });
  };

  useEffect(() => {
    geolocalizacion();
  }, []);
  

  return (
    <>
    <section className="app" style={{ height: cargando || ciudadNoEncontrada || (datosClima && datosClima.length === 0) ? "100vh" : "auto" }}>
      <Nav />
      <input
        type="search"
        name="search"
        placeholder="Buscar ciudad"
        aria-label="Search"
        value={ciudadBuscada}
        onChange={handleInputChange}
        onKeyDown={handleApretarTecla}
      />

      {cargando ? (
        <article aria-busy="true" style={{ color: "gray" }}>Cargando...</article>
      ) : ciudadNoEncontrada || (datosClima && datosClima.length === 0) ? (
        <h2 style={{ textAlign: "center" }}>No se encontró la ciudad buscada</h2>
      ) : (
        datosClima && datosClima.map((datosCiudad) => (
          <CiudadCard key={datosCiudad.id} datosCiudad={datosCiudad} />
        ))
      )}
    </section>
    </>
    );
};

export default Weather