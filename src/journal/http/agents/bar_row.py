from dataclasses import dataclass

from journal.features.shell.support.shell_record import PART_END, PART_START
from journal.models.entry import Entry

ACTIVITY_ROW_SECONDS = 10.0
DISPLAY_SECONDS = 0.25
FILE_CHANGE_DISPLAY_SECONDS = 1.0
TOOLS = ("ToolStarting", "ToolFinished")


@dataclass(frozen=True)
class BarRow:
    """What one entry adds to the status bar: a tool's call or a shell part's run, opening or closing. A shell command as a whole adds nothing, its parts do."""

    key: str
    verb: str
    detail: str
    time: float
    ended: bool
    added: int = 0
    removed: int = 0

    @staticmethod
    def is_shown(entry: Entry) -> bool:
        return entry.kind in (PART_START, PART_END) or (entry.kind in TOOLS and not entry.recorded_call().command)

    @classmethod
    def build(cls, entry: Entry) -> "BarRow":
        return cls.part_row(entry) if entry.kind in (PART_START, PART_END) else cls.tool_row(entry)

    @classmethod
    def part_row(cls, entry: Entry) -> "BarRow":
        changed = entry.data.get("changed", [])
        return cls(f"{entry.data['chain']} {entry.data['part']}", entry.data["doing"], entry.data["part"], entry.data["time"], entry.kind == PART_END, sum(c["added"] for c in changed), sum(c["removed"] for c in changed))

    @classmethod
    def tool_row(cls, entry: Entry) -> "BarRow":
        call = entry.recorded_call()
        tool, paths = entry.data.get("tool_name", ""), call.edited_paths or call.read_paths or ("",)
        path, (added, removed) = paths[0], call.operation.changed_lines()
        return cls(f"{tool} {path}".strip(), call.operation.activity() or tool.lower() or "working", path, entry.creation_time.timestamp(), entry.kind == "ToolFinished", added, removed)

    def counts(self) -> list[dict]:
        return [{"value": n, "prefix": sign, "color": color, "increments": True} for n, sign, color in ((self.added, "+", "green"), (self.removed, "-", "red")) if n]

    def item(self) -> dict:
        command, _, argument = self.detail[:80].partition(" ")
        detail = [{"value": word, "color": "muted"} for word in (command, argument) if word]
        return {"id": self.time, "key": self.key, "parts": [{"value": self.verb, "color": "gray"}, *detail], "time": self.time, "done": False, "for": 0, "clock": True, "hold": self.display_seconds(), "lingers": ACTIVITY_ROW_SECONDS}

    def display_seconds(self) -> float:
        return FILE_CHANGE_DISPLAY_SECONDS if self.added or self.removed else DISPLAY_SECONDS
