import json
import re

from engine.provider.peer_note import PeerNote
from engine.types.type_guards import is_mapping
from core.modules.claude_code.providers.support.claude_inbox import ENVELOPE

QUEUE_ROW = "queue-operation"
QUEUED = "enqueue"
UNKNOWN_SENDER = "another session"
ARRIVED = re.compile(rf"^<{ENVELOPE}\s+([^>]*)>(.*?)</{ENVELOPE}>$", re.S)
SENDER_NAME = re.compile(r'\bfrom-name="([^"]*)"')
SENDER_ADDRESS = re.compile(r'\bfrom="([^"]*)"')


class ClaudePeerNotes:
    """A message another session sent, read from the one row of a Claude Code transcript that queued it."""

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
        address = SENDER_ADDRESS.search(arrived[1])
        return [PeerNote(sender[1] if sender else UNKNOWN_SENDER, arrived[2].strip(), str(fields.get("timestamp", "")), address[1] if address else "")]
