from collections.abc import Callable

from engine.actor.actor import Actor
from engine.enums.process_kind import ProcessKind
from engine.errors.exit_coded_error import ExitCodedError

# A hook refused, held, let through unchecked or failed keeps its row with this exit code.
REFUSED_HOOK_EXIT_CODE = 2


class RequestRecords:
    """Keeps a process row for each hook, journal command and viewer request that comes in, from its start to
    its end. A command that raises ends with the exit code of its error, and the error goes on. A row that
    cannot be written is reported and never changes the answer. With no processes module installed nothing is
    kept; the processes module binds the rows. The console names the agent or person a command comes from once
    it found them, since the command's scope is closed by the time its row is kept."""

    caller: tuple[Actor, int | None] | None = None

    def note_caller(self, actor: Actor, environment_id: int | None) -> None:
        self.caller = (actor, environment_id)

    def recorded_hook(self, agent_id: int, environment_id: int, line: str, exit_code: int) -> None:
        return None

    def recorded(self, category: ProcessKind, line: str, answer: Callable[[], int]) -> int:
        exit_code = ExitCodedError.exit_code
        try:
            exit_code = answer()
        except ExitCodedError as error:
            exit_code = error.exit_code
            raise
        finally:
            self.recorded_safely(category, line, exit_code)
        return exit_code

    def recorded_safely(self, category: ProcessKind, line: str, exit_code: int) -> None:
        try:
            self.ended_now(category, line, exit_code)
        except Exception as failure:
            self.write_failed(line, failure)

    def ended_now(self, category: ProcessKind, line: str, exit_code: int) -> None:
        return None

    def write_failed(self, line: str, failure: Exception) -> None:
        return None
