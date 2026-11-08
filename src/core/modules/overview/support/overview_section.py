from dataclasses import dataclass

SECTION_LINES = 15


@dataclass(frozen=True)
class OverviewSection:
    """One command of the overview and what it printed, cut to its first lines so a long list does not fill the
    context; the rest is read by running the command itself."""

    command: str
    text: str

    def lines(self) -> str:
        printed = self.text.splitlines()
        if len(printed) <= SECTION_LINES:
            return f"## {self.command}\n{self.text}"
        shown = "\n".join(printed[:SECTION_LINES])
        return f"## {self.command}\n{shown}\n{len(printed) - SECTION_LINES} more lines: journal {self.command}"
