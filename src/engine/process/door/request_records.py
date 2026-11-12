from collections.abc import Callable

from engine.enums.process_kind import ProcessKind


class RequestRecords:
    """Keeps a process row for each hook, journal command and viewer request that comes in, from its start to its
    end. With no processes module installed nothing is kept; the processes module binds the rows."""

    def recorded_hook(self, agent_id: int, environment_id: int, line: str, exit_code: int) -> None:
        return None

    def recorded(self, kind: ProcessKind, line: str, answer: Callable[[], int]) -> int:
        exit_code = 1
        try:
            exit_code = answer()
        finally:
            self.recorded_safely(kind, line, exit_code)
        return exit_code

    def recorded_safely(self, kind: ProcessKind, line: str, exit_code: int) -> None:
        try:
            self.ended_now(kind, line, exit_code)
        except Exception:
            return

    def ended_now(self, kind: ProcessKind, line: str, exit_code: int) -> None:
        return None
