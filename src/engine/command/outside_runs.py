from collections import Counter
from collections.abc import Sequence

from engine.command.outside_run_rollback_error import OutsideRunRollbackError
from engine.command.outside_turn import OutsideTurn
from engine.command.outside_work import OutsideWork

MAX_ROUNDS = 20
SINGLE_RUN_REASON = "this command runs only once"
SERVER_THREAD_REASON = "this ran on a server thread"
MAX_ROUNDS_REASON = f"this command already asked {MAX_ROUNDS} times"


class OutsideRuns:
    """Tracks outside work and its answers across command rounds."""

    def __init__(self, closed: bool = True, plugin_script: str = "", closed_reason: str = SINGLE_RUN_REASON) -> None:
        self.closed, self.plugin_script, self.closed_reason = closed, plugin_script, closed_reason
        self.rounds = 0
        self.turn_counts: Counter[tuple[str, str]] = Counter()
        self.answers: dict[tuple[str, str, int], Sequence[object]] = {}
        self.unfinished: OutsideRunRollbackError | None = None

    @property
    def is_plugin_script(self) -> bool:
        return bool(self.plugin_script)

    def next_round(self) -> "OutsideRuns":
        self.rounds += 1
        self.turn_counts.clear()
        self.unfinished = None
        if self.rounds > MAX_ROUNDS and not self.closed:
            self.closed, self.closed_reason = True, MAX_ROUNDS_REASON
        return self

    def close(self) -> None:
        self.closed = True

    def turn(self, form: str, log_name: str) -> OutsideTurn:
        position = self.turn_counts[(form, log_name)]
        self.turn_counts[(form, log_name)] += 1
        return OutsideTurn(form, log_name, position, self.answers.get((form, log_name, position)))

    def record(self, turn: OutsideTurn, answers: Sequence[object]) -> None:
        self.answers[(turn.form, turn.log_name, turn.position)] = answers

    def rollback(self, work: OutsideWork) -> OutsideRunRollbackError:
        self.unfinished = OutsideRunRollbackError(work)
        return self.unfinished

    def refuse_unfinished_work(self) -> None:
        if self.unfinished is not None:
            raise self.unfinished
