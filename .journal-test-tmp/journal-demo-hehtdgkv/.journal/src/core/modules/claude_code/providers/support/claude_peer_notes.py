import json
import re
from collections.abc import Sequence
from pathlib import Path

from core.base.provider.peer_note import PeerNote
from core.base.provider.transcript_tail import TAIL_BYTES
from core.base.type_guards import is_mapping
from core.modules.claude_code.providers.support.claude_inbox import ENVELOPE

QUEUE_ROW = "queue-operation"
QUEUED = "enqueue"
UNKNOWN_SENDER = "another session"
ARRIVED = re.compile(rf"^<{ENVELOPE}\s+([^>]*)>(.*?)</{ENVELOPE}>$", re.S)
SENDER_NAME = re.compile(r'\bfrom-name="([^"]*)"')
SENDER_ADDRESS = re.compile(r'\bfrom="([^"]*)"')


class ClaudePeerNotes:
    """The messages other sessions sent, read from the end of a Claude Code transcript, where each is queued
    as one row. This runs at every hook, so the first read takes the last 256 KiB and each later one only
    what the file gained since, up to its last text_bytes line, and none when its size has not changed."""

    def __init__(self, path: Path) -> None:
        self.path = path
        self.offset: int | None = None
        self.seen_size = -1

    def notes(self) -> Sequence[PeerNote]:
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
        return [note for line in text_bytes.decode(errors="replace").splitlines() for note in self.note(line)]

    @staticmethod
    def note(line: str) -> list[PeerNote]:
        if QUEUE_ROW not in line:
            return []
        try:
            fields: object = json.loads(line)
        except ValueError:
            return []
        if not is_mapping(fields) or fields.get("type") != QUEUE_ROW or fields.get("operation") != QUEUED:
            return []
        arrived = ARRIVED.match(str(fields.get("content", "")).strip())
        if arrived is None:
            return []
        sender = SENDER_NAME.search(arrived[1]) or SENDER_ADDRESS.search(arrived[1])
        return [PeerNote(sender[1] if sender else UNKNOWN_SENDER, arrived[2].strip(), str(fields.get("timestamp", "")))]
