from pathlib import Path

from core.base.provider.transcript_tail import TAIL_BYTES, TranscriptTail


class TranscriptGrowth:
    """Read complete new lines from a transcript in bounded ranges."""

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
        data = TranscriptTail(self.path).read_from(start)
        length = data.rfind(b"\n") + 1
        text_bytes = data[:length]
        if start > 0 and not is_added:
            text_bytes = text_bytes.split(b"\n", 1)[1] if b"\n" in text_bytes else b""
        self.offset, self.seen_size = start + length, size
        return text_bytes.decode(errors="replace").splitlines()
