from datetime import datetime

from journal.models.secret import Secret
from journal.repositories.repository import Repository


class Secrets(Repository[Secret]):
    model = Secret

    def active(self) -> list[Secret]:
        return [s for s in self.all() if s.deleted_at is None]

    def expired_logins(self, time: datetime) -> list[Secret]:
        return [s for s in self.active() if s.is_login_expired(time)]

    def title_matches(self, value: str) -> list[Secret]:
        return [s for s in self.active() if str(s.id) == value or s.title.lower() == value.lower()]

    def stale_retired(self, cutoff: datetime) -> list[Secret]:
        return [s for s in self.all() if s.deleted_at is not None and s.deleted_at < cutoff]
