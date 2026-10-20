from journal.support.actor import Actor
from journal.models.count import Count
from journal.repositories.workflow_value_rows import WorkflowValueRows
from journal.support.value_name import ValueName


class Counts(WorkflowValueRows[Count]):
    model = Count

    def named(self, value: ValueName) -> Count:
        """The environment's count of the workflow by name, at zero when no node has started it yet."""
        rows = self.where(name=value.stored)
        return rows[0] if rows else Count(name=value.stored)

    def set(self, value: ValueName, to: int, by: Actor) -> Count:
        with self.connection.transaction():
            return self.save(self.named(value).with_(value=to), by)

    def begin(self, value: ValueName, by: Actor) -> Count:
        """The count at zero unless it is already kept."""
        with self.connection.transaction():
            standing = self.named(value)
            return standing if standing.id is not None else self.save(standing, by)

    def count_one(self, value: ValueName, by: Actor) -> Count:
        """One more, read and written in one transaction, so walks on other threads raising the same count lose no step."""
        with self.connection.transaction():
            return self.save(self.named(value).up(), by)
