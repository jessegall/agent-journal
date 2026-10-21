import difflib
from pathlib import Path

from journal.support.event_window import EventWindow

COMPARED = ("version", "program", "hears", "holds", "services", "settings", "skills")
LINE_LIMIT = 400


class PluginChanges:
    """What changes between two states of a plugin: in its manifest, and in its code, file by file."""

    @staticmethod
    def manifest(prior_row: dict, time: dict) -> list[str]:
        lines = []
        for key in COMPARED:
            previous, following = prior_row.get(key), time.get(key)
            if isinstance(following, (list, tuple)):
                previous, following = list(previous or ()), list(following)
                if key == "holds":
                    previous, following = [EventWindow.parsed(h).as_text() for h in previous], [EventWindow.parsed(h).as_text() for h in following]
                lines += [f"{key}: + {item}" for item in following if item not in previous] + [f"{key}: - {item}" for item in previous if item not in following]
            elif previous != following:
                lines.append(f"{key}: {previous} -> {following}")
        return lines

    @staticmethod
    def code(old: Path, new: Path) -> list[str]:
        files = sorted({p.relative_to(root) for root in (old, new) for p in root.rglob("*") if p.is_file() and ".git" not in p.relative_to(root).parts})
        lines = []
        for file in files:
            previous, following = PluginChanges.text(old / file), PluginChanges.text(new / file)
            lines += difflib.unified_diff(previous, following, f"a/{file}", f"b/{file}", lineterm="")
        return lines[:LINE_LIMIT] + ([f"... {len(lines) - LINE_LIMIT} more lines"] if len(lines) > LINE_LIMIT else [])

    @staticmethod
    def text(path: Path) -> list[str]:
        if not path.is_file():
            return []
        try:
            return path.read_text().splitlines()
        except UnicodeDecodeError:
            return ["(a binary file)"]
