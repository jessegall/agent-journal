from dataclasses import dataclass

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

    def headline(self) -> str:
        """The command's first line, and how many more it has: a heredoc is never printed whole."""
        first, *rest = self.command.splitlines() or [""]
        return f"{first} (and {len(rest)} more lines)" if rest else first

    def moved_out(self) -> "CommandOutput":
        return self.with_(moved=True)

    def ended_with(self, status: int) -> "CommandOutput":
        return self.with_(ended=True, status=status)
