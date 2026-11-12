from collections.abc import Callable

from engine.enums.process_kind import ProcessKind


class RequestRecords:
    """Keeps a process row for each hook, journal command and viewer request that comes in, from its start to its
    end. With no processes module installed nothing is kept; the processes module binds the rows."""

    def begun(self, kind: ProcessKind, line: str) -> int | None:
        return None

    def ended(self, row_id: int | None, exit_code: int) -> None:
        return None

    def recorded(self, kind: ProcessKind, line: str, answer: Callable[[], int]) -> int:
        row_id = self.begun(kind, line)
        exit_code = 1
        try:
            exit_code = answer()
        finally:
            self.ended(row_id, exit_code)
        return exit_code
