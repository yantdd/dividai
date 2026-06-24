import { createContext, useContext, useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL;

const ExpenseContext = createContext({});

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
}

export function ExpenseProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const loginUser = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    setGroups([]);
    setSelectedGroup(null);
    setAllGroupMembers([]);
    setAllExpenses([]);
  };

  useEffect(() => {
    if (user) {
      fetch(`${API}/api/groups/user/${user.id}`, { headers: authHeaders() })
        .then(res => res.json())
        .then(data => setGroups(data))
        .catch(err => console.error("Erro ao buscar grupos:", err));
    } else {
      setGroups([]);
    }
  }, [user]);

  const [allGroupMembers, setAllGroupMembers] = useState([]);

  useEffect(() => {
    if (selectedGroup) {
      fetch(`${API}/api/groups/${selectedGroup.id}/members`, { headers: authHeaders() })
        .then(res => res.json())
        .then(data => {
          setAllGroupMembers(prev => {
            const others = prev.filter(m => m.groupId !== selectedGroup.id);
            return [...others, ...data];
          });
        })
        .catch(err => console.error("Erro ao buscar membros:", err));
    }
  }, [selectedGroup]);

  const groupMembers = selectedGroup
    ? allGroupMembers.filter(m => m.groupId === selectedGroup.id)
    : [];

  useEffect(() => {
    if (selectedGroup) {
      fetch(`${API}/api/expenses/group/${selectedGroup.id}`, { headers: authHeaders() })
        .then(res => res.json())
        .then(data => {
          const formatted = data.map(exp => ({
            id: exp.id.toString(),
            groupId: exp.groupId,
            title: exp.title,
            amount: exp.amount,
            payerId: exp.payerId,
            date: exp.date,
            receipt: exp.receipt || null,
            split: exp.ExpenseSplits.map(s => ({
              memberId: s.memberId,
              amount: s.amount
            }))
          }));
          setAllExpenses(prev => {
            const others = prev.filter(e => e.groupId !== selectedGroup.id);
            return [...others, ...formatted];
          });
        })
        .catch(err => console.error("Erro ao buscar despesas:", err));
    }
  }, [selectedGroup]);

  const addMemberToGroup = async (email) => {
    if (!selectedGroup) return;

    try {
      const res = await fetch(`${API}/api/groups/${selectedGroup.id}/members`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao adicionar membro");
      const novoMembro = data;

      const membrosAtuais = allGroupMembers.filter(m => m.groupId === selectedGroup.id);
      const todosMembros = [...membrosAtuais, novoMembro];

      await fetch(`${API}/api/expenses/group/${selectedGroup.id}/recalculate`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ members: todosMembros })
      });

      const expRes = await fetch(`${API}/api/expenses/group/${selectedGroup.id}`, { headers: authHeaders() });
      const expData = await expRes.json();
      const formatted = expData.map(exp => ({
        id: exp.id.toString(),
        groupId: exp.groupId,
        title: exp.title,
        amount: exp.amount,
        payerId: exp.payerId,
        date: exp.date,
        receipt: exp.receipt || null,
        split: exp.ExpenseSplits.map(s => ({ memberId: s.memberId, amount: s.amount }))
      }));
      setAllExpenses(prev => {
        const others = prev.filter(e => e.groupId !== selectedGroup.id);
        return [...others, ...formatted];
      });

      setAllGroupMembers(prev => [...prev, novoMembro]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const removeMemberFromGroup = async (memberId) => {
    if (!selectedGroup) return;

    try {
      const membrosRestantes = allGroupMembers.filter(
        m => m.groupId === selectedGroup.id && m.id !== memberId
      );

      if (membrosRestantes.length > 0) {
        await fetch(`${API}/api/expenses/group/${selectedGroup.id}/recalculate`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify({ members: membrosRestantes })
        });
      }

      const res = await fetch(`${API}/api/groups/members/${memberId}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      if (!res.ok) throw new Error("Erro ao remover membro");

      if (membrosRestantes.length > 0) {
        const expRes = await fetch(`${API}/api/expenses/group/${selectedGroup.id}`, { headers: authHeaders() });
        const expData = await expRes.json();
        const formatted = expData.map(exp => ({
          id: exp.id.toString(),
          groupId: exp.groupId,
          title: exp.title,
          amount: exp.amount,
          payerId: exp.payerId,
          date: exp.date,
          receipt: null,
          split: exp.ExpenseSplits.map(s => ({ memberId: s.memberId, amount: s.amount }))
        }));
        setAllExpenses(prev => {
          const others = prev.filter(e => e.groupId !== selectedGroup.id);
          return [...others, ...formatted];
        });
      } else {
        setAllExpenses(prev => prev.filter(e => e.groupId !== selectedGroup.id));
      }

      setAllGroupMembers(prev => prev.filter(m => m.id !== memberId));
    } catch (err) {
      console.error(err);
    }
  };

  const updateUser = (data) => {
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    if (data.name) {
      setAllGroupMembers(prev => prev.map(m => m.name.includes('(Você)') ? { ...m, name: `${data.name} (Você)` } : m));
    }
  };

  const createGroup = async (nome) => {
    if (!user) return;
    try {
      const response = await fetch(`${API}/api/groups`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name: nome, ownerId: user.id })
      });
      if (!response.ok) throw new Error("Falha ao criar grupo");
      const newGroup = await response.json();

      setGroups(prev => [...prev, newGroup]);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      const response = await fetch(`${API}/api/groups/${groupId}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Falha ao deletar grupo");

      setGroups(prev => prev.filter(g => g.id !== groupId));
      setAllGroupMembers(prev => prev.filter(m => m.groupId !== groupId));
      setAllExpenses(prev => prev.filter(e => e.groupId !== groupId));
      if (selectedGroup && selectedGroup.id === groupId) {
        setSelectedGroup(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const leaveGroup = async (groupId) => {
    try {
      const response = await fetch(`${API}/api/groups/${groupId}/leave`, {
        method: 'POST',
        headers: authHeaders()
      });
      if (!response.ok) throw new Error("Falha ao sair do grupo");

      setGroups(prev => prev.filter(g => g.id !== groupId));
      setAllGroupMembers(prev => prev.filter(m => m.groupId !== groupId));
      setAllExpenses(prev => prev.filter(e => e.groupId !== groupId));
      if (selectedGroup && selectedGroup.id === groupId) {
        setSelectedGroup(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [allExpenses, setAllExpenses] = useState([]);

  const expenses = selectedGroup
    ? allExpenses.filter(e => e.groupId === selectedGroup.id)
    : [];

  const addExpense = async (newExpense) => {
    if (!selectedGroup) return;

    const membrosAtivos = allGroupMembers.filter(m => m.groupId === selectedGroup.id);
    if (membrosAtivos.length === 0) return;

    const splitAmount = parseFloat(newExpense.amount) / membrosAtivos.length;
    const split = membrosAtivos.map(m => ({
      memberId: m.id,
      amount: splitAmount
    }));

    const userNesseGrupo = membrosAtivos.find(m => m.name.includes('Você'));

    const formData = new FormData();
    formData.append('groupId', selectedGroup.id);
    formData.append('title', newExpense.title || 'Despesa Indefinida');
    formData.append('amount', parseFloat(newExpense.amount));
    formData.append('payerId', newExpense.payerId || (userNesseGrupo ? userNesseGrupo.id : membrosAtivos[0].id));
    formData.append('date', new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date()));
    formData.append('split', JSON.stringify(split));
    if (newExpense.receiptFile) {
      formData.append('receipt', newExpense.receiptFile);
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/expenses`, {
        method: 'POST',
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        body: formData
      });
      if (!res.ok) throw new Error("Erro ao criar despesa");
      const saved = await res.json();

      const expense = {
        id: saved.id.toString(),
        groupId: saved.groupId,
        title: saved.title,
        amount: saved.amount,
        payerId: saved.payerId,
        date: saved.date,
        receipt: saved.receipt || null,
        split: saved.ExpenseSplits.map(s => ({ memberId: s.memberId, amount: s.amount }))
      };

      setAllExpenses(prev => [expense, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const res = await fetch(`${API}/api/expenses/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      if (!res.ok) throw new Error("Erro ao deletar despesa");
      setAllExpenses(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const updateExpense = async (id, updatedData) => {
    try {
      const res = await fetch(`${API}/api/expenses/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(updatedData)
      });
      if (!res.ok) throw new Error("Erro ao atualizar despesa");
      const saved = await res.json();

      const updated = {
        id: saved.id.toString(),
        groupId: saved.groupId,
        title: saved.title,
        amount: saved.amount,
        payerId: saved.payerId,
        date: saved.date,
        receipt: saved.receipt || null,
        split: saved.ExpenseSplits.map(s => ({ memberId: s.memberId, amount: s.amount }))
      };

      setAllExpenses(prev => prev.map(e => e.id === id ? updated : e));
    } catch (err) {
      console.error(err);
    }
  };

  const settleDebt = async (creditorMemberId, amount) => {
    if (!selectedGroup || !userNesseGrupo) return;

    const split = [{ memberId: creditorMemberId, amount }];

    const formData = new FormData();
    formData.append('groupId', selectedGroup.id);
    formData.append('title', 'Pagamento de dívida');
    formData.append('amount', amount);
    formData.append('payerId', userNesseGrupo.id);
    formData.append('date', new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date()));
    formData.append('split', JSON.stringify(split));

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/expenses`, {
        method: 'POST',
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        body: formData
      });
      if (!res.ok) throw new Error("Erro ao registrar pagamento");
      const saved = await res.json();

      const expense = {
        id: saved.id.toString(),
        groupId: saved.groupId,
        title: saved.title,
        amount: saved.amount,
        payerId: saved.payerId,
        date: saved.date,
        receipt: saved.receipt || null,
        split: saved.ExpenseSplits.map(s => ({ memberId: s.memberId, amount: s.amount }))
      };

      setAllExpenses(prev => [expense, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const getExpenseById = (id) => allExpenses.find(e => e.id === id);

  const userNesseGrupo = groupMembers.find(m => m.name.includes('Você'));

  const getBalances = () => {
    if (!userNesseGrupo) return {};

    const balances = {};
    groupMembers.forEach(m => {
      if (m.id !== userNesseGrupo.id) {
        balances[m.id] = 0;
      }
    });

    expenses.forEach(exp => {
      if (exp.payerId === userNesseGrupo.id) {
        exp.split.forEach(s => {
          if (s.memberId !== userNesseGrupo.id && balances[s.memberId] !== undefined) {
            balances[s.memberId] += s.amount;
          }
        });
      } else {
        const userSplit = exp.split.find(s => s.memberId === userNesseGrupo.id);
        if (userSplit && balances[exp.payerId] !== undefined) {
          balances[exp.payerId] -= userSplit.amount;
        }
      }
    });

    return balances;
  };

  const userBalances = getBalances();

  let userTotalDebt = 0;
  let userTotalReceive = 0;

  if (userNesseGrupo) {
    Object.values(userBalances).forEach(balance => {
      if (balance > 0) userTotalReceive += balance;
      else if (balance < 0) userTotalDebt += Math.abs(balance);
    });
  }

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
      setUser,
      updateUser,
      loginUser,
      logoutUser,
      groupMembers,
      addMemberToGroup,
      removeMemberFromGroup,
      expenses,
      addExpense,
      deleteExpense,
      deleteGroup,
      leaveGroup,
      updateExpense,
      getExpenseById,
      settleDebt,
      userTotalDebt,
      userTotalReceive,
      userBalances
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => useContext(ExpenseContext);
