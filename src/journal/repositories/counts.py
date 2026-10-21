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
        """The count at the number given; one kept at it already is left as it is, so a reset on every tool use writes nothing."""
        with self.connection.transaction():
            snapshot = self.named(value)
            return snapshot if snapshot.id is not None and snapshot.value == to else self.save(snapshot.with_(value=to), by)

    def begin(self, value: ValueName, by: Actor) -> Count:
        """The count at zero unless it is already kept."""
        with self.connection.transaction():
            snapshot = self.named(value)
            return snapshot if snapshot.id is not None else self.save(snapshot, by)

    def count_one(self, value: ValueName, by: Actor) -> Count:
        """One more, read and written in one transaction, so walks on other threads raising the same count lose no step."""
        with self.connection.transaction():
            return self.save(self.named(value).up(), by)
