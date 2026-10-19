from datetime import datetime

from journal.models.phone import Phone
from journal.repositories.scoped_repository import ScopedRepository


class Phones(ScopedRepository[Phone]):
    """The phones paired with this journal, looked up across its environments: a phone's request names none until its key is known."""

    model = Phone

    def live(self, now: datetime) -> list[Phone]:
        return [phone for phone in self.across_environments() if phone.is_live(now)]

    def by_key(self, key: str) -> Phone | None:
        """The phone whose key hashes to this; a key no phone holds finds none."""
        return next(iter(self.across_environments(key=key)), None)
