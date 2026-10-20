from journal.support.actor import Actor
from journal.models.count import Count
from journal.repositories.scoped_repository import ScopedRepository


class Counts(ScopedRepository[Count]):
    model = Count

    def named(self, name: str) -> Count:
        """The environment's count by name, at zero when no node has started it yet."""
        rows = self.where(name=name)
        return rows[0] if rows else Count(name=name)

    def set(self, name: str, value: int, by: Actor) -> Count:
        with self.connection.transaction():
            return self.save(self.named(name).with_(value=value), by)

    def begin(self, name: str, by: Actor) -> Count:
        """The count at zero unless it is already kept."""
        with self.connection.transaction():
            standing = self.named(name)
            return standing if standing.id is not None else self.save(standing, by)

    def count_one(self, name: str, by: Actor) -> Count:
        """One more, read and written in one transaction, so walks on other threads raising the same count lose no step."""
        with self.connection.transaction():
            return self.save(self.named(name).up(), by)

    def of_workflow(self, workflow: int) -> dict[str, int]:
        """The counts a workflow keeps in this environment, by their names."""
        prefix = f"charts:{workflow}:"
        return {c.name[len(prefix):]: c.value for c in self.where_name_starts(prefix)}

    def where_name_starts(self, prefix: str) -> list[Count]:
        return self.selected("name LIKE ? ORDER BY id", (f"{prefix}%",))

    def everywhere_of_workflow(self, workflow: int) -> list[Count]:
        """A workflow's counts in every environment, for what ends them all."""
        return self.selected_everywhere("name LIKE ? ORDER BY id", (f"charts:{workflow}:%",))
