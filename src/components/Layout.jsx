import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-hidden relative flex flex-col">
      {/* 
        Container agora expande pela tela inteira 
      */}
      <main className="flex-1 overflow-y-auto w-full flex flex-col relative">
        <Outlet />
      </main>
    </div>
  );
}
