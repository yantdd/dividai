import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft, Edit2, CheckCircle2, Image as ImageIcon, Crown } from 'lucide-react';
import { useExpenses } from '../contexts/ExpenseContext';

export default function DespesaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getExpenseById, groupMembers, user, updateExpense } = useExpenses();

  const expense = getExpenseById(id);

  const [isEditing, setIsEditing] = useState(false);
  const [editedSplit, setEditedSplit] = useState([]);
  const [editedPayerId, setEditedPayerId] = useState(null);

  useEffect(() => {
    if (expense) {
      setEditedSplit(expense.split);
      setEditedPayerId(expense.payerId);
    }
  }, [expense]);

  if (!expense) {
    return <Navigate to="/dashboard" replace />;
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const getMemberName = (mId) => {
    const member = groupMembers.find(m => m.id === mId);
    return member ? member.name : 'Desconhecido';
  };

  // Pagador em vigor (ao editar usa o estado local; ao visualizar usa o salvo)
  const currentPayerId = isEditing ? editedPayerId : expense.payerId;

  const handleEditToggle = () => {
    if (isEditing) {
      updateExpense(expense.id, { split: editedSplit, payerId: editedPayerId });
      setIsEditing(false);
    } else {
      // Reseta o estado de edição para os valores atuais
      setEditedSplit(expense.split);
      setEditedPayerId(expense.payerId);
      setIsEditing(true);
    }
  };

  const handleCancelar = () => {
    setEditedSplit(expense.split);
    setEditedPayerId(expense.payerId);
    setIsEditing(false);
  };

  const handleSplitChange = (memberId, value) => {
    setEditedSplit(prev =>
      prev.map(s => s.memberId === memberId ? { ...s, amount: parseFloat(value) || 0 } : s)
    );
  };

  const handlePayerChange = (newPayerId) => {
    setEditedPayerId(newPayerId);
  };

  return (
    <div className="flex flex-col flex-1 bg-white relative">
      <header className="flex items-center p-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center w-full max-w-3xl mx-auto relative">
          <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 relative z-10">
            <ArrowLeft size={24} />
          </button>
          <h1 className="flex-1 text-center font-semibold text-gray-900 absolute inset-0 flex items-center justify-center pointer-events-none">
            Detalhes da Despesa
          </h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-6 w-full max-w-3xl mx-auto custom-scroll flex-col">
        {/* Placeholder da Foto da Nota Fiscal */}
        <div className="w-full h-48 sm:h-64 sm:rounded-2xl sm:mt-6 bg-gray-100 flex flex-col items-center justify-center text-gray-400 group relative">
          <ImageIcon size={40} className="mb-2 opacity-50" />
          <span className="text-sm font-medium">Nota Fiscal (Upload)</span>
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-600 shadow-sm">Ver em Tela Cheia</span>
          </div>
        </div>

        <div className="p-6">
          {/* Resumo da despesa */}
          <div className="mb-8">
            <p className="text-gray-500 text-sm font-medium mb-1">
              {expense.date} · Pago por <span className="font-semibold text-gray-700">{getMemberName(currentPayerId)}</span>
            </p>
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{expense.title}</h2>
            <p className="text-4xl font-black text-teal-600 mt-2 tracking-tight">{formatCurrency(expense.amount)}</p>
          </div>

          <section>
            {/* Cabeçalho da seção com botões */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Divisão da Conta</h3>
              <div className="flex gap-2">
                {isEditing && (
                  <button
                    onClick={handleCancelar}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  onClick={handleEditToggle}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isEditing
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                  }`}
                >
                  {isEditing ? <CheckCircle2 size={16} /> : <Edit2 size={14} />}
                  {isEditing ? 'Salvar' : 'Editar Divisão'}
                </button>
              </div>
            </div>

            {/* Seletor de pagador — só aparece no modo de edição */}
            {isEditing && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Crown size={14} />
                  Quem pagou a conta?
                </p>
                <div className="flex flex-wrap gap-2">
                  {groupMembers.map(member => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => handlePayerChange(member.id)}
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                        editedPayerId === member.id
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-amber-400 hover:text-amber-700'
                      }`}
                    >
                      {member.name.replace(' (Você)', ' ★')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de membros e seus valores */}
            <ul className="space-y-3 bg-gray-50/50 rounded-2xl border border-gray-100 p-4 shadow-inner">
              {groupMembers.map((member) => {
                const isPayer = member.id === currentPayerId;
                const splitItem = editedSplit.find(s => s.memberId === member.id);
                const currentAmount = splitItem ? splitItem.amount : 0;

                const memberLabel = isPayer
                  ? `${getMemberName(member.id)} (Pagou ${formatCurrency(expense.amount)})`
                  : getMemberName(member.id);

                return (
                  <li key={member.id} className={`flex items-center justify-between p-2 rounded-xl transition-colors ${isPayer ? 'bg-amber-50' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${isPayer ? 'bg-amber-400 text-white' : currentAmount > 0 ? 'bg-teal-500 text-white' : 'bg-gray-200'}`}>
                        {isPayer ? <Crown size={12} /> : currentAmount > 0 ? <CheckCircle2 size={12} /> : null}
                      </div>
                      <span className={`font-medium text-sm ${isPayer ? 'text-amber-700' : 'text-gray-700'}`}>
                        {memberLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 ml-2 shrink-0">
                      {!isPayer && (
                        <span className="text-xs text-gray-400">Deve</span>
                      )}
                      {isEditing && !isPayer ? (
                        <input
                          type="number"
                          step="0.01"
                          value={currentAmount === 0 ? '' : currentAmount}
                          onChange={(e) => handleSplitChange(member.id, e.target.value)}
                          placeholder="0,00"
                          className="w-20 text-right font-bold text-gray-900 border border-teal-300 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      ) : (
                        <span className={`font-bold text-sm ${isPayer ? 'text-amber-600' : 'text-gray-900'}`}>
                          {isPayer ? `+${formatCurrency(expense.amount)}` : formatCurrency(currentAmount)}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
