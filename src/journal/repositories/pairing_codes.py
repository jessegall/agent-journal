from datetime import datetime

from journal.models.pairing_code import PairingCode
from journal.repositories.scoped_repository import ScopedRepository


class PairingCodes(ScopedRepository[PairingCode]):
    """The codes shown to pair a phone, looked up across this journal's environments: the phone that types one names none."""

    model = PairingCode

    def open(self, now: datetime) -> list[PairingCode]:
        return [code for code in self.across_environments() if code.is_open(now)]
