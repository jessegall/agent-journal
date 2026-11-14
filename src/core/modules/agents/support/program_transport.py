from collections.abc import Mapping

RUNNING_ANSWER = b"running\n"


class ProgramTransport:
    """The way the dispatcher reaches whatever runs the programs of agents: it sends a start, stops a program,
    asks how long a program has typed nothing, whether a program of an agent runs and whether it answers at
    all. The one transport today is the launcher of this machine; a launcher on another machine is another
    class."""

    @property
    def is_running(self) -> bool:
        raise NotImplementedError

    def start(self, request: Mapping[str, object]) -> bytes | None:
        raise NotImplementedError

    def stop(self, agent_id: int) -> bool:
        raise NotImplementedError

    def request_stop(self, agent_id: int) -> None:
        raise NotImplementedError

    def idle_seconds(self, agent_id: int) -> int | None:
        raise NotImplementedError

    def has_program(self, agent_id: int) -> bool:
        raise NotImplementedError
