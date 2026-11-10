from pathlib import Path

TAIL_BYTES = 256 * 1024


class TranscriptTail:
    """The last lines of a log file, read from its end so that a read made at every hook or poll costs the same
    however long the file has grown: at least the last 256 KiB, a window that doubles until it holds one more
    line than the count asked, which drops a line cut by the window's start; a missing file has none."""

    def __init__(self, path: Path) -> None:
        self.path = path

    def first_line(self) -> str:
        with self.path.open(encoding="utf-8") as log:
            return log.readline()

    def read_remainder(self, offset: int) -> bytes:
        with self.path.open("rb") as log:
            log.seek(offset)
            return log.read()

    def lines(self, count: int = 0) -> list[str]:
        if not self.path.is_file():
            return []
        size = self.path.stat().st_size
        window = TAIL_BYTES
        while True:
            lines = self.tail_lines(window)
            if size <= window or len(lines) > count:
                return lines
            window *= 2

    def tail_lines(self, window: int) -> list[str]:
        if not self.path.is_file():
            return []
        size = self.path.stat().st_size
        with self.path.open("rb") as log:
            log.seek(max(size - window, 0))
            lines = log.read().decode(errors="replace").splitlines()
        return lines if size <= window else lines[1:]
