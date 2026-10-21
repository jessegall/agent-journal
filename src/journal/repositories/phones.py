from datetime import datetime

from journal.models.phone import Phone
from journal.repositories.scoped_repository import ScopedRepository
from journal.support.missing_row import MissingRow


class Phones(ScopedRepository[Phone]):
    """The phones paired with this journal, looked up across its environments: a phone's request names none until its key is known."""

    model = Phone

    def active(self, time: datetime) -> list[Phone]:
        return [phone for phone in self.global_matching() if phone.is_active(time)]

    def all_phones(self, id: int) -> Phone:
        rows = self.global_matching(id=id)
        if not rows:
            raise MissingRow(f"no phone {id}")
        return rows[0]

    def key_match(self, key: str) -> Phone | None:
        return next(iter(self.global_matching(key=key)), None)
