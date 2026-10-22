from dataclasses import dataclass

from journal.features.shell.support.shell_record import PART_END, PART_START
from journal.models.entry import Entry

ACTIVITY_ROW_SECONDS = 10.0
TOOLS = ("ToolStarting", "ToolFinished")


@dataclass(frozen=True)
class BarRow:
    """What one entry adds to the status bar: a tool's call or a shell part's run, opening or closing. A shell command as a whole adds nothing, its parts do."""

    key: str
    verb: str
    detail: str
    time: float
    ended: bool

    @staticmethod
    def is_shown(entry: Entry) -> bool:
        return entry.kind in (PART_START, PART_END) or (entry.kind in TOOLS and not entry.recorded_call().command)

    @classmethod
    def build(cls, entry: Entry) -> "BarRow":
        return cls.part_row(entry) if entry.kind in (PART_START, PART_END) else cls.tool_row(entry)

    @classmethod
    def part_row(cls, entry: Entry) -> "BarRow":
        return cls(f"{entry.data['chain']} {entry.data['part']}", entry.data["doing"], entry.data["part"], entry.data["time"], entry.kind == PART_END)

    @classmethod
    def tool_row(cls, entry: Entry) -> "BarRow":
        call = entry.recorded_call()
        tool, paths = entry.data.get("tool_name", ""), call.edited_paths or call.read_paths or ("",)
        path = paths[0]
        return cls(f"{tool} {path}".strip(), tool.lower() or "working", path, entry.creation_time.timestamp(), entry.kind == "ToolFinished")

    def item(self) -> dict:
        command, _, argument = self.detail[:80].partition(" ")
        detail = [{"value": word, "color": "muted"} for word in (command, argument) if word]
        return {"id": self.time, "key": self.key, "parts": [{"value": self.verb, "color": "gray"}, *detail], "time": self.time, "done": False, "for": 0, "clock": True, "hold": 0.25, "lingers": ACTIVITY_ROW_SECONDS}
