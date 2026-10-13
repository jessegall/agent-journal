from resources.base import USER
from resources.buttons import unspent
from resources.extension import Extension
from resources.plans import READY

PHONE_GUARDS = Extension()
WAITING_CARD = "waiting"
WAITED = ("question", "plan", "report", "doc")


class RecordGuard:
    """Where a phone's keys, codes, expiry and Face ID state are kept: in its row, as on a journal whose share server runs as its own user."""

    def read(self, n: int) -> dict:
        return {}

    def kept(self, n: int, fields: dict) -> dict:
        """Keeps what it guards of these fields and answers what the phone's row may hold."""
        return fields

    def drop(self, n: int) -> None:
        return None


def guard_of(record) -> RecordGuard:
    named = [given(record) for given in PHONE_GUARDS.each(record)]
    return named[-1] if named else RecordGuard()


def owed(row) -> bool:
    if row.type == "plan":
        return row.status == READY
    return row.type == "question" or USER not in row.seen or bool(unspent(row))
