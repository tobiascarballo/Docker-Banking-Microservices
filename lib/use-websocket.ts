// es como un walkie talkie que se conecta al gateway y escucha los mensajes
'use client';

import { useState, useEffect, useRef } from 'react';

export interface EventEnvelope {
  id: string; 
  type: string;
  version: number;
  ts: number; 
  transactionId: string;
  userId: string;
  payload: any; 
}

// Opciones para el hook (funcion especial en React)
interface UseWebSocketOptions {
  url: string;
  onEvent?: (event: EventEnvelope) => void; 
  userId?: string;
  transactionId?: string;
}

export const useWebSocket = ({ // hook para el websocket
  url,
  onEvent,
  userId,
  transactionId,
}: UseWebSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false); 
  const [events, setEvents] = useState<EventEnvelope[]>([]); 
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Función para conectar
    const connect = () => {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected to', url);
        setIsConnected(true);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setTimeout(connect, 3000);
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        ws.close();
      };

      ws.onmessage = (message) => {
        try {
          const event: EventEnvelope = JSON.parse(message.data);
          
          // Filtramos por userId o transactionId si estan
          if (userId && event.userId !== userId) return;
          if (transactionId && event.transactionId !== transactionId) return;

          console.log('Received event:', event);
          setEvents((prevEvents) => [...prevEvents, event]);
          
          if (onEvent) {
            onEvent(event); 
          }
        } catch (err) {
          console.error('Failed to parse event message:', message.data, err); 
        }
      };
    };

    connect();

    // limpieza al desmontar el componente
    return () => {
      if (wsRef.current) {
        wsRef.current.close(); 
      }
    };
  }, [url]);

  // Función para limpiar el timeline de eventos
  const clearEvents = () => { 
    setEvents([]);
  };

  return { isConnected, events, clearEvents };
};