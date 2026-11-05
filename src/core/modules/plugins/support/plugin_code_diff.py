from core.base.file_access import FileAccess
import difflib
from pathlib import Path

GIT_FOLDER = ".git"
FILE_LINES = 40
CONTEXT_LINES = 1


class PluginCodeDiff:
    """What a new version of a plugin changes in its files, as version 4 showed it: for each text file added,
    removed or changed, its unified diff cut to its first lines, and a note for a file that is not text."""

    def lines(self, old: Path, new: Path) -> list[str]:
        shown: list[str] = []
        for relative in sorted(self.files(old) | self.files(new)):
            shown.extend(self.file_lines(relative, old / relative, new / relative))
        return shown

    def files(self, folder: Path) -> set[str]:
        return {str(path.relative_to(folder)) for path in folder.rglob("*") if path.is_file() and GIT_FOLDER not in path.relative_to(folder).parts}

    def file_lines(self, relative: str, old: Path, new: Path) -> list[str]:
        old_text, new_text = self.text(old), self.text(new)
        if old_text is None or new_text is None:
            return [f"changed {relative}: not text"] if self.has_changed_bytes(old, new) else self.presence(relative, old, new)
        if old_text == new_text:
            return []
        diff = list(difflib.unified_diff(old_text.splitlines(), new_text.splitlines(), f"{relative} (installed)", f"{relative} (new)", lineterm="", n=CONTEXT_LINES))
        return diff if len(diff) <= FILE_LINES else [*diff[:FILE_LINES], f"... {len(diff) - FILE_LINES} more lines of {relative}"]

    @staticmethod
    def has_changed_bytes(old: Path, new: Path) -> bool:
        return old.exists() and new.exists() and FileAccess.shared().binary(old) != FileAccess.shared().binary(new)

    @staticmethod
    def presence(relative: str, old: Path, new: Path) -> list[str]:
        if old.exists() and not new.exists():
            return [f"removed {relative}"]
        return [f"added {relative}"] if new.exists() and not old.exists() else []

    @staticmethod
    def text(path: Path) -> str | None:
        if not path.exists():
            return ""
        try:
            return FileAccess.shared().read(path)
        except UnicodeDecodeError:
            return None
