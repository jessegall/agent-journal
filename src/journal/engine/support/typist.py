from journal.supervisor_link import SupervisorLink


class Typist:
    """The engine's typing of lines into one environment's terminal, handed to a state as it enters or leaves the stack. Paused, it queues every line and resume types them as one; disabled, it queues nothing until enabled; clear empties its queue."""

    def __init__(self, supervisor: SupervisorLink, environment_id: int) -> None:
        self.supervisor, self.environment_id = supervisor, environment_id

    def pause(self) -> None:
        self.supervisor.pause(self.environment_id)

    def resume(self) -> None:
        self.supervisor.resume(self.environment_id)

    def disable(self) -> None:
        self.supervisor.disable(self.environment_id)

    def enable(self) -> None:
        self.supervisor.enable(self.environment_id)

    def clear(self) -> None:
        self.supervisor.clear(self.environment_id)
