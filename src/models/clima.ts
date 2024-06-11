import mongoose from 'mongoose';

const ClimaSchema = new mongoose.Schema({
  nombreCiudad: String,
  temperatura: Number,
  temperaturaMax: Number,
  temperaturaMin: Number,
  humedad: Number,
  fecha: {
    type: Date,
    default: Date.now,
    get: (timestamp: string | number | Date) => {
      const date = new Date(timestamp);
      return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
    }
  },
  hora: {
    type: Date,
    default: Date.now,
    get: (timestamp: string | number | Date) => {
      const time = new Date(timestamp);
      return `${time.getHours()}:${time.getMinutes()}`;
    }
  },
});

ClimaSchema.set('toJSON', { getters: true });

export default mongoose.models.Clima || mongoose.model('Clima', ClimaSchema);
