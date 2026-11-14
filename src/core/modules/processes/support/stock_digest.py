import hashlib
import json

from engine.skill.skill_digest import DIGEST_CHARACTERS
from core.modules.processes.support.reading.stock_reader_edits import READER_FIELDS
from core.modules.processes.support.stock_reader import StockReader



class StockDigest:
    """A short fingerprint of what a shipped stock reader reads: its reader fields, in no particular order, so a
    stored row can tell whether the shipped entry changed since the core last wrote it."""

    @staticmethod
    def digest(stock: StockReader) -> str:
        reader = stock.applied(None)
        fields = {field: getattr(reader, field) for field in sorted(READER_FIELDS)}
        return hashlib.sha256(json.dumps(fields, sort_keys=True, default=str).encode()).hexdigest()[:DIGEST_CHARACTERS]
