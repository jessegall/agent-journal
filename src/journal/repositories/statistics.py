from journal.support.actor import Actor
from journal.models.statistic import Statistic
from journal.repositories.repository import Repository


class Statistics(Repository[Statistic]):
    model = Statistic

    def under(self, prefix: str) -> dict[str, int]:
        """Every statistic whose key starts with the prefix, by key; one never counted is not there."""
        return {row.key: row.value for row in self.selected("key >= ? AND key < ? ORDER BY key", (prefix, prefix + "\uffff"))}

    def counted(self, key: str, by: Actor) -> Statistic:
        """One more, read and written under the write lock."""
        with self.connection.transaction():
            return self.save(self.of(key).with_(value=self.of(key).value + 1), by)

    def set(self, key: str, value: int, by: Actor) -> Statistic:
        with self.connection.transaction():
            return self.save(self.of(key).with_(value=value), by)

    def of(self, key: str) -> Statistic:
        """The statistic of that key, a fresh one at nought before anything counted it."""
        found = self.where(key=key)
        return found[0] if found else Statistic(key=key)
