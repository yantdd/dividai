# DividAí - Gestão Inteligente de Despesas Compartilhadas

O DividAí é uma aplicação mobile-first desenvolvida para simplificar a organização financeira em ambientes de moradia compartilhada. O projeto foca em transparência, automação e facilidade de uso, eliminando os atritos comuns na divisão de contas mensais e despesas pontuais.

## Contexto do Cliente e Problema

### O Público-Alvo
O projeto foi concebido para estudantes universitários que residem em repúblicas, pensionatos ou apartamentos compartilhados. Este público lida diariamente com uma alta rotatividade de pequenas e grandes despesas que precisam ser rateadas de forma justa e rápida.

### O Problema
A ausência de uma ferramenta centralizada resulta em:
*   **Caos Financeiro**: Uso de planilhas complexas ou anotações em papel que se perdem.
*   **Falta de Transparência**: Dificuldade em rastrear quem pagou o quê e quem ainda deve.
*   **Atrito Social**: O desconforto causado pela necessidade de cobrar dívidas de colegas de forma recorrente.

### A Solução
O DividAí resolve esses problemas através de:
*   **Gestão Colaborativa**: Ambientes isolados por grupos (repúblicas) onde todos os membros têm visibilidade total.
*   **Divisão Automática**: Lógica de cálculo que processa splits de valores instantaneamente.
*   **Simulação de OCR**: Integração de tecnologia simulada para leitura de notas fiscais, reduzindo o erro humano e o tempo de digitação.

## Tecnologias Utilizadas (A Stack)

A stack tecnológica foi selecionada visando modernidade, performance e uma experiência de usuário premium:

| Tecnologia | Papel no Projeto |
| :--- | :--- |
| **React.js 19** | Biblioteca principal para construção da interface baseada em componentes. |
| **Vite** | Build tool de próxima geração que garante um ambiente de desenvolvimento ultra-rápido. |
| **Tailwind CSS v4** | Framework utilitário para estilização robusta e design responsivo mobile-first. |
| **React Router DOM** | Gerenciamento de rotas e navegação entre as diferentes telas da aplicação. |
| **Lucide-React** | Conjunto de ícones vetoriais que garantem consistência visual e semântica. |

## Funcionalidades do MVP

As funcionalidades implementadas atendem rigorosamente aos requisitos de um Produto Mínimo Viável funcional:

1.  **Autenticação (Login Dummy)**: Sistema de entrada simulado que permite alternar entre o estado de visitante e usuário autenticado.
2.  **CRUD de Grupos**: Criação e listagem de grupos (repúblicas), permitindo ao usuário gerenciar múltiplos contextos de despesas.
3.  **CRUD de Despesas**: Registro completo de gastos, incluindo título, valor e identificação do pagador.
4.  **Dashboard de Saldos**: Visualização consolidada de "Você deve" vs "Você recebe" com atualização reativa em tempo real.
5.  **Adição de Membros**: Funcionalidade de convite para novos moradores, com redistribuição automática de saldos.
6.  **Upload com OCR (Simulado)**: Área de upload de imagem que dispara uma análise via "IA" para extrair o valor da nota fiscal automaticamente.

## Tutorial de Instalação e Execução

Para rodar este projeto localmente, siga os passos abaixo:

### Pré-requisitos
*   **Node.js**: Versão 18.0 ou superior recomendada.
*   **Gerenciador de pacotes**: npm (instalado por padrão com o Node) ou yarn.

### Passo 1: Clonar o Repositório
```bash
git clone [URL_DO_REPOSITORIO]
cd projeto
```

### Passo 2: Instalar Dependências
```bash
npm install
```

### Passo 3: Executar a Aplicação
```bash
npm run dev
```

### Passo 4: Acessar no Navegador
Após rodar o comando acima, a aplicação estará disponível em:
[http://localhost:5173](http://localhost:5173)

## Estrutura de Pastas do Projeto

A organização segue padrões de escalabilidade para projetos React:

*   **/src/pages**: Contém os componentes de página principais (Dashboard, Login, Perfil, Cadastro, etc.).
*   **/src/components**: Componentes reutilizáveis como `Layout.jsx` e `Toggle.jsx`.
*   **/src/contexts**: Gerenciamento de estado global via Context API (`ExpenseContext.jsx`).
*   **/src/assets**: Imagens, ícones globais e estilos base.

## Observações Técnicas

*   **Persistência de Dados**: Atualmente, os dados residem na memória do `ExpenseContext`. Atualizações de página resetarão o estado (em uma versão futura, será implementado localStorage ou Persistence Layer real).
*   **Mobile-First**: A interface foi desenhada prioritariamente para ser utilizada em smartphones. Em desktops, o `Layout.jsx` limita a largura para simular a experiência mobile.
*   **OCR Simulado**: O tempo de espera de 2 segundos na leitura da nota fiscal serve para simular a latência de processamento de uma rede neural real.
