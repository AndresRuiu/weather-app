import { NextResponse, NextRequest } from "next/server";
import { ConnectMD } from '@/lib/conection';
import Clima from '@/models/clima';

export async function GET(req: NextRequest) {
  if (req.method !== 'GET') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  try {
    await ConnectMD();
    const climas = await Clima.find({});
    return NextResponse.json({ success: true, data: climas });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
};

export async function POST(req: NextRequest) {
  ConnectMD();
  try {
    const { nombreCiudad, temperatura, temperaturaMax, temperaturaMin, humedad } = await req.json();
    const newClima = new Clima({nombreCiudad, temperatura, temperaturaMax, temperaturaMin, humedad});
    const savedClima = await newClima.save();
    return NextResponse.json(savedClima);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
