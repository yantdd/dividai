import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Mail, Lock, LogIn, Plus, ChevronRight, UserCircle2, Check, X, Trash2 } from 'lucide-react';
import { useExpenses } from '../contexts/ExpenseContext';

export default function Login() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, groups, createGroup, deleteGroup, setSelectedGroup } = useExpenses();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Controle do formulário inline de novo grupo
  const [criandoGrupo, setCriandoGrupo] = useState(false);
  const [nomeNovoGrupo, setNomeNovoGrupo] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

  const handleAbrirCriarGrupo = () => {
    setCriandoGrupo(true);
    setNomeNovoGrupo('');
  };

  const handleConfirmarGrupo = () => {
    const nome = nomeNovoGrupo.trim();
    if (!nome) return;
    createGroup(nome); // Cria o grupo e adiciona o usuário como membro automaticamente
    setCriandoGrupo(false);
    setNomeNovoGrupo('');
  };

  const handleCancelarGrupo = () => {
    setCriandoGrupo(false);
    setNomeNovoGrupo('');
  };

  const handleEntrarGrupo = (group) => {
    // Salva o grupo selecionado no contexto global antes de navegar
    setSelectedGroup(group);
    navigate('/dashboard');
  };

  // Renderiza a parte de seleção de grupos se já estiver logado
  if (isLoggedIn) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <header className="bg-teal-600 text-white p-6 pb-8 rounded-b-3xl shadow-sm shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Meus Grupos</h1>
              <p className="opacity-80 text-sm mt-1">Selecione uma república ou evento</p>
            </div>
            <button
              onClick={() => navigate('/perfil')}
              className="p-2 text-teal-100 hover:text-white transition-colors rounded-full hover:bg-teal-500"
            >
              <UserCircle2 size={28} />
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto w-full max-w-md mx-auto">
          <div className="space-y-4 mb-8">
            {groups.map((group) => (
              <div key={group.id} className="relative group/card">
                <button
                  onClick={() => handleEntrarGrupo(group)}
                  className="w-full text-left flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-teal-300 hover:shadow-md transition-all active:scale-95 pr-14"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                      <Users size={24} />
                    </div>
                    <span className="font-semibold text-gray-800 text-lg">{group.name}</span>
                  </div>
                  <ChevronRight size={20} className="text-gray-300 group-hover:text-teal-500 transition-colors" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Deseja realmente excluir o grupo "${group.name}"?`)) {
                      deleteGroup(group.id);
                    }
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Formulário inline para criar novo grupo */}
          {criandoGrupo ? (
            <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border-2 border-teal-300 shadow-sm">
              <input
                type="text"
                autoFocus
                value={nomeNovoGrupo}
                onChange={(e) => setNomeNovoGrupo(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmarGrupo(); if (e.key === 'Escape') handleCancelarGrupo(); }}
                placeholder="Nome do grupo..."
                className="flex-1 bg-transparent text-gray-800 font-medium placeholder-gray-400 focus:outline-none px-2"
              />
              <button
                onClick={handleConfirmarGrupo}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition-colors shrink-0"
              >
                <Check size={18} />
              </button>
              <button
                onClick={handleCancelarGrupo}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAbrirCriarGrupo}
              className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:text-teal-600 hover:border-teal-400 hover:bg-teal-50 transition-all font-medium active:scale-95"
            >
              <Plus size={20} />
              Criar Novo Grupo
            </button>
          )}
        </div>
      </div>
    );
  }

  // Renderiza o formulário de login se não estiver logado
  return (
    <div className="flex flex-col h-full bg-white p-6 justify-center items-center">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="flex flex-col items-center justify-center mb-6 mt-4">
            <img src="/logo.png" alt="DividAí Logo" className="w-48 h-auto object-contain drop-shadow-md hover:scale-105 transition-transform" />
          </div>
          <p className="text-gray-500 text-center text-sm px-4">
            Acesse sua conta para organizar e dividir as despesas da turma.
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5 w-full">
          <div className="space-y-1 group">
            <label className="block text-sm font-semibold text-gray-700 transition-colors group-focus-within:text-teal-600">
              E-mail
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors">
                <Mail size={20} />
              </span>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-800"
              />
            </div>
          </div>

          <div className="space-y-1 group">
            <label className="block text-sm font-semibold text-gray-700 transition-colors group-focus-within:text-teal-600">
              Senha
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors">
                <Lock size={20} />
              </span>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-800"
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl shadow-md text-white bg-teal-600 hover:bg-teal-700 hover:shadow-lg font-semibold transition-all active:scale-95"
            >
              <LogIn size={20} />
              Entrar
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Não tem uma conta?{' '}
          <button onClick={() => navigate('/cadastro')} className="text-teal-600 font-semibold hover:underline">Cadastre-se</button>
        </p>
      </div>
    </div>
  );
}
