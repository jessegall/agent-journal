from journal.supervisor_link import SupervisorLink


class Typist:
    """The engine's typing of lines into one environment's terminal, handed to a state as it enters or leaves the stack: a state may switch it off, every line then dropped, and on again."""

    def __init__(self, supervisor: SupervisorLink, environment_id: int) -> None:
        self.supervisor, self.environment_id = supervisor, environment_id

    def switch_off(self) -> None:
        self.supervisor.switch_off(self.environment_id)

    def switch_on(self) -> None:
        self.supervisor.switch_on(self.environment_id)
