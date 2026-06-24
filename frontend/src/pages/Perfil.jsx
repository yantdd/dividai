import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, UserCircle2, ChevronRight, Camera } from 'lucide-react';
import { useExpenses } from '../contexts/ExpenseContext';

export default function Perfil() {
  const navigate = useNavigate();
  const { logoutUser, user, updateUser } = useExpenses();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-50">
      {/* Cabeçalho */}
      <header className="flex items-center p-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center w-full max-w-3xl mx-auto relative">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 relative z-10"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="flex-1 text-center font-semibold text-gray-900 absolute inset-0 flex items-center justify-center pointer-events-none">
            Meu Perfil
          </h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-8 w-full max-w-3xl mx-auto custom-scroll">
        {/* Seção de Foto e Dados do Usuário */}
        <div className="bg-white rounded-2xl mx-6 mt-6 px-6 pt-8 pb-6 flex flex-col items-center shadow-sm">
          {/* Avatar */}
          <div className="relative w-24 h-24 mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center shadow-lg shadow-teal-200 overflow-hidden relative group">
              {user?.photo ? (
                <img src={user.photo} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserCircle2 size={56} className="text-white opacity-90" />
              )}
            </div>
            {/* Indicador de online */}
            <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />

            {/* Botão de trocar foto */}
            <button
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onload = async (event) => {
                    const base64Photo = event.target.result;
                    try {
                      const token = localStorage.getItem('token');
                      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.id}`, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          ...(token && { Authorization: `Bearer ${token}` })
                        },
                        body: JSON.stringify({ photo: base64Photo }),
                      });

                      const data = await response.json();
                      if (!response.ok) throw new Error(data.error);

                      updateUser({ photo: data.user.photo });
                    } catch (err) {
                      alert('Erro ao atualizar foto: ' + err.message);
                    }
                  };
                  reader.readAsDataURL(file);
                };
                input.click();
              }}
              className="absolute bottom-0 right-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center shadow-md border-2 border-white hover:bg-teal-700 transition-all active:scale-90"
              title="Mudar foto de perfil"
            >
              <Camera size={16} />
            </button>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-0.5">{user?.name}</h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>

        {/* Links de Ações da Conta */}
        <div className="px-6 mt-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Conta</p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <button onClick={() => navigate('/editar-perfil')} className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors rounded-2xl">
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
