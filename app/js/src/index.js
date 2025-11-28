var app = {
  gerenciadorDB: null,
  salas: [],
  agendamentos: [],
  salaSelecionada: null,
  agendamentoSelecionado: null,
  calendar: null,
}

// Declaração de variáveis externas
window.GerenciadorSalasDB = window.GerenciadorSalasDB || (() => {})
window.FullCalendar = window.FullCalendar || { Calendar: () => {} }
window.bootstrap = window.bootstrap || { Modal: () => {} }
window.verificarConflito = window.verificarConflito || (() => false)
window.formatarData = window.formatarData || ((date) => date.toDateString())
window.formatarHora = window.formatarHora || ((date) => date.toLocaleTimeString())
window.filtrarPorBloco = window.filtrarPorBloco || ((salas, bloco) => salas)
window.ordenarSalas = window.ordenarSalas || ((salas, por, direcao) => salas)

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM carregado, inicializando app...")

  app.gerenciadorDB = new window.GerenciadorSalasDB()

  app.gerenciadorDB.inicializarDB(() => {
    console.log("Banco inicializado, carregando app...")
    inicializarApp()
  })
})

function inicializarApp() {
  console.log("Inicializando aplicação...")
  carregarDados()
  configurarEventListeners()
  inicializarFullCalendar()
  atualizarDataHoje()
}

function inicializarFullCalendar() {
  console.log("Inicializando FullCalendar...")

  var calendarEl = document.getElementById("calendar")

  if (!calendarEl) {
    console.error("Elemento #calendar não encontrado!")
    return
  }

  app.calendar = new window.FullCalendar.Calendar(calendarEl, {
    locale: "pt-br",
    initialView: "timeGridWeek",
    headerToolbar: false,
    allDaySlot: false,
    expandRows: true,
    height: "50%",
    slotMinTime: "07:00:00",
    slotMaxTime: "23:00:00",
    slotDuration: "00:30:00",
    weekends: true,
    selectable: false,
    height: "auto",
    events: [],

    dateClick: (info) => {
      console.log("Clique no calendário:", info.dateStr)
      var start = info.date
      var end = new Date(start.getTime() + 60 * 60 * 1000) // +1 hora
      abrirModalAgendamento(start, end)
    },

    eventClick: (info) => {
      console.log("Clique em evento:", info.event.id)
      mostrarDetalhesAgendamento(info.event)
    },

    eventDidMount: (info) => {
      if (info.event.extendedProps.salaNome) {
        info.el.title =
          info.event.title +
          "\nSala: " +
          info.event.extendedProps.salaNome +
          "\nResponsável: " +
          info.event.extendedProps.responsavel
      }
    },
  })

  app.calendar.render()
  console.log("FullCalendar renderizado!")
  atualizarTituloCalendario()
}

function carregarDados() {
  console.log("Carregando dados...")

  app.gerenciadorDB.carregarSalas((result) => {
    if (result.success) {
      app.salas = result.data
      console.log("Salas carregadas:", app.salas.length)
      atualizarInterface()
      carregarAgendamentos()
    }
  })
}

function carregarAgendamentos() {
  app.gerenciadorDB.carregarAgendamentos((result) => {
    if (result.success) {
      app.agendamentos = result.data
      console.log("Agendamentos carregados:", app.agendamentos.length)
      atualizarEventosCalendario()
    }
  })
}

function atualizarEventosCalendario() {
  if (!app.calendar) return

  app.calendar.removeAllEvents()

  for (var i = 0; i < app.agendamentos.length; i++) {
    var ag = app.agendamentos[i]
    var sala = null

    for (var j = 0; j < app.salas.length; j++) {
      if (app.salas[j].id === ag.salaId) {
        sala = app.salas[j]
        break
      }
    }

    var salaNome = sala ? sala.bloco + sala.nome : "Sala removida"

    app.calendar.addEvent({
      id: ag.id,
      title: ag.titulo + " - " + salaNome,
      start: ag.start,
      end: ag.end,
      backgroundColor: sala && sala.tipo === "Laboratório" ? "#198754" : "#0d6efd",
      borderColor: sala && sala.tipo === "Laboratório" ? "#146c43" : "#0a58ca",
      extendedProps: {
        salaId: ag.salaId,
        salaNome: salaNome,
        responsavel: ag.responsavel,
        titulo: ag.titulo,
      },
    })
  }
}

