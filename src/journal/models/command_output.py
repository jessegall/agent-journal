from dataclasses import dataclass

from journal.events.rows.row_resolved import RowResolved
from journal.models.scoped import Scoped


@dataclass(frozen=True)
class CommandOutput(Scoped):
    """A shell line the runner ran, numbered by its row: the agent's own command, the folder holding each part's output, and, once it was moved to the background, how it ended; an end a standing wait names is told by the wait's own end. Lines about it name only its number."""

    chain: str = ""
    command: str = ""
    session: str = ""
    folder: str = ""
    moved: bool = False
    ended: bool = False
    status: int = 0
    is_announced: bool = False

    def headline(self) -> str:
        first, *remainder = self.command.splitlines() or [""]
        return f"{first} (and {len(remainder)} more lines)" if remainder else first

    def backgrounded(self) -> "CommandOutput":
        return self.with_(moved=True)

    def ended_with(self, status: int, time: float) -> "CommandOutput":
        ended = self.with_(ended=True, status=status)
        return ended.with_event(RowResolved(environment_id=self.environment_id, time=time, ref=f"{self.table()}:{self.id}", outcome=ended.outcome()))

    def wait_end(self, status: int, time: float) -> "CommandOutput":
        return self.ended_with(status, time).announced()

    def announced(self) -> "CommandOutput":
        return self.with_(is_announced=True)

    def is_resolved(self) -> bool:
        return self.ended

    def ending(self) -> str:
        return "finished" if self.status == 0 else f"failed with code {self.status}"

    def outcome(self) -> str:
        return f"output {self.id} {self.ending()}"
