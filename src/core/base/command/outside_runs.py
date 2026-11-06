from collections import Counter
from collections.abc import Sequence

from core.base.command.outside_run_rollback_error import OutsideRunRollbackError
from core.base.command.outside_turn import OutsideTurn
from core.base.command.outside_work import OutsideWork

OUTSIDE_LIMIT_ROUNDS = 20
RUNS_ONCE_REASON = "this command runs only once"
NO_REQUEST_REASON = "this ran on a server thread"
ROUND_LIMIT_REASON = f"this command already asked {OUTSIDE_LIMIT_ROUNDS} times"


class OutsideRuns:
    """What one command's rounds know of its outside work: the answers across rounds, and how often this round reached
    each place. Closed means nothing raises, so what is still owed is skipped and a command always ends. It closes
    for a command that runs once, and after OUTSIDE_LIMIT_ROUNDS rounds."""

    def __init__(self, closed: bool = True, plugin_script: str = "", closed_reason: str = RUNS_ONCE_REASON) -> None:
        self.closed, self.plugin_script, self.closed_reason = closed, plugin_script, closed_reason
        self.rounds = 0
        self.reached: Counter[tuple[str, str]] = Counter()
        self.answers: dict[tuple[str, str, int], Sequence[object]] = {}
        self.unfinished: OutsideRunRollbackError | None = None

    @property
    def from_plugin_script(self) -> bool:
        return bool(self.plugin_script)

    def next_round(self) -> "OutsideRuns":
        self.rounds += 1
        self.reached.clear()
        self.unfinished = None
        if self.rounds > OUTSIDE_LIMIT_ROUNDS and not self.closed:
            self.closed, self.closed_reason = True, ROUND_LIMIT_REASON
        return self

    def close(self) -> None:
        self.closed = True

    def turn(self, form: str, log_name: str) -> OutsideTurn:
        position = self.reached[(form, log_name)]
        self.reached[(form, log_name)] += 1
        return OutsideTurn(form, log_name, position, self.answers.get((form, log_name, position)))

    def record(self, turn: OutsideTurn, answers: Sequence[object]) -> None:
        self.answers[(turn.form, turn.log_name, turn.position)] = answers

    def rollback(self, work: OutsideWork) -> OutsideRunRollbackError:
        self.unfinished = OutsideRunRollbackError(work)
        return self.unfinished

    def refuse_unfinished_work(self) -> None:
        if self.unfinished is not None:
            raise self.unfinished
