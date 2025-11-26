// componente que usa el walkie talkie para mostrar los eventos en tiempo real
'use client';

import { useWebSocket, EventEnvelope } from '@/lib/use-websocket';
import { useState } from 'react';

// Un componente pequeño para mostrar el estado de la conexión
const ConnectionStatus = ({ isConnected }: { isConnected: boolean }) => {
  return (
    <div className="absolute top-4 right-4 flex items-center space-x-2">
      <span
        className={`h-3 w-3 rounded-full ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`}
      ></span>
      <span className="text-sm text-gray-300">
        {isConnected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
};

// Componente para formatear y mostrar un solo evento
const EventItem = ({ event }: { event: EventEnvelope }) => {
  let status = 'default';
  if (event.type.includes('Committed') || event.type.includes('Notified')) 
    status = 'success';
  if (event.type.includes('Reversed')) status = 'error';

  return (
    <li className="mb-4 flex items-start">
      <div
        className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
          status === 'success' ? 'bg-green-500' :
          status === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white font-semibold`}
      >
        {/* Un ícono simple o inicial */}
        {status === 'success' ? '✓' : status === 'error' ? '!' : 'i'}
      </div>
      <div className="ml-4">
        <p className="font-semibold text-white">{event.type}</p>
        <p className="text-sm text-gray-400">
          {new Date(event.ts).toLocaleTimeString()}
        </p>
        {/* Mostramos el payload para debuggear */}
        <pre className="mt-1 text-xs text-gray-500 bg-gray-950 p-2 rounded">
          {JSON.stringify(event.payload, null, 2)}
        </pre>
      </div>
    </li>
  );
};

// El componente principal del Timeline
export const TransactionTimeline = () => {
  const [userIdToFilter, setUserIdToFilter] = useState('user-123');
  
  const { isConnected, events, clearEvents } = useWebSocket({
    url: 'ws://localhost:3000/ws',
    userId: userIdToFilter,
  });

  return (
    <div className="w-full max-w-2xl p-6 bg-gray-900 rounded-lg shadow-md relative">
      {/* 1. El indicador de Conectado/Desconectado */}
      <ConnectionStatus isConnected={isConnected} />

      <h2 className="text-2xl font-semibold mb-4 text-white">
        Transaction Timeline
      </h2>
      <p className="text-gray-400 mb-6">Real-time event stream.</p>

      {/* Filtro de ejemplo - podrías atarlo a un input */}
      <p className="text-xs text-gray-500 mb-4">
        Showing events for: <strong>{userIdToFilter}</strong>
      </p>
      
      {/* 2. El contenedor de la lista de eventos */}
      <div className="h-96 overflow-y-auto pr-2">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg
              className="w-12 h-12 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>No events yet.</p>
            <p className="text-sm">Create a transaction to see the timeline.</p>
          </div>
        ) : (
          <ul>
            {/* 3. Mapeamos y renderizamos los eventos */}
            {events.map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </ul>
        )}
      </div>

      {/* 4. El botón de Limpiar */}
      <button
        onClick={clearEvents}
        className="mt-4 text-sm text-gray-400 hover:text-white"
      >
        Clear Timeline
      </button>
    </div>
  );
};