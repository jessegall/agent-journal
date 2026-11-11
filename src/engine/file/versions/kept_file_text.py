from pathlib import Path

from engine.file.file_access import FileAccess


class KeptFileText:
    """Reads a file's text once, and again only when its size or change time differs."""

    def __init__(self) -> None:
        self.kept: dict[Path, tuple[tuple[int, int], str]] = {}

    def read(self, path: Path) -> str:
        status = path.stat()
        mark = (status.st_mtime_ns, status.st_size)
        if path not in self.kept or self.kept[path][0] != mark:
            self.kept[path] = (mark, FileAccess.shared().read(path))
        return self.kept[path][1]
