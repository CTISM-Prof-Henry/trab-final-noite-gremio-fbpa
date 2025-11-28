const QUnit = require("qunit");
const {
  Sala,
  Agendamento,
  formatarData,
  salaDuplicada,
  agendamentoDuplicado
} = require("../src/definitions.js");

QUnit.test("Formatar data inválida deve falhar", assert => {
  const dataInvalida = "2025-02-30T10:00";
  const resultado = formatarData(dataInvalida);
  assert.notEqual(resultado, "30/02/2025", "Não deve formatar uma data inexistente corretamente");
});

QUnit.test("Criar sala duplicada deve falhar", assert => {
  const salas = [ new Sala(1, "A", "Lab 1", "Laboratório", 30) ];
  const novaSala = new Sala(1, "A", "Lab 1", "Laboratório", 30);
  assert.ok(salaDuplicada(salas, novaSala), "Sala duplicada detectada");
});

QUnit.test("Criar agendamento duplicado deve falhar", assert => {
  const agendamentos = [
    new Agendamento(1, 1, "Reunião", "João", "2025-11-28T10:00", "2025-11-28T11:00")
  ];
  const novoAgendamento = new Agendamento(1, 1, "Reunião", "João", "2025-11-28T10:00", "2025-11-28T11:00");
  assert.ok(agendamentoDuplicado(agendamentos, novoAgendamento), "Agendamento duplicado detectado");
});
