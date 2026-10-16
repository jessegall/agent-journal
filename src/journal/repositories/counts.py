from journal.models.actor import Actor
from journal.models.count import Count
from journal.repositories.scoped_repository import ScopedRepository


class Counts(ScopedRepository[Count]):
    model = Count

    def named(self, session: str, name: str) -> Count:
        """The agent's count by name, at nought when no node has started it yet."""
        rows = self.where(environment_id=self.scope.id, session=session, name=name)
        return rows[0] if rows else Count(environment_id=self.scope.id, session=session, name=name)

    def set(self, session: str, name: str, value: int, by: Actor) -> Count:
        return self.save(self.named(session, name).with_(value=value), by)

    def forget(self, session: str, by: Actor) -> None:
        """A session's counts gone with it."""
        for count in self.where(environment_id=self.scope.id, session=session):
            self.delete(count, by)
