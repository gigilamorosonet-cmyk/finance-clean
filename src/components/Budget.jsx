import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

export function Budget() {
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'gain', description: 'Salaire', amount: 2500, date: '2026-06-01' },
    { id: 2, type: 'expense', description: 'Loyer', amount: 1200, date: '2026-06-01' },
    { id: 3, type: 'expense', description: 'Nourriture', amount: 320, date: '2026-06-02' },
    { id: 4, type: 'gain', description: 'Freelance', amount: 800, date: '2026-06-03' },
  ]);

  const [form, setForm] = useState({ type: 'expense', description: '', amount: '' });

  const addTransaction = () => {
    if (form.description && form.amount) {
      setTransactions([
        ...transactions,
        {
          id: Date.now(),
          type: form.type,
          description: form.description,
          amount: parseFloat(form.amount),
          date: new Date().toISOString().split('T')[0],
        },
      ]);
      setForm({ type: 'expense', description: '', amount: '' });
    }
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const totalGains = transactions
    .filter(t => t.type === 'gain')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalGains - totalExpenses;

  return (
    <div className="space-y-8">
      {/* Titre */}
      <div>
        <h1 className="text-4xl font-bold text-slate-100 mb-2">💰 Budget</h1>
        <p className="text-slate-400">Gère tes dépenses et tes gains</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-2">💸 Entrées</p>
          <p className="text-3xl font-bold text-green-400">${totalGains.toFixed(2)}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-2">📉 Sorties</p>
          <p className="text-3xl font-bold text-red-400">-${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-2">⚖️ Balance</p>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
            ${balance.toFixed(2)}
          </p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-2">📊 Transactions</p>
          <p className="text-3xl font-bold text-blue-400">{transactions.length}</p>
        </div>
      </div>

      {/* Formulaire Ajouter */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4">➕ Ajouter une transaction</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 font-medium"
          >
            <option value="expense">Dépense</option>
            <option value="gain">Gain</option>
          </select>

          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500"
          />

          <input
            type="number"
            placeholder="Montant"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500"
          />

          <button
            onClick={addTransaction}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500 text-cyan-400 font-medium hover:bg-cyan-500/30 transition-all"
          >
            <Plus size={18} />
            Ajouter
          </button>
        </div>
      </div>

      {/* Tableau Transactions */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4">📋 Transactions récentes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">Date</th>
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">Description</th>
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">Type</th>
                <th className="text-right py-3 px-4 text-slate-400 font-semibold">Montant</th>
                <th className="text-center py-3 px-4 text-slate-400 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-all">
                  <td className="py-3 px-4 text-slate-300">{t.date}</td>
                  <td className="py-3 px-4 text-slate-300 font-medium">{t.description}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      t.type === 'gain'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {t.type === 'gain' ? 'Gain' : 'Dépense'}
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-right font-bold text-lg ${
                    t.type === 'gain' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {t.type === 'gain' ? '+' : '-'}${t.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => deleteTransaction(t.id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-slate-100 mb-3">ℹ️ À propos</h3>
        <p className="text-slate-400 text-sm">
          Suivi simple de tes dépenses et gains. Ajoute des transactions, supprime-les, et suis ton budget en temps réel.
        </p>
      </div>
    </div>
  );
}
