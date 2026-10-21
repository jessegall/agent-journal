import difflib
from pathlib import Path

from journal.support.event_window import EventWindow

COMPARED = ("version", "program", "hears", "holds", "services", "settings", "skills")
MOST_LINES = 400


class PluginChanges:
    """What changes between two states of a plugin: in its manifest, and in its code, file by file."""

    @staticmethod
    def manifest(was: dict, now: dict) -> list[str]:
        lines = []
        for key in COMPARED:
            before, after = was.get(key), now.get(key)
            if isinstance(after, (list, tuple)):
                before, after = list(before or ()), list(after)
                if key == "holds":
                    before, after = [EventWindow.from_json(h).as_text() for h in before], [EventWindow.from_json(h).as_text() for h in after]
                lines += [f"{key}: + {item}" for item in after if item not in before] + [f"{key}: - {item}" for item in before if item not in after]
            elif before != after:
                lines.append(f"{key}: {before} -> {after}")
        return lines

    @staticmethod
    def code(old: Path, new: Path) -> list[str]:
        files = sorted({p.relative_to(root) for root in (old, new) for p in root.rglob("*") if p.is_file() and ".git" not in p.relative_to(root).parts})
        lines = []
        for file in files:
            before, after = PluginChanges.text(old / file), PluginChanges.text(new / file)
            lines += difflib.unified_diff(before, after, f"a/{file}", f"b/{file}", lineterm="")
        return lines[:MOST_LINES] + ([f"... {len(lines) - MOST_LINES} more lines"] if len(lines) > MOST_LINES else [])

    @staticmethod
    def text(path: Path) -> list[str]:
        if not path.is_file():
            return []
        try:
            return path.read_text().splitlines()
        except UnicodeDecodeError:
            return ["(a binary file)"]
