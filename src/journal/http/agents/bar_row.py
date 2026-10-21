from dataclasses import dataclass

from journal.features.shell.support.shell_record import RAN, RUNNING
from journal.models.entry import Entry

LINGERS = 10.0
TOOLS = ("ToolStarting", "ToolFinished")


@dataclass(frozen=True)
class BarRow:
    """What one entry adds to the status bar: a tool's call or a shell part's run, opening or closing. A shell command as a whole adds nothing, its parts do."""

    key: str
    verb: str
    detail: str
    at: float
    ended: bool

    @staticmethod
    def is_shown(entry: Entry) -> bool:
        return entry.kind in (RUNNING, RAN) or (entry.kind in TOOLS and entry.data.get("tool_name") != "Bash")

    @classmethod
    def of(cls, entry: Entry) -> "BarRow":
        return cls.of_part(entry) if entry.kind in (RUNNING, RAN) else cls.of_tool(entry)

    @classmethod
    def of_part(cls, entry: Entry) -> "BarRow":
        return cls(f"{entry.data['chain']} {entry.data['part']}", entry.data["doing"], entry.data["part"], entry.data["at"], entry.kind == RAN)

    @classmethod
    def of_tool(cls, entry: Entry) -> "BarRow":
        tool, paths = entry.data.get("tool_name", ""), entry.recorded_call().get("written_paths") or entry.recorded_call().get("read_paths") or [""]
        path = paths[0]
        return cls(f"{tool} {path}".strip(), tool.lower() or "working", path, entry.created_at.timestamp(), entry.kind == "ToolFinished")

    def item(self) -> dict:
        detail = [{"value": self.detail[:80], "color": "muted"}] if self.detail else []
        return {"id": self.at, "key": self.key, "parts": [{"value": self.verb, "color": "gray"}, *detail], "at": self.at, "done": False, "for": 0, "clock": True, "hold": 0.25, "lingers": LINGERS}
