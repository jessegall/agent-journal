from journal.supervisor_link import SupervisorLink


class Typist:
    """The engine's typing of lines into one environment's terminal, handed to a state as it enters or leaves the stack: a state may switch it off, every line then waiting, and on again, the waiting lines typed as one."""

    def __init__(self, supervisor: SupervisorLink, environment_id: int) -> None:
        self.supervisor, self.environment_id = supervisor, environment_id

    def pause(self) -> None:
        self.supervisor.pause(self.environment_id)

    def resume(self) -> None:
        self.supervisor.resume(self.environment_id)
