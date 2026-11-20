from engine.file.file_access import CODE_TREE_DEPTH, READ_LIMIT_BYTES, FileAccess
import difflib
from pathlib import Path

GIT_FOLDER = ".git"
FILE_LINES = 40
CONTEXT_LINES = 1
COMPARE_BYTES = 1024 * 1024


class PluginCodeDiff:
    """What a new version of a plugin changes in its files, as version 4 showed it: for each text file added,
    removed or changed, its unified diff cut to its first lines, and a note for a file that is not text."""

    def lines(self, old: Path, new: Path) -> list[str]:
        shown: list[str] = []
        for relative in sorted(self.files(old) | self.files(new)):
            shown.extend(self.file_lines(relative, old / relative, new / relative))
        return shown

    def files(self, folder: Path) -> set[str]:
        return {str(path.relative_to(folder)) for path in FileAccess.rglob(folder, "*", CODE_TREE_DEPTH) if FileAccess.is_file(path) and GIT_FOLDER not in path.relative_to(folder).parts}

    def file_lines(self, relative: str, old: Path, new: Path) -> list[str]:
        if self.is_large(old) or self.is_large(new):
            return self.byte_lines(relative, old, new, "too large for a text diff")
        old_text, new_text = self.text(old), self.text(new)
        if old_text is None or new_text is None:
            return self.byte_lines(relative, old, new, "not text")
        if old_text == new_text:
            return []
        diff = list(difflib.unified_diff(old_text.splitlines(), new_text.splitlines(), f"{relative} (installed)", f"{relative} (new)", lineterm="", n=CONTEXT_LINES))
        return diff if len(diff) <= FILE_LINES else [*diff[:FILE_LINES], f"... {len(diff) - FILE_LINES} more lines of {relative}"]

    @staticmethod
    def is_large(path: Path) -> bool:
        return FileAccess.exists(path) and FileAccess.stat(path).st_size > READ_LIMIT_BYTES

    def byte_lines(self, relative: str, old: Path, new: Path, reason: str) -> list[str]:
        if not (FileAccess.exists(old) and FileAccess.exists(new)):
            return self.presence(relative, old, new)
        return [f"changed {relative}: {reason}"] if self.has_changed_bytes(old, new) else []

    @staticmethod
    def has_changed_bytes(old: Path, new: Path) -> bool:
        size = FileAccess.stat(old).st_size
        return size != FileAccess.stat(new).st_size or any(
            FileAccess.bytes_range(old, offset, COMPARE_BYTES) != FileAccess.bytes_range(new, offset, COMPARE_BYTES)
            for offset in range(0, size, COMPARE_BYTES)
        )

    @staticmethod
    def presence(relative: str, old: Path, new: Path) -> list[str]:
        if FileAccess.exists(old) and not FileAccess.exists(new):
            return [f"removed {relative}"]
        return [f"added {relative}"] if FileAccess.exists(new) and not FileAccess.exists(old) else []

    @staticmethod
    def text(path: Path) -> str | None:
        if not FileAccess.exists(path):
            return ""
        try:
            return FileAccess.read(path)
        except UnicodeDecodeError:
            return None
