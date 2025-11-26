// el formulario que el usuario llena, envia los datos a la api
'use client';

import { useState } from 'react';

export const TransactionForm = () => { 
  // Estados para cada campo del formulario
  const [userId, setUserId] = useState('user-123');
  const [fromAccount, setFromAccount] = useState('ACC-001');
  const [toAccount, setToAccount] = useState('ACC-002');
  const [amount, setAmount] = useState('100.00'); 
  const [currency, setCurrency] = useState('USD'); 
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true); 
    setMessage(null); 

    try {
      // Aca es donde se llama a la API
      const response = await fetch('/api/transactions', {
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ 
          userId, 
          fromAccount, 
          toAccount, 
          amount: parseFloat(amount), 
          currency,
        }),
      });

      const data = await response.json(); 

      if (!response.ok) { // si no es ok, lanza error
        throw new Error(data.error || 'Falló al iniciar la transacción');
      }

      // Si sale bien, mostramos ID de la transacción
      setMessage(`Transacción iniciada: ${data.transactionId}`);
    } catch (err: any) {
      console.error(err);
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-white">New Transaction</h2>
      <p className="text-gray-400 mb-6">Initiate a new banking transaction.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-300">
              User ID
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-300">
              Currency
            </label>
            <input
              type="text"
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="fromAccount" className="block text-sm font-medium text-gray-300">
            From Account
          </label>
          <input
            type="text"
            id="fromAccount"
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="toAccount" className="block text-sm font-medium text-gray-300">
            To Account
          </label>
          <input
            type="text"
            id="toAccount"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Initiate Transaction'}
          </button>
        </div>
      </form>
      
      {message && (
        <p className={`mt-4 text-sm ${message.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
          {message}
        </p>
      )}
    </div>
  );
};