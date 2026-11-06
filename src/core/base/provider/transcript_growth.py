from pathlib import Path

from core.base.provider.transcript_tail import TAIL_BYTES


class TranscriptGrowth:
    """The whole lines a session file gained: the first read takes the last 256 KiB and each later one only what
    the file gained since, up to its last whole line, and none when its size has not changed. A file that shrank
    or gained more than 256 KiB is read from its last 256 KiB again."""

    def __init__(self, path: Path) -> None:
        self.path = path
        self.offset: int | None = None
        self.seen_size = -1

    def new_lines(self) -> list[str]:
        if not self.path.is_file():
            return []
        size = self.path.stat().st_size
        if size == self.seen_size:
            return []
        is_added = self.offset is not None and self.offset <= size and size - self.offset <= TAIL_BYTES
        start = self.offset if is_added and self.offset is not None else max(size - TAIL_BYTES, 0)
        with self.path.open("rb") as transcript:
            transcript.seek(start)
            data = transcript.read()
        length = data.rfind(b"\n") + 1
        text_bytes = data[:length]
        if start > 0 and not is_added:
            text_bytes = text_bytes.split(b"\n", 1)[1] if b"\n" in text_bytes else b""
        self.offset, self.seen_size = start + length, size
        return text_bytes.decode(errors="replace").splitlines()
