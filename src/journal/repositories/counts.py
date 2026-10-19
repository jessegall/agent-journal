from journal.models.actor import Actor
from journal.models.count import Count
from journal.repositories.scoped_repository import ScopedRepository


class Counts(ScopedRepository[Count]):
    model = Count

    def named(self, session: str, name: str) -> Count:
        """The agent's count by name, at nought when no node has started it yet."""
        rows = self.where(session=session, name=name)
        return rows[0] if rows else Count(session=session, name=name)

    def set(self, session: str, name: str, value: int, by: Actor) -> Count:
        with self.connection.transaction():
            return self.save(self.named(session, name).with_(value=value), by)

    def begin(self, session: str, name: str, by: Actor) -> Count:
        """The count at nought unless it is already kept."""
        with self.connection.transaction():
            standing = self.named(session, name)
            return standing if standing.id is not None else self.save(standing, by)

    def count_one(self, session: str, name: str, by: Actor) -> Count:
        """One more, read and written in one transaction, so walks on other threads raising the same count lose no step."""
        with self.connection.transaction():
            return self.save(self.named(session, name).up(), by)

    def forget(self, session: str, by: Actor) -> None:
        """A session's counts gone with it."""
        for count in self.where(session=session):
            self.delete(count, by)
