import hashlib
import secrets

from journal.models.browser_session import BrowserSession
from journal.repositories.repository import Repository
from journal.support.actor import Actor


class BrowserSessions(Repository[BrowserSession]):
    """The browser sessions of a hosted journal, found by the key a session cookie carries."""

    model = BrowserSession

    def opened(self, person: int, name: str) -> str:
        key = secrets.token_urlsafe(32)
        self.save(BrowserSession(key_hash=self.hashed(key), person=person, name=name), Actor.user(person))
        return key

    def session(self, key: str) -> BrowserSession | None:
        rows = self.all_matching(key_hash=self.hashed(key)) if key else []
        return rows[0] if rows else None

    def closed(self, key: str) -> None:
        for row in self.all_matching(key_hash=self.hashed(key)) if key else []:
            self.delete(row, Actor.user(row.person))

    @staticmethod
    def hashed(key: str) -> str:
        return hashlib.sha256(key.encode()).hexdigest()
