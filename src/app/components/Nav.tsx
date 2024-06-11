
import React, { useState, useEffect, useContext } from 'react';
import  {ClimaContext}  from '../layout';

interface Ciudad {
  _id: string;
  nombreCiudad: string;
  temperatura: number;
  fecha: string;
  hora: string;
}

const Nav: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [cities, setCities] = useState<Ciudad[]>([]);
  const { cities: citiesFromContext } = useContext(ClimaContext);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/api/clima');
        const { data }: { data: Ciudad[] } = await response.json();
        setCities(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    setCities(citiesFromContext);
  }, [citiesFromContext]);

  return (
    <nav>
      <ul>
        <li><h1>Clima</h1></li>
      </ul>
      <ul>
        <li><button className="secondary" onClick={() => setShowDialog(true)}>Registro</button></li>
      </ul>
      {showDialog && (
        <dialog open>
          <article>
            <h2>Registro</h2>
            {Array.isArray(cities) && cities.length !== 0 ?
              cities.map((datos) => (
                <article className='flex justify-between items-center m-0 mt-2 text-center bg-gray-950' key={datos._id}>
                  <div className='flex justify-between items-center gap-2'><h3>{datos.nombreCiudad} </h3><p> / {datos.temperatura} ºC</p> </div>
                  <div><p>{datos.fecha} / {datos.hora}</p></div>
                </article>
              )) : <p>No hay datos disponibles.</p>
            }
            <footer>
              <button className='bg-red-700 border-red-700' onClick={() => {
                setShowDialog(false);
              }}>Salir</button>
            </footer>
          </article>
        </dialog>
      )}
    </nav>
  );
};

export default Nav;
