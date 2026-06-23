import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock, CheckCircle2, Loader2, Save } from 'lucide-react';
import { useExpenses } from '../contexts/ExpenseContext';

export default function EditarPerfil() {
  const navigate = useNavigate();
  const { user, updateUser } = useExpenses();

  const [nome, setNome] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erroCampo, setErroCampo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErroCampo('');

    if (senha !== confirmarSenha) {
      setErroCampo('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      updateUser({ name: nome, email });
      setSucesso(true);

      setTimeout(() => {
        navigate(-1);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="flex flex-col flex-1 bg-white">
      <header className="flex items-center p-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center w-full max-w-3xl mx-auto relative">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 relative z-10"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="flex-1 text-center font-semibold text-gray-900 absolute inset-0 flex items-center justify-center pointer-events-none">
            Editar Perfil
          </h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        {sucesso ? (
          <div className="flex flex-col items-center justify-center h-full py-16 gap-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center animate-bounce">
              <CheckCircle2 size={40} className="text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Perfil Atualizado!</h2>
            <p className="text-gray-500 text-sm text-center">Voltando...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 max-w-sm mx-auto mt-4 pb-8">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-1 transition-colors group-focus-within:text-teal-600">
                Nome de exibição
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors">
                  <User size={20} />
                </span>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-800"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-1 transition-colors group-focus-within:text-teal-600">
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
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-800"
                />
              </div>
            </div>

            <div className="group pt-4 border-t border-gray-100 mt-6 mb-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1 transition-colors group-focus-within:text-teal-600">
                Nova senha (Opcional)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors">
                  <Lock size={20} />
                </span>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Deixe em branco para manter"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-800"
                />
              </div>
            </div>

            {senha.length > 0 && (
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-1 transition-colors group-focus-within:text-teal-600">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors">
                    <Lock size={20} />
                  </span>
                  <input
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Repita a nova senha"
                    className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all text-gray-800 ${erroCampo ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-teal-500'}`}
                  />
                </div>
              </div>
            )}

            {erroCampo && (
              <p className="text-sm text-red-500 font-medium bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                {erroCampo}
              </p>
            )}

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl shadow-md text-white bg-teal-600 hover:bg-teal-700 font-semibold transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <><Save size={20} /> Salvar Alterações</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
