from datetime import datetime

from journal.models.phone import Phone
from journal.repositories.scoped_repository import ScopedRepository
from journal.support.not_found import NotFound


class Phones(ScopedRepository[Phone]):
    """The phones paired with this journal, looked up across its environments: a phone's request names none until its key is known."""

    model = Phone

    def live(self, time: datetime) -> list[Phone]:
        return [phone for phone in self.across_environments() if phone.is_live(time)]

    def anywhere(self, id: int) -> Phone:
        rows = self.across_environments(id=id)
        if not rows:
            raise NotFound(f"no phone {id}")
        return rows[0]

    def by_key(self, key: str) -> Phone | None:
        return next(iter(self.across_environments(key=key)), None)
