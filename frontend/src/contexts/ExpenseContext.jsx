import { createContext, useContext, useState, useEffect } from 'react';

const ExpenseContext = createContext({});

export function ExpenseProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [groups, setGroups] = useState([]);

  const [selectedGroup, setSelectedGroup] = useState(null);

  const [user, setUser] = useState(null);

  // Busca grupos quando o usuário loga
  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3000/api/groups/user/${user.id}`)
        .then(res => res.json())
        .then(data => setGroups(data))
        .catch(err => console.error("Erro ao buscar grupos:", err));
    } else {
      setGroups([]);
    }
  }, [user]);

  // Membros por grupo — cada membro tem um groupId
  const [allGroupMembers, setAllGroupMembers] = useState([]);

  // Busca membros quando seleciona um grupo
  useEffect(() => {
    if (selectedGroup) {
      fetch(`http://localhost:3000/api/groups/${selectedGroup.id}/members`)
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


  // Membros do grupo atual
  const groupMembers = selectedGroup
    ? allGroupMembers.filter(m => m.groupId === selectedGroup.id)
    : [];

  const addMemberToGroup = async (email) => {
    if (!selectedGroup) return;

    // Extrai um nome fictício a partir do e-mail (parte antes do @)
    const nomeFicticio = email.split('@')[0]
      .split('.').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

    try {
      const res = await fetch(`http://localhost:3000/api/groups/${selectedGroup.id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nomeFicticio })
      });
      if (!res.ok) throw new Error("Erro ao adicionar membro");
      const novoMembro = await res.json();

      const newId = novoMembro.id;

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
      setAllGroupMembers(prev => [...prev, novoMembro]);
    } catch (err) {
      console.error(err);
    }
  };

  const removeMemberFromGroup = async (memberId) => {
    if (!selectedGroup) return;

    try {
      const res = await fetch(`http://localhost:3000/api/groups/members/${memberId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Erro ao remover membro");

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
    } catch (err) {
      console.error(err);
    }
  };

  const updateUser = (data) => {
    setUser(prev => ({ ...prev, ...data }));
    if (data.name) {
      setAllGroupMembers(prev => prev.map(m => m.name.includes('(Você)') ? { ...m, name: `${data.name} (Você)` } : m));
    }
  };

  // Cria um novo grupo e automaticamente adiciona o usuário atual como membro
  const createGroup = async (nome) => {
    if (!user) return;
    try {
      const response = await fetch('http://localhost:3000/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nome, ownerId: user.id })
      });
      if (!response.ok) throw new Error("Falha ao criar grupo");
      const newGroup = await response.json();
      
      setGroups(prev => [...prev, newGroup]);
    } catch (err) {
      console.error(err);
    }
  };

  // Remove o grupo e todos os dados associados (membros + despesas)
  const deleteGroup = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/groups/${groupId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error("Falha ao deletar grupo");

      setGroups(prev => prev.filter(g => g.id !== groupId));
      setAllGroupMembers(prev => prev.filter(m => m.groupId !== groupId));
      setAllExpenses(prev => prev.filter(e => e.groupId !== groupId));
      // Se o grupo deletado era o selecionado, limpa a seleção
      if (selectedGroup && selectedGroup.id === groupId) {
        setSelectedGroup(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Despesas por grupo
  const [allExpenses, setAllExpenses] = useState([]);


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

  const getBalances = () => {
    if (!userNesseGrupo) return {};
    
    // balances armazenará o saldo de cada membro EM RELAÇÃO AO USUÁRIO
    // chave: id do membro, valor: saldo (positivo = membro deve ao usuário, negativo = usuário deve ao membro)
    const balances = {};
    groupMembers.forEach(m => {
      if (m.id !== userNesseGrupo.id) {
        balances[m.id] = 0;
      }
    });

    expenses.forEach(exp => {
      if (exp.payerId === userNesseGrupo.id) {
        // Usuário pagou: os outros devem a ele a parte deles
        exp.split.forEach(s => {
          if (s.memberId !== userNesseGrupo.id && balances[s.memberId] !== undefined) {
            balances[s.memberId] += s.amount;
          }
        });
      } else {
        // Outro pagou: o usuário deve ao pagador a parte dele (do usuário)
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
      userTotalReceive,
      userBalances
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => useContext(ExpenseContext);
