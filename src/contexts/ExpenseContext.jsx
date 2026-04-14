import { createContext, useContext, useState } from 'react';

const ExpenseContext = createContext({});

export function ExpenseProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [groups, setGroups] = useState([
    { id: 1, name: 'República Toca do Urso' },
    { id: 2, name: 'Churrasco da Turma' },
  ]);

  const [selectedGroup, setSelectedGroup] = useState(null);

  const [user, setUser] = useState({ id: 1, name: 'João Silva', email: 'joao.silva@email.com' });

  // Membros por grupo — cada membro tem um groupId
  const [allGroupMembers, setAllGroupMembers] = useState([
    { id: 1, groupId: 1, name: 'João (Você)' },
    { id: 2, groupId: 1, name: 'Maria' },
    { id: 3, groupId: 1, name: 'Pedro' },
    { id: 4, groupId: 2, name: 'João (Você)' },
    { id: 5, groupId: 2, name: 'Ana' },
    { id: 6, groupId: 2, name: 'Carlos' },
    { id: 7, groupId: 2, name: 'Lucas' },
  ]);

  // Membros do grupo atual
  const groupMembers = selectedGroup
    ? allGroupMembers.filter(m => m.groupId === selectedGroup.id)
    : [];

  const addMemberToGroup = (email) => {
    if (!selectedGroup) return;

    // Extrai um nome fictício a partir do e-mail (parte antes do @)
    const nomeFicticio = email.split('@')[0]
      .split('.').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

    const newId = allGroupMembers.length
      ? Math.max(...allGroupMembers.map(m => m.id)) + 1
      : 1;

    // Membros atuais do grupo (antes de adicionar o novo)
    const membrosAtuais = allGroupMembers.filter(m => m.groupId === selectedGroup.id);
    const totalMembros = membrosAtuais.length + 1; // inclui o novo

    // Redistribui igualmente os splits de todas as despesas do grupo
    setAllExpenses(prev => prev.map(exp => {
      if (exp.groupId !== selectedGroup.id) return exp;

      const novaPorcao = exp.amount / totalMembros;
      const novoSplit = [
        // Atualiza os membros existentes com o novo valor
        ...membrosAtuais.map(m => ({ memberId: m.id, amount: novaPorcao })),
        // Adiciona o novo membro
        { memberId: newId, amount: novaPorcao },
      ];

      return { ...exp, split: novoSplit };
    }));

    // Insere o novo membro na lista
    setAllGroupMembers(prev => [
      ...prev,
      { id: newId, groupId: selectedGroup.id, name: nomeFicticio }
    ]);
  };

  const removeMemberFromGroup = (memberId) => {
    if (!selectedGroup) return;

    // Opcional: Redistribui as despesas apenas entre os membros remanescentes
    const membrosRestantes = allGroupMembers.filter(
      m => m.groupId === selectedGroup.id && m.id !== memberId
    );

    if (membrosRestantes.length > 0) {
      setAllExpenses(prev => prev.map(exp => {
        if (exp.groupId !== selectedGroup.id) return exp;

        const novaPorcao = exp.amount / membrosRestantes.length;
        const novoSplit = membrosRestantes.map(m => ({
          memberId: m.id, amount: novaPorcao
        }));

        let newPayerId = exp.payerId;
        if (newPayerId === memberId) {
          newPayerId = membrosRestantes[0].id;
        }

        return { ...exp, split: novoSplit, payerId: newPayerId };
      }));
    } else {
      // Deleta as contas se não houver mais ninguém
      setAllExpenses(prev => prev.filter(e => e.groupId !== selectedGroup.id));
    }

    setAllGroupMembers(prev => prev.filter(m => m.id !== memberId));
  };

  const updateUser = (data) => {
    setUser(prev => ({ ...prev, ...data }));
    if (data.name) {
      setAllGroupMembers(prev => prev.map(m => m.name.includes('(Você)') ? { ...m, name: `${data.name} (Você)` } : m));
    }
  };

  // Cria um novo grupo e automaticamente adiciona o usuário atual como membro
  const createGroup = (nome) => {
    const newGroupId = groups.length ? Math.max(...groups.map(g => g.id)) + 1 : 1;
    const newMemberId = allGroupMembers.length ? Math.max(...allGroupMembers.map(m => m.id)) + 1 : 1;
    setGroups(prev => [...prev, { id: newGroupId, name: nome }]);
    setAllGroupMembers(prev => [...prev, { id: newMemberId, groupId: newGroupId, name: 'João (Você)' }]);
  };

  // Remove o grupo e todos os dados associados (membros + despesas)
  const deleteGroup = (groupId) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
    setAllGroupMembers(prev => prev.filter(m => m.groupId !== groupId));
    setAllExpenses(prev => prev.filter(e => e.groupId !== groupId));
    // Se o grupo deletado era o selecionado, limpa a seleção
    if (selectedGroup && selectedGroup.id === groupId) {
      setSelectedGroup(null);
    }
  };

  // Despesas por grupo
  const [allExpenses, setAllExpenses] = useState([
    {
      id: "1",
      groupId: 1,
      title: 'Mercado Mensal',
      amount: 350.0,
      date: '12/04/2026',
      payerId: 2,
      receipt: null,
      split: [
        { memberId: 1, amount: 116.66 },
        { memberId: 2, amount: 116.67 },
        { memberId: 3, amount: 116.67 },
      ]
    },
    {
      id: "2",
      groupId: 1,
      title: 'Conta de Internet',
      amount: 150.0,
      date: '10/04/2026',
      payerId: 1,
      receipt: null,
      split: [
        { memberId: 1, amount: 50.0 },
        { memberId: 2, amount: 50.0 },
        { memberId: 3, amount: 50.0 },
      ]
    },
    {
      id: "3",
      groupId: 2,
      title: 'Carne e Linguiça',
      amount: 280.0,
      date: '11/04/2026',
      payerId: 4,
      receipt: null,
      split: [
        { memberId: 4, amount: 70.0 },
        { memberId: 5, amount: 70.0 },
        { memberId: 6, amount: 70.0 },
        { memberId: 7, amount: 70.0 },
      ]
    },
    {
      id: "4",
      groupId: 2,
      title: 'Carvão e Descartáveis',
      amount: 85.0,
      date: '11/04/2026',
      payerId: 6,
      receipt: null,
      split: [
        { memberId: 4, amount: 21.25 },
        { memberId: 5, amount: 21.25 },
        { memberId: 6, amount: 21.25 },
        { memberId: 7, amount: 21.25 },
      ]
    },
    {
      id: "5",
      groupId: 2,
      title: 'Bebidas e Gelo',
      amount: 120.0,
      date: '11/04/2026',
      payerId: 5,
      receipt: null,
      split: [
        { memberId: 4, amount: 30.0 },
        { memberId: 5, amount: 30.0 },
        { memberId: 6, amount: 30.0 },
        { memberId: 7, amount: 30.0 },
      ]
    },
  ]);

  const expenses = selectedGroup
    ? allExpenses.filter(e => e.groupId === selectedGroup.id)
    : [];

  const addExpense = (newExpense) => {
    if (!selectedGroup) return;

    const membrosAtivos = allGroupMembers.filter(m => m.groupId === selectedGroup.id);
    if (membrosAtivos.length === 0) return;

    const splitAmount = parseFloat(newExpense.amount) / membrosAtivos.length;
    const split = membrosAtivos.map(m => ({
      memberId: m.id,
      amount: splitAmount
    }));

    // Encontra o id do usuário atual neste grupo
    const userNesseGrupo = membrosAtivos.find(m => m.name.includes('Você'));

    const expense = {
      id: Date.now().toString(),
      groupId: selectedGroup.id,
      title: newExpense.title || 'Despesa Indefinida',
      amount: parseFloat(newExpense.amount),
      payerId: newExpense.payerId || (userNesseGrupo ? userNesseGrupo.id : membrosAtivos[0].id),
      date: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date()),
      receipt: null,
      split
    };

    setAllExpenses(prev => [expense, ...prev]);
  };

  const deleteExpense = (id) => {
    setAllExpenses(prev => prev.filter(e => e.id !== id));
  };

  const updateExpense = (id, updatedData) => {
    setAllExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updatedData } : e));
  };

  const getExpenseById = (id) => allExpenses.find(e => e.id === id);

  // Membro local do usuário no grupo atual
  const userNesseGrupo = groupMembers.find(m => m.name.includes('Você'));

  // Quanto o usuário deve: despesas pagas por OUTRO membro, parte do usuário
  const userTotalDebt = !userNesseGrupo ? 0 : expenses.reduce((total, exp) => {
    const usuarioPagou = exp.payerId === userNesseGrupo.id;
    if (usuarioPagou) return total; // Não deve nada nessa conta — foi ele quem pagou
    const userSplit = exp.split.find(s => s.memberId === userNesseGrupo.id);
    return total + (userSplit ? userSplit.amount : 0);
  }, 0);

  // Quanto o usuário recebe: despesas pagas POR ELE, parte dos outros membros
  const userTotalReceive = !userNesseGrupo ? 0 : expenses.reduce((total, exp) => {
    const usuarioPagou = exp.payerId === userNesseGrupo.id;
    if (!usuarioPagou) return total; // Não recebe nada dessa conta
    const othersSplit = exp.split
      .filter(s => s.memberId !== userNesseGrupo.id)
      .reduce((sum, s) => sum + s.amount, 0);
    return total + othersSplit;
  }, 0);

  return (
    <ExpenseContext.Provider value={{
      isLoggedIn,
      setIsLoggedIn,
      groups,
      setGroups,
      createGroup,
      selectedGroup,
      setSelectedGroup,
      user,
      updateUser,
      groupMembers,
      addMemberToGroup,
      removeMemberFromGroup,
      expenses,
      addExpense,
      deleteExpense,
      deleteGroup,
      updateExpense,
      getExpenseById,
      userTotalDebt,
      userTotalReceive
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => useContext(ExpenseContext);
