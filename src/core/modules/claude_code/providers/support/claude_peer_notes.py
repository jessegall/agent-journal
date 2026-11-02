import json
import re
from collections.abc import Sequence
from pathlib import Path

from core.base.provider.peer_note import PeerNote
from core.base.type_guards import is_mapping
from core.modules.claude_code.providers.support.claude_inbox import ENVELOPE

QUEUE_ROW = "queue-operation"
QUEUED = "enqueue"
TAIL_BYTES = 256 * 1024
UNKNOWN_SENDER = "another session"
ARRIVED = re.compile(rf"^<{ENVELOPE}\s+([^>]*)>(.*?)</{ENVELOPE}>$", re.S)
SENDER_NAME = re.compile(r'\bfrom-name="([^"]*)"')
SENDER_ADDRESS = re.compile(r'\bfrom="([^"]*)"')


class ClaudePeerNotes:
    """The messages other sessions sent, read from the end of a Claude Code transcript, where each is queued as one
    row; only the end is read, since this runs at every hook."""

    def __init__(self, path: Path) -> None:
        self.path = path

    def notes(self) -> Sequence[PeerNote]:
        return [note for line in self.tail_lines() for note in self.note(line)]

    def tail_lines(self) -> list[str]:
        if not self.path.is_file():
            return []
        size = self.path.stat().st_size
        with self.path.open("rb") as transcript:
            transcript.seek(max(size - TAIL_BYTES, 0))
            lines = transcript.read().decode(errors="replace").splitlines()
        return lines if size <= TAIL_BYTES else lines[1:]

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
