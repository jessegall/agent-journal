from datetime import datetime

from journal.models.phone_code import PhoneCode
from journal.repositories.scoped_repository import ScopedRepository


class PhoneCodes(ScopedRepository[PhoneCode]):
    """The codes shown to pair a phone, looked up across this journal's environments: the phone that types one names none."""

    model = PhoneCode

    def open(self, time: datetime) -> list[PhoneCode]:
        return [code for code in self.global_matching() if code.is_open(time)]

    def hash_matches(self, hashes: set[str], time: datetime) -> list[PhoneCode]:
        return [code for code in self.open(time) if hashes & {code.code, code.short}]
