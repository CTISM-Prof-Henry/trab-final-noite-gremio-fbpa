```
classDiagram
    class Sala {
        +id: String
        +nome: String
        +capacidade: int
        +tipo: String
        +bloco: String
        +adicionar(): Sala
        +excluir(): boolean
        +verDetalhes(): Sala
    }

    class Agendamento {
        +id: String
        +idSala: String
        +dataInicial: Date
        +dataFinal: Date
        +diasSemana: String[]
        +horaInicial: Time
        +horaFinal: Time
        +nomeEvento: String
        +responsavel: String
        +criar(): Agendamento
        +excluir(): boolean
        +verificarConflito(): boolean
    }

    class CalendarioUI {
        +instanciaFullCalendar: Object
        +salas: Sala[]
        +agendamentos: Agendamento[]
        +dataAtual: Date
        +renderizarTimeline(): void
        +filtrarSalas(): Sala[]
        +ordenarSalas(): Sala[]
        +abrirModalAgendamento(): void
        +abrirModalSala(): void
        +salvarDadosLocalStorage(): void
        +carregarDadosLocalStorage(): void
    }

    Sala "1" -- "0..*" Agendamento : contém
    CalendarioUI o-- "0..*" Sala : gerencia
    CalendarioUI o-- "0..*" Agendamento : gerencia
```
```mermaid
classDiagram
    class Sala {
        +id String
        +nome String
        +capacidade int
        +tipo String
        +bloco String
        +adicionar() Sala
        +excluir() boolean
        +verDetalhes() Sala
    }

    class Agendamento {
        +id String
        +idSala String
        +dataInicial Date
        +dataFinal Date
        +diasSemana String[]
        +horaInicial Time
        +horaFinal Time
        +nomeEvento String
        +responsavel String
        +criar() Agendamento
        +excluir() boolean
        +verificarConflito() boolean
    }

    class CalendarioUI {
        +instanciaFullCalendar Object
        +salas Sala[]
        +agendamentos Agendamento[]
        +dataAtual Date
        +renderizarTimeline() void
        +filtrarSalas() Sala[]
        +ordenarSalas() Sala[]
        +abrirModalAgendamento() void
        +abrirModalSala() void
        +salvarDadosLocalStorage() void
        +carregarDadosLocalStorage() void
    }

    Sala "1" -- "0..*" Agendamento : contém
    CalendarioUI o-- "0..*" Sala : gerencia
    CalendarioUI o-- "0..*" Agendamento : gerencia

```
