// es la API que recibe el fetch del formulario, valida los datos y los pone en txn.commands
import { NextResponse } from 'next/server'; 
import { kafka, KAFKA_TOPIC_COMMANDS } from '@/lib/kafka'; 
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  const producer = kafka.producer();

  try {
    // 1. Leer los datos del formulario que nos envió el fetch
    const body = await request.json();
    const { userId, fromAccount, toAccount, amount, currency } = body;

    // 2. Validación simple de los datos
    if (!userId || !fromAccount || !toAccount || !amount || !currency) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // 3. (El mensaje para Kafka)
    const transactionId = randomUUID(); 
    const commandId = randomUUID(); 

    const command = {
      id: commandId,
      type: 'txn.TransactionInitiated',
      version: 1,
      ts: Date.now(),
      transactionId: transactionId,
      userId: userId,
      payload: {
        fromAccount,
        toAccount,
        amount,
        currency,
        userId,
      },
    };

    await producer.connect();
    await producer.send({
      topic: KAFKA_TOPIC_COMMANDS,
      messages: [
        {
          // Usamos transactionId como 'key' 
          key: transactionId,
          value: JSON.stringify(command),
        },
      ],
    });

    console.log(`Comando ${command.type} publicado para ${transactionId}`);

    // 5. Responder al frontend (transaction-form)
    return NextResponse.json(
      { message: 'Transacción iniciada', transactionId: transactionId },
      { status: 202 }
    );
  } catch (error) {
    console.error('Error al publicar el comando en Kafka:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await producer.disconnect();
  }
}