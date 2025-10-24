# Agendamentos de Salas Politécnico

Esse site tem o intuito de organizar o sistema de agendamento de salas do Colégio Politécnico, toda sua funcionalidade segue o modelo front-end, sendo usado o sistema de banco de dados DBservice.

* O cadastro de salas é realizado pelos administradores, que também são capazes de agendar, editar e excluir salas ou agendamentos.
* O site perimite que professores, alunos e outros autorizados realizem agendamentos em dias e horários especificados pelo usuario.
* É possível ver as salas que já estão agendadas atráves de um calendario virtual e os horários que serão usadas.
* É possível editar os própios agendamentos se for necessário.
---

## O que é preciso para acessar?

Como este é um protótipo que funciona localmente, você não precisa de nada além de:

* Um navegador de internet moderno: Google Chrome, Firefox, Microsoft Edge, etc.
* Os arquivos do projeto: `index.html`, `script.js` e `styles.css`.

Para usar o sistema, basta abrir o arquivo `index.html` no seu navegador de preferência.

---

## Acesso ao Sistema e Níveis de Usuário

O sistema possui 4 níveis de acesso.
Para realizar qualquer modificação (criar salas, agendar, excluir), o usuário precisa estar logado.

### Como Fazer Login

Para acessar, será necessário informar um nome de usuário e senha.
O sistema usa dados estáticos (fixos no código) para autenticar o usuário.

---

### Credenciais de Acesso (Estático)

| Perfil        | Nome de Usuário | Senha        |
| ------------- | --------------- | ------------ |
| Administrador | Administrador   | ADM123       |
| Professor     | Professor       | professor123 |
| Aluno         | Aluno           | aluno123     |

---

## Níveis de Permissão

Cada perfil de usuário tem permissões diferentes dentro do sistema:

### Visitante (Não Logado)

* Pode visualizar o calendário de salas e os agendamentos existentes.
* Não pode criar salas, agendar horários ou excluir qualquer informação.

### Aluno

* Pode agendar salas para um ou mais dias.
* Pode excluir apenas os agendamentos que ele mesmo criou.

### Professor

* Pode agendar salas para um ou mais dias.
* Pode excluir apenas os agendamentos que ele mesmo criou.

### Administrador (ADM)

* Possui acesso total ao sistema.
* Pode criar, visualizar detalhes e excluir salas.
* Pode agendar salas.
* Pode excluir qualquer agendamento, mesmo que não tenha sido ele quem criou.

---

## Guia de Usuário (Como Usar)

Siga este guia para aprender as funções do sistema.

### 1. Criar ou Excluir uma Sala (Função de Administrador)

Apenas usuários administradores podem gerenciar as salas.

**Para Criar:**

1. Faça login como administrador.
2. No painel à esquerda, clique no botão **"Criar Sala"**.
3. Preencha o formulário com Bloco, Nome, Tipo e Capacidade.
4. Clique em **"Salvar Sala"** — a sala aparecerá na lista da esquerda.

**Para Excluir:**

1. Faça login como administrador.
2. Na lista de salas, clique na sala que deseja remover.
3. Uma janela de **"Detalhes da Sala"** aparecerá.
4. Clique no botão vermelho **"Excluir sala"** e confirme.

---

### 2. Agendar um Horário (Usuários Logados)

Qualquer usuário logado (aluno, professor ou administrador) pode agendar horários.

1. Faça login.
2. No calendário à direita, clique em um horário vago.
3. Uma janela (modal) de **"Novo Agendamento"** aparecerá.
4. Preencha o formulário:

   * **Sala:** selecione a sala desejada.
   * **Data inicial e final:** defina o período do agendamento.
   * **Dias da semana:** marque os dias em que o evento deve se repetir (ex: Segunda e Quarta).
   * **Horário inicial e final:** defina o horário da reserva.
   * **Nome e responsável:** preencha quem está reservando e para qual finalidade.
5. Clique em **"Confirmar"**.

**Resultado:** Os agendamentos aparecerão como blocos coloridos no calendário.

---

### 3. Excluir um Agendamento

1. Faça login.
2. No calendário, encontre o agendamento que deseja remover.
3. Clique diretamente sobre o bloco colorido do agendamento.
4. Uma mensagem de confirmação aparecerá.
5. Clique em **"OK"** para excluir.

*Lembrete: alunos e professores só podem excluir seus próprios agendamentos.*

---
