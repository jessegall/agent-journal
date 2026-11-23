from dataclasses import dataclass

SECTION_LINES = 15
LIMIT_OPTION = "--limit"


@dataclass(frozen=True)
class OverviewSection:
    """One command of the overview and what it printed, cut to its first lines so a long list does not fill the
    context; the rest is read by running the command itself. A command that names its own --limit, such as the
    active rules and memories, asked for that many rows and is shown whole."""

    command: str
    text: str

    def lines(self) -> str:
        lines = self.text.splitlines()
        if len(lines) <= SECTION_LINES or LIMIT_OPTION in self.command.split():
            return f"## {self.command}\n{self.text}"
        shown = "\n".join(lines[:SECTION_LINES])
        return f"## {self.command}\n{shown}\n{len(lines) - SECTION_LINES} more lines: journal {self.command}"
