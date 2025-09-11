classDiagram
    class Sala {
        +string id
        +string nome
        +int capacidade
        +string tipo
        +string bloco
        +adicionar()
        +excluir()
        +verDetalhes()
    }

    class Agendamento {
        +string id
        +string idSala
        +date dataInicial
        +date dataFinal
        +array diasSemana
        +time horaInicial
        +time horaFinal
        +string nomeEvento
        +string responsavel
        +criar()
        +excluir()
        +verificarConflito()
    }

    class CalendarioUI {
        +object instanciaFullCalendar
        +array salas
        +array agendamentos
        +date dataAtual
        +renderizarTimeline()
        +filtrarSalas()
        +ordenarSalas()
        +abrirModalAgendamento()
        +abrirModalSala()
        +salvarDadosLocalStorage()
        +carregarDadosLocalStorage()
    }

    Sala "1" -- "0..*" Agendamento : contém
    CalendarioUI o-- "0..*" Sala : gerencia
    CalendarioUI o-- "0..*" Agendamento : gerencia