function configurarEventListeners() {
  console.log("Configurando event listeners...")

  document.getElementById("btnSalvarSala").addEventListener("click", salvarSala)
  document.getElementById("btnExcluirSala").addEventListener("click", excluirSala)
  document.getElementById("filtroBloco").addEventListener("change", atualizarListaSalas)
  document.getElementById("ordenarPor").addEventListener("change", atualizarListaSalas)
  document.getElementById("ordenarDirecao").addEventListener("change", atualizarListaSalas)

  document.getElementById("btnMes").addEventListener("click", () => {
    app.calendar.changeView("dayGridMonth")
    atualizarTituloCalendario()
  })
  document.getElementById("btnSemana").addEventListener("click", () => {
    app.calendar.changeView("timeGridWeek")
    atualizarTituloCalendario()
  })
  document.getElementById("btnDia").addEventListener("click", () => {
    app.calendar.changeView("timeGridDay")
    atualizarTituloCalendario()
  })

  document.getElementById("btnAnterior").addEventListener("click", () => {
    app.calendar.prev()
    atualizarTituloCalendario()
  })
  document.getElementById("btnProximo").addEventListener("click", () => {
    app.calendar.next()
    atualizarTituloCalendario()
  })
  document.getElementById("btnHoje").addEventListener("click", () => {
    app.calendar.today()
    atualizarTituloCalendario()
  })
  document.getElementById("inputDataCalendario").addEventListener("change", (e) => {
    if (e.target.value) {
      app.calendar.gotoDate(e.target.value)
      atualizarTituloCalendario()
    }
  })
  document.getElementById("btnSalvarAgendamento").addEventListener("click", salvarAgendamento)
  document.getElementById("btnExcluirAgendamento").addEventListener("click", excluirAgendamento)
}

function atualizarTituloCalendario() {
  if (!app.calendar) return

  var view = app.calendar.view
  var titulo = document.getElementById("tituloCalendario")
  var meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  var data = view.currentStart
  var mes = meses[data.getMonth()]
  var ano = data.getFullYear()

  if (view.type === "dayGridMonth") {
    titulo.textContent = mes + " " + ano
  } else if (view.type === "timeGridWeek") {
    var fimSemana = new Date(view.currentEnd)
    fimSemana.setDate(fimSemana.getDate() - 1)
    titulo.textContent = data.getDate() + " - " + fimSemana.getDate() + " de " + mes + " " + ano
  } else {
    titulo.textContent = data.getDate() + " de " + mes + " " + ano
  }
}

function abrirModalAgendamento(start, end) {
  if (app.salas.length === 0) {
    alert("Você precisa criar pelo menos uma sala antes de fazer um agendamento.")
    return
  }

  var selectSala = document.getElementById("inputSalaAgendamento")
  selectSala.innerHTML = ""

  for (var i = 0; i < app.salas.length; i++) {
    var sala = app.salas[i]
    var option = document.createElement("option")
    option.value = sala.id
    option.textContent = sala.bloco + sala.nome + " - " + sala.tipo
    selectSala.appendChild(option)
  }

  var dataInicio = start.toISOString().slice(0, 10)
  var horaInicio = start.toTimeString().slice(0, 5)
  var horaFim = end.toTimeString().slice(0, 5)

  document.getElementById("inputDataAgendamento").value = dataInicio
  document.getElementById("inputHoraInicio").value = horaInicio
  document.getElementById("inputHoraFim").value = horaFim
  document.getElementById("inputTituloAgendamento").value = ""
  document.getElementById("inputResponsavel").value = ""

  var modal = new window.bootstrap.Modal(document.getElementById("addAgendamentoModal"))
  modal.show()
}

