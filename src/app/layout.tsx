"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import "./style.scss";
import { createContext, useState } from 'react';

interface Ciudad {
  _id: string;
  nombreCiudad: string;
  temperatura: number;
  fecha: string;
  hora: string;
}

const inter = Inter({ subsets: ["latin"] });

interface ClimaContextType {
  cities: Ciudad[];
  updateCities: () => void;
}

export const ClimaContext = createContext<ClimaContextType>({
  cities: [],
  updateCities: () => { }
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [cities, setCities] = useState<Ciudad[]>([]);

  const updateCities = async () => {
    try {
      const response = await fetch('/api/clima');
      const { data }: { data: Ciudad[] } = await response.json();
      setCities(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <ClimaContext.Provider value={{ cities, updateCities }}>
          {children}
        </ClimaContext.Provider>
      </body>
    </html>
  );
}
