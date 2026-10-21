from dataclasses import dataclass

from journal.events.rows.row_settled import RowSettled
from journal.models.scoped import Scoped


@dataclass(frozen=True)
class CommandOutput(Scoped):
    """A shell line the runner ran, numbered by its row: the agent's own command, the folder holding each part's output, and, once it was moved to the background, how it ended. Lines about it name only its number."""

    chain: str = ""
    command: str = ""
    session: str = ""
    folder: str = ""
    moved: bool = False
    ended: bool = False
    status: int = 0
    told: bool = False

    def headline(self) -> str:
        first, *rest = self.command.splitlines() or [""]
        return f"{first} (and {len(rest)} more lines)" if rest else first

    def moved_out(self) -> "CommandOutput":
        return self.with_(moved=True)

    def ended_with(self, status: int, at: float) -> "CommandOutput":
        ended = self.with_(ended=True, status=status)
        return ended.with_event(RowSettled(environment_id=self.environment_id, at=at, ref=f"{self.table()}:{self.id}", outcome=ended.came_to()))

    def told_of(self) -> "CommandOutput":
        return self.with_(told=True)

    def is_settled(self) -> bool:
        return self.ended

    def came_to(self) -> str:
        return f"output {self.id} {'finished' if self.status == 0 else f'failed with code {self.status}'}"
