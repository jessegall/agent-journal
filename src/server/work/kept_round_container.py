from engine.container.container import Container
from engine.container.round_states import RoundStates
from engine.database.database import Database
from engine.database.registry_table import RegistryTable
from engine.database.registry_version import RegistryVersion
from engine.database.write_turns import WriteTurns
from engine.journal.journal_home import JournalHome
from engine.module.journal_container import synced_database_container

BACKGROUND_BUSY_TIMEOUT_SECONDS = 60.0


class KeptRoundContainer:
    """The container one background thread keeps for its life: one connection, one registry, one set of
    services; each round resets the RoundState services, and a new registry builds it once more."""

    def __init__(self, home: JournalHome, turns: WriteTurns | None = None) -> None:
        self.home = home
        self.turns = turns
        self.container: Container | None = None
        self.registry_version: RegistryVersion | None = None

    def for_round(self) -> Container:
        container = self.rebuilt() if self.container is None or self.registry_changed() else self.container
        for service in container.get(RoundStates).services():
            service.reset()
        return container

    def rebuilt(self) -> Container:
        self.close()
        database = Database.opened(self.home, self.turns)
        database.set_busy_timeout(BACKGROUND_BUSY_TIMEOUT_SECONDS)
        self.container = synced_database_container(self.home, database)
        self.registry_version = RegistryTable(database).version()
        return self.container

    def registry_changed(self) -> bool:
        return self.container is not None and RegistryTable(self.container.get(Database)).version() != self.registry_version

    def close(self) -> None:
        if self.container is None:
            return
        self.container.get(Database).close()
        self.container = None
