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

> Atenção: Esta funcionalidade de login é apenas conceitual.
> A implementação atual permite que qualquer pessoa realize todas as ações.

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





