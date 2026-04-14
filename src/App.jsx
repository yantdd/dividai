import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ExpenseProvider } from './contexts/ExpenseContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DespesaDetalhes from './pages/DespesaDetalhes';
import NovaDespesa from './pages/NovaDespesa';
import Perfil from './pages/Perfil';
import EditarPerfil from './pages/EditarPerfil';
import Cadastro from './pages/Cadastro';

function App() {
  return (
    <ExpenseProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Login />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="despesa/:id" element={<DespesaDetalhes />} />
            <Route path="nova-despesa" element={<NovaDespesa />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="editar-perfil" element={<EditarPerfil />} />
            <Route path="cadastro" element={<Cadastro />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ExpenseProvider>
  );
}

export default App;
