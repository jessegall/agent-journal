import json
from pathlib import Path


class StatusLine:
    """Claude Code's status line, handed to it at launch: it runs the journal's status script, which keeps the session's status JSON for the context, the model and the plan windows, and prints nothing, since the band says where the agent is."""

    def __init__(self, root: Path) -> None:
        self.root = root

    def settings(self) -> str:
        return json.dumps({"statusLine": {"type": "command", "command": f"sh '{self.script}'", "padding": 0}})

    @property
    def script(self) -> Path:
        return self.root / ".journal" / "src" / "journal" / "hooks" / "status.sh"
