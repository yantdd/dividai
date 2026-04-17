import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock, CheckCircle2, Loader2 } from 'lucide-react';

export default function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erroCampo, setErroCampo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErroCampo('');

    if (senha !== confirmarSenha) {
      setErroCampo('As senhas não coincidem. Tente novamente.');
      return;
    }
    if (senha.length < 6) {
      setErroCampo('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    // Simula uma chamada de API de cadastro
    setTimeout(() => {
      setLoading(false);
      setSucesso(true);

      // Após 1.8s mostrando o sucesso, redireciona para o login
      setTimeout(() => {
        navigate('/');
      }, 1800);
    }, 1500);
  };

  return (
    <div className="flex flex-col flex-1 bg-white">
      <header className="flex items-center p-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center w-full max-w-3xl mx-auto relative">
          <button
            onClick={() => navigate('/')}
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 relative z-10"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="flex-1 text-center font-semibold text-gray-900 absolute inset-0 flex items-center justify-center pointer-events-none">
            Criar Conta
          </h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center">
        {sucesso ? (
          // Estado de sucesso animado
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center animate-bounce">
              <CheckCircle2 size={40} className="text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Conta criada!</h2>
            <p className="text-gray-500 text-sm text-center">
              Redirecionando para o login...
            </p>
          </div>
        ) : (
          <div className="w-full max-w-sm mx-auto">
            <div className="mb-8">
              <p className="text-sm text-gray-500">Preencha os dados abaixo para criar sua conta.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nome */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-1 transition-colors group-focus-within:text-teal-600">
                  Nome completo
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
                    placeholder="João Silva"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-800"
                  />
                </div>
              </div>

              {/* E-mail */}
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
                    placeholder="seu@email.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-800"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-1 transition-colors group-focus-within:text-teal-600">
                  Senha
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors">
                    <Lock size={20} />
                  </span>
                  <input
                    type="password"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-800"
                  />
                </div>
              </div>

              {/* Confirmar Senha */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-1 transition-colors group-focus-within:text-teal-600">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors">
                    <Lock size={20} />
                  </span>
                  <input
                    type="password"
                    required
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Repita a senha"
                    className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all text-gray-800 ${erroCampo
                        ? 'border-red-400 focus:ring-red-300'
                        : 'border-gray-200 focus:ring-teal-500'
                      }`}
                  />
                </div>
              </div>

              {/* Mensagem de erro */}
              {erroCampo && (
                <p className="text-sm text-red-500 font-medium bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                  {erroCampo}
                </p>
              )}

              {/* Botão de cadastro */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl shadow-md text-white bg-teal-600 hover:bg-teal-700 font-semibold transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    'Criar Conta'
                  )}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Já tem uma conta?{' '}
              <button
                onClick={() => navigate('/')}
                className="text-teal-600 font-semibold hover:underline"
              >
                Fazer login
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
