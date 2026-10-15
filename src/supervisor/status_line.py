import json
from pathlib import Path


class StatusLine:
    """The journal's line under the agent's screen, drawn by Claude Code's own status line from a file the supervisor keeps: the project and environment, then the viewer's URL. Nothing is pinned to the screen, so the terminal scrolls back as it always does."""

    def __init__(self, project: str, environment: str, root: Path) -> None:
        self.project, self.environment = project, environment
        self.path = root / ".journal" / "runtime" / "status-line"
        self.url = ""

    def begin(self) -> None:
        self.write()

    def set_url(self, url: str) -> None:
        self.url = url
        self.write()

    def text(self) -> str:
        return f"agent-journal · {self.project} · {self.environment} · {self.url or 'journal starting…'}"

    def write(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(self.text())

    def settings(self) -> str:
        """The settings handed to Claude Code at launch: its status line reads the file."""
        return json.dumps({"statusLine": {"type": "command", "command": f"cat '{self.path}'"}})