function salvarAgendamento() {
  var form = document.getElementById("formAgendamento")

  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  var salaId = Number.parseInt(document.getElementById("inputSalaAgendamento").value)
  var data = document.getElementById("inputDataAgendamento").value
  var horaInicio = document.getElementById("inputHoraInicio").value
  var horaFim = document.getElementById("inputHoraFim").value

  var novoAgendamento = {
    salaId: salaId,
    titulo: document.getElementById("inputTituloAgendamento").value,
    responsavel: document.getElementById("inputResponsavel").value,
    start: data + "T" + horaInicio + ":00",
    end: data + "T" + horaFim + ":00",
  }

  if (window.verificarConflito(app.agendamentos, novoAgendamento)) {
    alert("Já existe um agendamento para esta sala neste horário!")
    return
  }

  app.gerenciadorDB.salvarAgendamento(novoAgendamento, (result) => {
    if (result.success) {
      novoAgendamento.id = result.id
      app.agendamentos.push(novoAgendamento)
      atualizarEventosCalendario()

      form.reset()
      window.bootstrap.Modal.getInstance(document.getElementById("addAgendamentoModal")).hide()
      alert("Agendamento criado com sucesso!")
    } else {
      alert("Erro ao salvar agendamento: " + result.message)
    }
  })
}

function mostrarDetalhesAgendamento(event) {
  var agendamento = null
  var eventId = Number.parseInt(event.id)

  for (var i = 0; i < app.agendamentos.length; i++) {
    if (app.agendamentos[i].id === eventId) {
      agendamento = app.agendamentos[i]
      break
    }
  }

  if (!agendamento) return

  app.agendamentoSelecionado = agendamento

  var sala = null
  for (var j = 0; j < app.salas.length; j++) {
    if (app.salas[j].id === agendamento.salaId) {
      sala = app.salas[j]
      break
    }
  }
  var salaNome = sala ? sala.bloco + sala.nome : "Sala removida"

  document.getElementById("detalheAgendamentoTitulo").textContent = agendamento.titulo
  document.getElementById("detalheAgendamentoResponsavel").textContent = agendamento.responsavel
  document.getElementById("detalheAgendamentoSala").textContent = salaNome
  document.getElementById("detalheAgendamentoData").textContent = window.formatarData(agendamento.start)
  document.getElementById("detalheAgendamentoHorario").textContent =
    window.formatarHora(agendamento.start) + " - " + window.formatarHora(agendamento.end)

  var modal = new window.bootstrap.Modal(document.getElementById("detalhesAgendamentoModal"))
  modal.show()
}

function excluirAgendamento() {
  if (!app.agendamentoSelecionado) return

  if (!confirm("Tem certeza que deseja excluir este agendamento?")) return

  var agId = app.agendamentoSelecionado.id

  app.gerenciadorDB.removerAgendamento(agId, (result) => {
    if (result.success) {
      app.agendamentos = app.agendamentos.filter((a) => a.id !== agId)
      atualizarEventosCalendario()
      window.bootstrap.Modal.getInstance(document.getElementById("detalhesAgendamentoModal")).hide()
      alert("Agendamento excluído com sucesso!")
    } else {
      alert("Erro ao excluir agendamento")
    }
  })
}

function salvarSala() {
  var form = document.getElementById("formSala")

  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  var novaSala = {
    bloco: document.getElementById("inputBloco").value.toUpperCase(),
    nome: document.getElementById("inputNome").value,
    tipo: document.getElementById("inputTipo").value,
    capacidade: Number.parseInt(document.getElementById("inputCapacidade").value),
  }

  app.gerenciadorDB.salvarSala(novaSala, (result) => {
    if (result.success) {
      novaSala.id = result.id
      app.salas.push(novaSala)
      atualizarInterface()

      form.reset()
      window.bootstrap.Modal.getInstance(document.getElementById("addSalaModal")).hide()
      alert("Sala " + novaSala.bloco + novaSala.nome + " criada com sucesso!")
    } else {
      alert("Erro ao salvar sala: " + result.message)
    }
  })
}

