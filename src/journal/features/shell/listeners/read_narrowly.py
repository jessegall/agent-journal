from pathlib import Path

from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.support.decision import Decision
from journal.repositories.setting_rows import SettingRows



class ReadNarrowly(AgentListener[ToolStarting]):
    """A file longer than the runner would show is not read whole: everything a tool returns stays in the context for good."""

    blocking = True

    def __init__(self, settings: SettingRows) -> None:
        self.settings = settings

    def handle(self, event: ToolStarting) -> Decision | None:
        from journal.features.shell.feature import Shell
        if event.tool != "Read" or event.input.get("limit") or event.input.get("offset"):
            return None
        cap = self.cap()
        lines = self.lines(Path(event.input.get("file_path", "")))
        return Decision.refuse(Shell.READ_THE_FILE_IN_PARTS.create(lines=lines, cap=cap).rendered()) if lines > 2 * cap else None

    def cap(self) -> int:
        from journal.features.shell.feature import Shell
        return int(self.settings.option(Shell.SHOWN))

    @staticmethod
    def lines(path: Path) -> int:
        if not path.is_file() or path.suffix.lower() in (".png", ".jpg", ".jpeg", ".gif", ".pdf", ".ipynb"):
            return 0
        with path.open("rb") as file:
            return sum(1 for _ in file)
