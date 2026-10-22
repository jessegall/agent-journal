from dataclasses import dataclass, replace

from journal.support.command_shape import SETUP_COMMANDS
from journal.features.shell.support.shell_record import PART_END, PART_START
from journal.models.entry import Entry

ACTIVITY_ROW_SECONDS = 10.0
DISPLAY_SECONDS = 0.25
FILE_CHANGE_DISPLAY_SECONDS = 1.0
FILE_SECONDS = 0.5
FILE_ROLL_SECONDS = 2.5
LAST_FILE_EXTRA_SECONDS = 1.0
FILE_STEP_SECONDS = 0.001
TOOLS = ("ToolStarting", "ToolFinished")


@dataclass(frozen=True)
class BarRow:
    """What one entry adds to the status bar: a tool's call or a shell part's run, opening or closing. A shell command as a whole adds nothing, its parts do; every path it shows is named from the project's folder; a part that changed files is followed by one item per file, editing it with the lines added and removed so far, half a second each, or less so the roll fits two and a half seconds, the last staying a second more."""

    key: str
    verb: str
    detail: str
    time: float
    ended: bool
    added: int = 0
    removed: int = 0
    files: tuple[tuple[str, int, int], ...] = ()

    @classmethod
    def shown(cls, entries: list[Entry]) -> list[Entry]:
        return [entry for entry in entries if cls.is_shown(entry)]

    @staticmethod
    def is_shown(entry: Entry) -> bool:
        if entry.kind in (PART_START, PART_END):
            return entry.data["part"].split(" ", 1)[0] not in SETUP_COMMANDS
        return entry.kind in TOOLS and not entry.recorded_call().command

    @classmethod
    def build(cls, entry: Entry) -> "BarRow":
        return cls.part_row(entry) if entry.kind in (PART_START, PART_END) else cls.tool_row(entry)

    @classmethod
    def part_row(cls, entry: Entry) -> "BarRow":
        changed = entry.data.get("changed", [])
        files = tuple((c["path"], c["added"], c["removed"]) for c in changed)
        return cls(f"{entry.data['chain']} {entry.data['part']}", entry.data["doing"], entry.data["part"], entry.data["time"], entry.kind == PART_END, sum(c["added"] for c in changed), sum(c["removed"] for c in changed), files)

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
        detail = [{"value": word, "color": color} for word, color in ((command, "command"), (argument, "muted")) if word]
        return {"id": self.time, "key": self.key, "parts": [{"value": self.verb, "color": "gray"}, *detail], "time": self.time, "done": False, "for": 0, "clock": True, "hold": self.display_seconds(), "lingers": ACTIVITY_ROW_SECONDS}

    def relative(self, root: str) -> "BarRow":
        prefix = root.rstrip("/") + "/"
        return replace(self, detail=self.detail.replace(prefix, ""), files=tuple((path.replace(prefix, ""), added, removed) for path, added, removed in self.files))

    def file_items(self) -> list[dict]:
        file_seconds = min(FILE_SECONDS, FILE_ROLL_SECONDS / len(self.files)) if self.files else 0.0
        items, added, removed = [], 0, 0
        for i, (path, file_added, file_removed) in enumerate(self.files):
            added, removed = added + file_added, removed + file_removed
            closing = i == len(self.files) - 1
            row = BarRow(f"{self.key} {path}", "editing", path, self.time + (i + 1) * FILE_STEP_SECONDS, True, added, removed)
            items.append({**row.item(), "parts": [*row.item()["parts"], *row.counts()], "done": True, "clock": False, "group": self.key, "hold": file_seconds + (LAST_FILE_EXTRA_SECONDS if closing else 0.0)})
        return items

    def display_seconds(self) -> float:
        return FILE_CHANGE_DISPLAY_SECONDS if self.added or self.removed else DISPLAY_SECONDS
