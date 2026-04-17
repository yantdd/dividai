import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Receipt, ArrowLeft, Trash2, UserCircle2, UserPlus, X } from 'lucide-react';
import { useExpenses } from '../contexts/ExpenseContext';

// Gera uma cor de fundo para o avatar a partir do nome (determinística)
function getAvatarColor(name) {
  const cores = [
    'bg-teal-500', 'bg-amber-500', 'bg-emerald-500',
    'bg-orange-500', 'bg-rose-500', 'bg-yellow-500', 'bg-red-400',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash;
  return cores[hash % cores.length];
}

function getInitials(name) {
  return name
    .replace(' (Você)', '')
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// Modal de Convidar Membro
function ModalConvidar({ onClose, onConfirmar }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    onConfirmar(email);
  };

  return (
    // Fundo escuro semi-transparente
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Painel do modal — centrado em todas as telas para evitar bugs no mobile */}
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Adicionar novo membro</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail do convidado</label>
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="amigo@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              required
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Um convite será enviado por e-mail (simulado).
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors shadow-sm active:scale-95"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    expenses, userTotalDebt, userTotalReceive,
    deleteExpense, groupMembers, selectedGroup, addMemberToGroup, removeMemberFromGroup
  } = useExpenses();

  const [modalAberto, setModalAberto] = useState(false);
  const [membroParaDeletar, setMembroParaDeletar] = useState(null);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const getPayerName = (id) => {
    const member = groupMembers.find(m => m.id === id);
    return member ? member.name.replace(' (Você)', '') : 'Desconhecido';
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    deleteExpense(id);
  };

  const handleConvidar = (email) => {
    addMemberToGroup(email);
    setModalAberto(false);
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-50 pb-24">
      {/* Cabeçalho */}
      <header className="bg-teal-600 text-white p-6 pb-12 rounded-b-3xl shrink-0">
        <div className="flex items-center gap-3 max-w-6xl mx-auto w-full">
          <button onClick={() => navigate('/')} className="p-2 -ml-2 text-teal-100 hover:text-white transition-colors rounded-full hover:bg-teal-500">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{selectedGroup ? selectedGroup.name : 'Meu Grupo'}</h1>
            <p className="opacity-80 text-sm mt-1">Resumo Financeiro</p>
          </div>
          <button onClick={() => navigate('/perfil')} className="p-2 text-teal-100 hover:text-white transition-colors rounded-full hover:bg-teal-500">
            <UserCircle2 size={28} />
          </button>
        </div>
      </header>

      {/* Cards financeiros */}
      <div className="px-6 -mt-6 relative z-10 shrink-0 grid grid-cols-2 gap-4 max-w-6xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-sm p-4 outline outline-1 outline-gray-100 border-l-4 border-l-red-500">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Você deve</p>
          <p className="text-xl font-bold text-red-600 mt-1">{formatCurrency(userTotalDebt)}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 outline outline-1 outline-gray-100 border-l-4 border-l-emerald-500">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Você recebe</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(userTotalReceive)}</p>
        </div>
      </div>

      {/* Seção de membros */}
      <div className="px-6 mt-5 shrink-0 max-w-6xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Membros · {groupMembers.length}
            </p>
            <button
              onClick={() => setModalAberto(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-full transition-colors"
            >
              <UserPlus size={14} />
              Adicionar
            </button>
          </div>

          {groupMembers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-2">
              Nenhum membro ainda. Convide alguém!
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {groupMembers.map(member => {
                const isCurrentUser = member.name.includes('(Você)');
                return (
                  <div key={member.id} className="relative flex flex-col items-center gap-1 group/member">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm ${getAvatarColor(member.name)} relative`}>
                      {getInitials(member.name)}
                      {!isCurrentUser && (
                        <button
                          onClick={() => setMembroParaDeletar(member)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover/member:opacity-100 transition-opacity hover:bg-red-600 outline-none"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 max-w-[52px] truncate text-center">
                      {isCurrentUser ? member.name.replace(' (Você)', ' ★') : member.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Lista de despesas */}
      <div className="flex-1 p-6 mt-2 overflow-y-auto max-w-6xl mx-auto w-full w-full custom-scroll">
        <h2 className="font-semibold text-gray-800 mb-4">Despesas Recentes</h2>

        {expenses.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            <Receipt size={48} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">Nenhuma despesa registrada.</p>
            <p className="text-sm mt-1">Use o botão + para adicionar.</p>
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {expenses.map(expense => (
              <div
                key={expense.id}
                onClick={() => navigate(`/despesa/${expense.id}`)}
                className="group flex flex-row items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-teal-300 transition-all hover:shadow-md cursor-pointer active:scale-[0.98]"
              >
                <div className="w-12 h-12 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center mr-4 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                  <Receipt size={24} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-semibold text-gray-900 truncate">{expense.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Pago por <span className="font-medium text-gray-700">{getPayerName(expense.payerId)}</span> · {expense.date}
                  </p>
                </div>
                <div className="text-right ml-2 shrink-0">
                  <p className="font-bold text-gray-900">{formatCurrency(expense.amount)}</p>
                </div>
                <button
                  onClick={(e) => handleDelete(e, expense.id)}
                  className="ml-3 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Link
        to="/nova-despesa"
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-12 xl:right-32 w-14 h-14 bg-teal-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-teal-700 hover:shadow-xl transition-all hover:-translate-y-1 active:scale-90 z-20"
      >
        <Plus size={24} />
      </Link>

      {/* Modal de convidar membro */}
      {modalAberto && (
        <ModalConvidar
          onClose={() => setModalAberto(false)}
          onConfirmar={handleConvidar}
        />
      )}

      {/* Modal de remover membro */}
      {membroParaDeletar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Remover Membro</h3>
            <p className="text-gray-600 mb-6 font-medium text-sm">
              Deseja realmente remover <span className="font-bold text-gray-900">"{membroParaDeletar.name}"</span> do grupo?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setMembroParaDeletar(null)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  removeMemberFromGroup(membroParaDeletar.id);
                  setMembroParaDeletar(null);
                }}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors active:scale-95"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
