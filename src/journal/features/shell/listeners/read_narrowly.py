from pathlib import Path

from journal.events.agent.tool_starting import ToolStarting
from journal.features.agent_listener import AgentListener
from journal.hooks.decision import Decision
from journal.repositories.settings import PROJECT, Settings

SHOWN = "shell.shown_lines"
"""The lines of a command's output, or of a file, that the agent is shown in one go: the first and last so many."""


class ReadNarrowly(AgentListener[ToolStarting]):
    """A file longer than the runner would show is not read whole: everything a tool returns stays in the context for good."""

    blocking = True

    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def handle(self, event: ToolStarting) -> Decision | None:
        from journal.features.shell.feature import Shell
        if event.tool != "Read" or event.input.get("limit") or event.input.get("offset"):
            return None
        cap = self.cap()
        lines = self.lines(Path(event.input.get("file_path", "")))
        return Decision.refuse(Shell.NARROW.about(lines=lines, cap=cap).rendered()) if lines > 2 * cap else None

    def cap(self) -> int:
        return int(self.settings.get(PROJECT, SHOWN, 200))

    @staticmethod
    def lines(path: Path) -> int:
        if not path.is_file() or path.suffix.lower() in (".png", ".jpg", ".jpeg", ".gif", ".pdf", ".ipynb"):
            return 0
        with path.open("rb") as file:
            return sum(1 for _ in file)