function excluirSala() {
  if (!app.salaSelecionada) return

  var nomeSala = app.salaSelecionada.bloco + app.salaSelecionada.nome

  if (!confirm("Tem certeza que deseja excluir a sala " + nomeSala + "?")) return

  var salaId = app.salaSelecionada.id

  app.gerenciadorDB.removerSala(salaId, (result) => {
    if (result.success) {
      app.salas = app.salas.filter((sala) => sala.id !== salaId)
      atualizarInterface()
      window.bootstrap.Modal.getInstance(document.getElementById("detalhesSalaModal")).hide()
      alert("Sala " + nomeSala + " excluída com sucesso!")
    } else {
      alert("Erro ao excluir sala")
    }
  })
}

function mostrarDetalhesSala(salaId) {
  var sala = null

  for (var i = 0; i < app.salas.length; i++) {
    if (app.salas[i].id === salaId) {
      sala = app.salas[i]
      break
    }
  }

  if (!sala) return

  app.salaSelecionada = sala

  document.getElementById("detalheBloco").textContent = sala.bloco
  document.getElementById("detalheNome").textContent = sala.nome
  document.getElementById("detalheTipo").textContent = sala.tipo
  document.getElementById("detalheCapacidade").textContent = sala.capacidade

  var modal = new window.bootstrap.Modal(document.getElementById("detalhesSalaModal"))
  modal.show()
}

function atualizarInterface() {
  atualizarDataHoje()
  atualizarListaSalas()
  atualizarFiltroBloco()
}

function atualizarDataHoje() {
  var hoje = new Date()
  var diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]

  var diaSemana = diasSemana[hoje.getDay()]
  var dataFormatada = window.formatarData(hoje)

  document.getElementById("dataHoje").textContent = diaSemana + ", " + dataFormatada
}

function atualizarListaSalas() {
  var container = document.getElementById("listaSalas")
  var filtroBloco = document.getElementById("filtroBloco").value
  var ordenarPorValor = document.getElementById("ordenarPor").value
  var ordenarDirecaoValor = document.getElementById("ordenarDirecao").value

  var salasFiltradas = window.filtrarPorBloco(app.salas, filtroBloco)
  salasFiltradas = window.ordenarSalas(salasFiltradas, ordenarPorValor, ordenarDirecaoValor)

  if (salasFiltradas.length === 0) {
    container.innerHTML = '<p class="text-muted text-center">Nenhuma sala cadastrada</p>'
    return
  }

  var html = ""
  for (var i = 0; i < salasFiltradas.length; i++) {
    var sala = salasFiltradas[i]
    html +=
      '<div class="card mb-2 sala-card" data-sala-id="' +
      sala.id +
      '" style="cursor: pointer;">' +
      '<div class="card-body p-2">' +
      '<h6 class="mb-1">' +
      sala.bloco +
      sala.nome +
      "</h6>" +
      '<small class="text-muted d-block">' +
      sala.tipo +
      "</small>" +
      '<small class="text-muted">Capacidade: ' +
      sala.capacidade +
      "</small>" +
      "</div>" +
      "</div>"
  }

  container.innerHTML = html

  var cards = document.querySelectorAll(".sala-card")
  for (var j = 0; j < cards.length; j++) {
    cards[j].addEventListener("click", function () {
      var salaId = Number.parseInt(this.dataset.salaId)
      mostrarDetalhesSala(salaId)
    })
  }
}

function atualizarFiltroBloco() {
  var select = document.getElementById("filtroBloco")

  var blocosSet = {}
  for (var i = 0; i < app.salas.length; i++) {
    blocosSet[app.salas[i].bloco] = true
  }
  var blocos = Object.keys(blocosSet).sort()

  select.innerHTML = '<option value="">Todos os blocos</option>'

  for (var j = 0; j < blocos.length; j++) {
    var option = document.createElement("option")
    option.value = blocos[j]
    option.textContent = blocos[j]
    select.appendChild(option)
  }
}
