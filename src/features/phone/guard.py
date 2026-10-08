from engine.extension import Extension

PHONE_GUARDS = Extension()


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
