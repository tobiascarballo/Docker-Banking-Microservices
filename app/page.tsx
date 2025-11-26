// es la web principal que muestra el formulario y el timeline
import { TransactionForm } from '@/components/transaction-form';
import { TransactionTimeline } from '@/components/transaction-timeline';

// Esta es la página principal de la app
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-12 bg-gray-950 text-white">
      {/* 1. Título Principal [cite: 78, 79] */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Banking Events System</h1>
        <p className="text-lg text-gray-400">
          Real-time transaction processing with Kafka
        </p>
      </div>

      {/* 2. Contenedor principal (Formulario y Timeline) [cite: 81, 88] */}
      <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-8">
        
        {/* Columna Izquierda: El Formulario */}
        <div className="lg:w-1/3">
          <TransactionForm />
        </div>

        {/* Columna Derecha: El Timeline */}
        <div className="lg:w-2/3">
          <TransactionTimeline />
        </div>

      </div>
    </main>
  );
}