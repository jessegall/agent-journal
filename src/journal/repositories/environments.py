from journal.db.connection import Connection
from journal.db.query import Query
from journal.events.bus import Bus
from journal.support.time_source import TimeSource
from journal.support.actor import Actor
from journal.models.all_models import AllModels
from journal.models.environment import Environment
from journal.support.missing_row import MissingRow
from journal.repositories.repository import Repository


class Environments(Repository[Environment]):
    """The project's environments, all kept in memory by name once read, at boot and after every write, since every request, hook and command asks for its environment by name; forgotten on every write of the table and again once that write is committed."""

    model = Environment

    def __init__(self, connection: Connection, bus: Bus, time_source: TimeSource) -> None:
        super().__init__(connection, bus, time_source)
        self.name_rows: dict[str, Environment] = {}

    def keyed(self, key: str) -> list[Environment]:
        return self.matching(key=key)

    def total(self) -> int:
        return self.counted(self.query())

    def namesakes(self, name: str, key: str) -> list[Environment]:
        return self.selected(self.query().filter(name=name).filter_unequal("key", key).order("id"))

    def lookup(self, name: str) -> Environment:
        return self.name_row(name) or self.save(Environment(name=name), Actor.system())

    def entered(self, name: str) -> int:
        with self.connection.unlisted():
            return self.existing(name).row_id

    def existing(self, name: str) -> Environment:
        environment = self.name_row(name)
        if environment is None:
            raise MissingRow("environment", name)
        return environment

    def name_row(self, name: str) -> Environment | None:
        return self.name_index().get(name)

    def name_index(self) -> dict[str, Environment]:
        if not self.name_rows:
            self.name_rows.update({environment.name: environment for environment in self.rows()})
        return self.name_rows

    def stored(self) -> None:
        super().stored()
        self.name_rows.clear()
        self.connection.commit_callback(self.name_rows.clear)

    def wipe(self, environment: Environment, actor: Actor) -> None:
        with self.connection.transaction():
            for model in AllModels.SCOPED:
                self.purged_rows(model, Query.build(model).filter(environment_id=environment.id), actor)
            self.delete(environment, actor)
