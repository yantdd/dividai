import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Loader2, DollarSign, Upload, X } from 'lucide-react';
import { useExpenses } from '../contexts/ExpenseContext';

export default function NovaDespesa() {
  const navigate = useNavigate();
  const { addExpense, groupMembers, selectedGroup } = useExpenses();

  useEffect(() => {
    if (!selectedGroup) navigate('/', { replace: true });
  }, [selectedGroup]);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState(() => groupMembers[0]?.id ?? '');

  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileSelected = (file) => {
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Formato não suportado. Use JPG, PNG ou WebP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Imagem muito grande. Máximo 5MB.');
      return;
    }
    setReceiptFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setReceiptPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelected(file);
  };

  const handleRemoveReceipt = (e) => {
    e.stopPropagation();
    setReceiptFile(null);
    setReceiptPreview(null);
    fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount) return;

    setLoading(true);

    await addExpense({
      title: title || 'Despesa Indefinida',
      amount,
      payerId,
      receiptFile
    });
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col flex-1 bg-white relative">
      <header className="flex items-center p-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center w-full max-w-3xl mx-auto relative">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 relative z-10">
            <ArrowLeft size={24} />
          </button>
          <h1 className="flex-1 text-center font-semibold text-gray-900 absolute inset-0 flex items-center justify-center pointer-events-none">
            Nova Despesa
          </h1>
        </div>
      </header>

      <form className="p-6 flex-1 flex flex-col overflow-y-auto w-full max-w-3xl mx-auto custom-scroll" onSubmit={handleSubmit}>
        <div className="space-y-6 flex-1">

          {/* Zona de Upload com Drag & Drop */}
          <div className="mt-2">
            <h2 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Comprovante</h2>
            <div
              onClick={() => !receiptPreview && fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden ${
                receiptPreview
                  ? 'border-emerald-400 bg-emerald-50 p-0'
                  : isDragging
                    ? 'border-teal-500 bg-teal-50 text-teal-600 h-36'
                    : 'border-gray-300 bg-gray-50 text-gray-400 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 h-36'
              } ${!receiptPreview ? 'flex flex-col items-center justify-center p-4' : 'relative'}`}
            >
              {receiptPreview ? (
                <div className="relative">
                  <img
                    src={receiptPreview}
                    alt="Preview do comprovante"
                    className="w-full max-h-64 object-contain"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveReceipt}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X size={16} strokeWidth={3} />
                  </button>
                </div>
              ) : isDragging ? (
                <>
                  <Upload size={36} className="mb-3 animate-bounce" />
                  <span className="text-sm font-medium">Solte a imagem aqui</span>
                </>
              ) : (
                <>
                  <Camera size={36} className="mb-3" />
                  <span className="text-sm font-medium">Arraste uma imagem ou toque para selecionar</span>
                  <span className="text-xs mt-1 text-gray-400">JPG, PNG ou WebP (máx. 5MB)</span>
                </>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFileSelected(e.target.files[0])}
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
                  className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-bold text-gray-800 text-lg bg-gray-50 focus:bg-white"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 shrink-0 pb-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-4 px-4 rounded-xl shadow-md text-white bg-teal-600 hover:bg-teal-700 font-semibold transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={22} className="animate-spin" /> : 'Salvar no Grupo'}
          </button>
        </div>
      </form>
    </div>
  );
}
