from collections.abc import Callable

from engine.command.context import Context
from engine.enums.process_kind import ProcessKind
from engine.errors.exit_coded_error import ExitCodedError


class RequestRecords:
    """Keeps a process row for each hook, journal command and viewer request that comes in, from its start to its
    end. A command that raises ends with the exit code of its error, and the error goes on. A row that cannot be
    written is reported and never changes the answer. With no processes module installed nothing is kept; the
    processes module binds the rows."""

    def recorded_hook(self, agent_id: int, line: str, exit_code: int, context: Context) -> None:
        return None

    def recorded(self, kind: ProcessKind, line: str, answer: Callable[[], int]) -> int:
        exit_code = ExitCodedError.exit_code
        try:
            exit_code = answer()
        except ExitCodedError as error:
            exit_code = error.exit_code
            raise
        finally:
            self.recorded_safely(kind, line, exit_code)
        return exit_code

    def recorded_safely(self, kind: ProcessKind, line: str, exit_code: int) -> None:
        try:
            self.ended_now(kind, line, exit_code)
        except Exception as failure:
            self.write_failed(line, failure)

    def ended_now(self, kind: ProcessKind, line: str, exit_code: int) -> None:
        return None

    def write_failed(self, line: str, failure: Exception) -> None:
        return None
