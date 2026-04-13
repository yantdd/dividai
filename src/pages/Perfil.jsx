import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, LogOut, UserCircle2, ChevronRight, Camera } from 'lucide-react';
import { useExpenses } from '../contexts/ExpenseContext';

// Componente reutilizável de switch visual
function Toggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-all duration-300 focus:outline-none ${
        enabled ? 'bg-violet-500' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function Perfil() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useExpenses();

  // Configuração visual (apenas estado local, sem lógica real)
  const [modoEscuro, setModoEscuro] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);  // Reseta o estado de autenticação global
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Cabeçalho */}
      <header className="flex items-center p-4 bg-white border-b border-gray-100 shrink-0">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-semibold text-gray-900 pr-8">Meu Perfil</h1>
      </header>

      <div className="flex-1 overflow-y-auto pb-8">
        {/* Seção de Foto e Dados do Usuário */}
        <div className="bg-white px-6 pt-8 pb-6 flex flex-col items-center border-b border-gray-100">
          {/* Avatar Placeholder */}
          <div className="relative w-24 h-24 mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-400 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-200 overflow-hidden relative group">
              <UserCircle2 size={56} className="text-white opacity-90" />
            </div>
            {/* Indicador de online */}
            <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
            
            {/* Botão de trocar foto */}
            <button
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = () => {
                  alert('Funcionalidade de upload de foto simulada com sucesso!');
                };
                input.click();
              }}
              className="absolute bottom-0 right-0 w-8 h-8 bg-violet-600 text-white rounded-full flex items-center justify-center shadow-md border-2 border-white hover:bg-violet-700 transition-all active:scale-90"
              title="Mudar foto de perfil"
            >
              <Camera size={16} />
            </button>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-0.5">João Silva</h2>
          <p className="text-gray-500 text-sm">joao.silva@email.com</p>


        </div>

        {/* Seção de Configurações */}
        <div className="px-6 mt-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Configurações</p>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            {/* Modo Escuro */}
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center">
                  <Moon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Modo Escuro</p>
                  <p className="text-xs text-gray-400">Altera o tema do aplicativo</p>
                </div>
              </div>
              <Toggle
                enabled={modoEscuro}
                onToggle={() => setModoEscuro(!modoEscuro)}
              />
            </div>
          </div>
        </div>

        {/* Links de Ações da Conta */}
        <div className="px-6 mt-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Conta</p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors rounded-2xl">
              <span className="text-sm font-semibold text-gray-800">Editar Perfil</span>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          </div>
        </div>

        {/* Botão de Logout */}
        <div className="px-6 mt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-50 border-2 border-red-200 text-red-600 font-bold hover:bg-red-100 hover:border-red-300 transition-all active:scale-[0.98]"
          >
            <LogOut size={20} />
            Sair da Conta
          </button>
        </div>
      </div>
    </div>
  );
}
