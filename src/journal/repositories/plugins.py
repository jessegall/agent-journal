from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.models.plugin import Plugin
from journal.support.actor import Actor
from journal.support.not_found import NotFound
from journal.repositories.repository import Repository


class Plugins(Repository[Plugin]):
    """The plugins installed in the project, one row each, the same for every environment."""

    model = Plugin

    def __init__(self, connection: Connection, bus: Bus) -> None:
        super().__init__(connection, bus)
        self.live: list[Plugin] | None = None

    def save(self, row: Plugin, actor: Actor) -> Plugin:
        saved = super().save(row, actor)
        self.live = None
        return saved

    def delete(self, row: Plugin, actor: Actor) -> None:
        super().delete(row, actor)
        self.live = None

    def named(self, name: str) -> Plugin:
        found = self.where(name=name)
        if not found:
            raise NotFound(self.table, name)
        return found[0]

    def enabled(self) -> list[Plugin]:
        if self.live is None:
            self.live = [p for p in self.all() if p.enabled]
        return list(self.live)
