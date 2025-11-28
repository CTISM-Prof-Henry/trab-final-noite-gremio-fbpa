class Sala {
  constructor(id, bloco, nome, tipo, capacidade) {
    this.id = id;
    this.bloco = bloco;
    this.nome = nome;
    this.tipo = tipo;
    this.capacidade = capacidade;
  }
}

class Agendamento {
  constructor(id, salaId, titulo, responsavel, start, end) {
    this.id = id;
    this.salaId = salaId;
    this.titulo = titulo;
    this.responsavel = responsavel;
    this.start = start;
    this.end = end;
  }
}

class GerenciadorSalasDB {
  constructor() {
    this.db = null;
    this.ready = false;
  }

  inicializarDB(callback) {
    var request = indexedDB.open("AgendamentoSalasDB", 2);

    request.onsuccess = (event) => {
      this.db = event.target.result;
      this.ready = true;
      console.log("Banco de dados IndexedDB pronto!");
      if (callback) callback();
    };

    request.onerror = (event) => {
      console.error("Erro ao abrir banco de dados:", event.target.error);
      this.ready = false;
    };

    request.onupgradeneeded = (event) => {
      this.db = event.target.result;

      if (!this.db.objectStoreNames.contains("salas")) {
        var salasStore = this.db.createObjectStore("salas", {
          keyPath: "id",
          autoIncrement: true,
        });
        salasStore.createIndex("nome", "nome", { unique: false });
        salasStore.createIndex("bloco", "bloco", { unique: false });
        salasStore.createIndex("tipo", "tipo", { unique: false });
      }

      if (!this.db.objectStoreNames.contains("agendamentos")) {
        var agendamentosStore = this.db.createObjectStore("agendamentos", {
          keyPath: "id",
          autoIncrement: true,
        });
        agendamentosStore.createIndex("salaId", "salaId", { unique: false });
        agendamentosStore.createIndex("start", "start", { unique: false });
      }
    };
  }

  isReady() {
    return this.ready && this.db;
  }

  salvarSala(sala, callback) {
    if (!this.isReady()) {
      callback({ success: false, message: "Banco de dados não está pronto" });
      return;
    }

    var transaction = this.db.transaction("salas", "readwrite");
    var objectStore = transaction.objectStore("salas");
    var request = objectStore.add(sala);

    request.onsuccess = () => {
      callback({ success: true, id: request.result });
    };

    request.onerror = (event) => {
      callback({ success: false, message: event.target.error?.message });
    };
  }

  carregarSalas(callback) {
    if (!this.isReady()) {
      callback({ success: false, data: [] });
      return;
    }

    var transaction = this.db.transaction(["salas"], "readonly");
    var objectStore = transaction.objectStore("salas");
    var request = objectStore.getAll();

    request.onerror = () => {
      callback({ success: false, data: [] });
    };

    request.onsuccess = () => {
      callback({ success: true, data: request.result });
    };
  }

  removerSala(id, callback) {
    if (!this.isReady()) {
      callback({ success: false });
      return;
    }

    var transaction = this.db.transaction("salas", "readwrite");
    var objectStore = transaction.objectStore("salas");
    var request = objectStore.delete(id);

    request.onsuccess = () => {
      callback({ success: true });
    };

    request.onerror = () => {
      callback({ success: false });
    };
  }

  salvarAgendamento(agendamento, callback) {
    if (!this.isReady()) {
      callback({ success: false, message: "Banco de dados não está pronto" });
      return;
    }

    var transaction = this.db.transaction("agendamentos", "readwrite");
    var objectStore = transaction.objectStore("agendamentos");
    var request = objectStore.add(agendamento);

    request.onsuccess = () => {
      callback({ success: true, id: request.result });
    };

    request.onerror = (event) => {
      callback({ success: false, message: event.target.error?.message });
    };
  }

  carregarAgendamentos(callback) {
    if (!this.isReady()) {
      callback({ success: false, data: [] });
      return;
    }

    var transaction = this.db.transaction(["agendamentos"], "readonly");
    var objectStore = transaction.objectStore("agendamentos");
    var request = objectStore.getAll();

    request.onerror = () => {
      callback({ success: false, data: [] });
    };

    request.onsuccess = () => {
      callback({ success: true, data: request.result });
    };
  }

  removerAgendamento(id, callback) {
    if (!this.isReady()) {
      callback({ success: false });
      return;
    }

    var transaction = this.db.transaction("agendamentos", "readwrite");
    var objectStore = transaction.objectStore("agendamentos");
    var request = objectStore.delete(id);

    request.onsuccess = () => {
      callback({ success: true });
    };

    request.onerror = () => {
      callback({ success: false });
    };
  }
}

function verificarConflito(agendamentos, novoAgendamento) {
  const novoInicio = new Date(novoAgendamento.start).getTime();
  const novoFim = new Date(novoAgendamento.end).getTime();

  for (let ag of agendamentos) {
    if (ag.salaId !== novoAgendamento.salaId) continue;
    if (ag.id === novoAgendamento.id) continue;

    const agInicio = new Date(ag.start).getTime();
    const agFim = new Date(ag.end).getTime();

    if (novoInicio < agFim && novoFim > agInicio) {
      return true;
    }
  }
  return false;
}

function ordenarSalas(salas, campo, direcao) {
  return salas.slice().sort((a, b) => {
    let valorA = a[campo];
    let valorB = b[campo];

    if (typeof valorA === "string") {
      valorA = valorA.toLowerCase();
      valorB = valorB.toLowerCase();
    }

    if (direcao === "asc") {
      return valorA > valorB ? 1 : -1;
    } else {
      return valorA < valorB ? 1 : -1;
    }
  });
}

function filtrarPorBloco(salas, bloco) {
  if (!bloco) return salas;
  return salas.filter((sala) => sala.bloco === bloco);
}

function formatarData(data) {
  const d = new Date(data);
  if (isNaN(d.getTime())) {
    throw new Error("Data inválida");
  }
  const dia = d.getDate().toString().padStart(2, "0");
  const mes = (d.getMonth() + 1).toString().padStart(2, "0");
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function formatarHora(data) {
  const d = new Date(data);
  if (isNaN(d.getTime())) {
    throw new Error("Hora inválida");
  }
  const hora = d.getHours().toString().padStart(2, "0");
  const minuto = d.getMinutes().toString().padStart(2, "0");
  return `${hora}:${minuto}`;
}

function salaDuplicada(salas, novaSala) {
  return salas.some(s => s.id === novaSala.id || s.nome === novaSala.nome);
}

function agendamentoDuplicado(agendamentos, novoAgendamento) {
  return agendamentos.some(a =>
    a.id === novoAgendamento.id ||
    (a.salaId === novoAgendamento.salaId &&
     a.start === novoAgendamento.start &&
     a.end === novoAgendamento.end)
  );
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    Sala,
    Agendamento,
    GerenciadorSalasDB,
    verificarConflito,
    ordenarSalas,
    filtrarPorBloco,
    formatarData,
    formatarHora,
    salaDuplicada,
    agendamentoDuplicado
  };
} else {
  window.Sala = Sala;
  window.Agendamento = Agendamento;
  window.GerenciadorSalasDB = GerenciadorSalasDB;
  window.verificarConflito = verificarConflito;
  window.ordenarSalas = ordenarSalas;
  window.filtrarPorBloco = filtrarPorBloco;
  window.formatarData = formatarData;
  window.formatarHora = formatarHora;
  window.salaDuplicada = salaDuplicada;
  window.agendamentoDuplicado = agendamentoDuplicado;
}