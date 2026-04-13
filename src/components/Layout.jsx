import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start sm:items-center">
      {/* 
        Container principal para simular tela de celular em telas maiores.
      */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[850px] bg-white sm:border sm:border-gray-200 sm:rounded-3xl sm:shadow-2xl overflow-hidden relative flex flex-col">
        {/* Conteúdo dinâmico das rotas */}
        <main className="flex-1 overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
