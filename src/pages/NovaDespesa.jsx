import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Loader2, CheckCircle2, DollarSign } from 'lucide-react';
import { useExpenses } from '../contexts/ExpenseContext';

export default function NovaDespesa() {
  const navigate = useNavigate();
  const { addExpense, groupMembers } = useExpenses();
  
  const [loading, setLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedSuccess, setAnalyzedSuccess] = useState(false);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  // Inicializa com o primeiro membro real do grupo (pode ser id 4, 5... dependendo do grupo)
  const [payerId, setPayerId] = useState(() => groupMembers[0]?.id ?? '');

  const fileInputRef = useRef(null);

  const handleSimulateUpload = (e) => {
    e.preventDefault(); // Impede evento acidental se englobado de outra forma
    if (isAnalyzing || analyzedSuccess) return;

    setIsAnalyzing(true);
    setAnalyzedSuccess(false);

    // EFEITO UAU: Simulando a leitura por Inteligência Artificial
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzedSuccess(true);
      
      // Gera um valor aleatório entre 50 e 400
      const randomValue = (Math.random() * 350 + 50).toFixed(2);
      setAmount(randomValue);

      // (Reversão para que possa "re-upar" a nota se quiser após a demonstração)
      setTimeout(() => setAnalyzedSuccess(false), 4000);
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;
    
    setLoading(true);
    
    // Pequeno delay para passar textura visual de salvar
    setTimeout(() => {
      addExpense({ 
        title: title || 'Despesa Indefinida', 
        amount, 
        payerId 
      });
      navigate('/dashboard');
    }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <header className="flex items-center p-4 border-b border-gray-100 shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100">
          <ArrowLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-semibold text-gray-900 pr-8">Nova Despesa</h1>
      </header>

      <form className="p-6 flex-1 flex flex-col overflow-y-auto" onSubmit={handleSubmit}>
        <div className="space-y-6 flex-1">
          
          {/* Zona de Upload / IA */}
          <div className="group mt-2">
            <h2 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Comprovante</h2>
            <button 
              type="button" 
              onClick={handleSimulateUpload}
              className={`w-full h-36 border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center transition-all ${
                isAnalyzing 
                  ? 'border-teal-400 bg-teal-50 text-teal-600' 
                  : analyzedSuccess
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-600'
                    : 'border-gray-300 bg-gray-50 text-gray-400 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 focus:ring-2 focus:ring-teal-500'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={36} className="mb-3 animate-spin" />
                  <span className="text-sm font-medium animate-pulse">Lendo nota com IA...</span>
                </>
              ) : analyzedSuccess ? (
                <>
                  <CheckCircle2 size={36} className="mb-3" />
                  <span className="text-sm font-medium">Nota lida! Valor extraído.</span>
                </>
              ) : (
                <>
                  <Camera size={36} className="mb-3" />
                  <span className="text-sm font-medium">Toque para scanear a nota</span>
                  <span className="text-xs mt-1 text-gray-500 tracking-tight">(Simula Inteligência Artificial)</span>
                </>
              )}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
            />
          </div>

          <div className="pt-2 border-t border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Detalhes</h2>
            
            {/* Título */}
            <div className="group mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Título da Despesa</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Combustível viagem, Pizzaria..." 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium text-gray-800"
                required
              />
            </div>
            
            {/* Pagador */}
            <div className="group mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Quem pagou?</label>
              <select 
                value={payerId}
                onChange={(e) => setPayerId(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium text-gray-800 appearance-none"
              >
                {groupMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Valor */}
            <div className="group mb-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Valor Total</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <DollarSign size={20} />
                </span>
                <input 
                  type="number" 
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00" 
                  className={`w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-bold text-gray-800 text-lg ${
                    analyzedSuccess ? 'bg-emerald-50 ring-2 ring-emerald-300 ring-offset-1' : 'bg-gray-50 focus:bg-white'
                  }`}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 shrink-0 pb-4">
          <button 
            type="submit" 
            disabled={loading || isAnalyzing}
            className="w-full flex justify-center items-center py-4 px-4 rounded-xl shadow-md text-white bg-teal-600 hover:bg-teal-700 font-semibold transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={22} className="animate-spin" /> : 'Salvar no Grupo'}
          </button>
        </div>
      </form>
    </div>
  );
}
