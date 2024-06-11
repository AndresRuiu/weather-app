"use client"

import React from 'react';
import Image from 'next/image';

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
  name: string;
  main: Clima;
  weather: Weather[];
}

interface CiudadCardProps {
  datosCiudad: DatosCiudad | null;
}

const CiudadCard: React.FC<CiudadCardProps> = ({ datosCiudad }) => {
  if (!datosCiudad || Object.keys(datosCiudad).length === 0) {
    return <h2 style={{ textAlign: "center" }}>No se encontró la ciudad buscada</h2>;
  }

  return (
    <article className="ciudad-card">
      <header><h2 className="ciudad-nombre">{datosCiudad.name}</h2></header>
      <Image
        src={`openweathermap/${datosCiudad.weather[0].icon}.svg`}
        alt="Icono del clima"
        width={500}
        height={300}
        layout="responsive"
        style={{
          backgroundColor: datosCiudad.weather[0].icon.includes('d') ? 'lightblue' : '#21233d',
        }}
      />
      <footer className="clima-info">
        <h3>Temperatura: {datosCiudad.main.temp}°C</h3>
        <p>Máxima: {datosCiudad.main.temp_max}°C / Mínima: {datosCiudad.main.temp_min}°C</p>
        <p>Humedad: {datosCiudad.main.humidity}%</p>
      </footer>
    </article>
  );
};

export default CiudadCard;
