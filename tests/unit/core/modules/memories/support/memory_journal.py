from dataclasses import dataclass
from pathlib import Path

from core.base.container import Container
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.journal_container import opened_container
from core.base.journal_home import JournalHome
from core.base.module.module_sync import ModuleSync

NOW = "2026-10-31T09:00:00+00:00"


@dataclass(frozen=True)
class MemoryJournal:
    """A synced journal for the memory module's unit tests: environment 1 with two agents, the first and the
    second."""

    container: Container
    first_agent: int
    second_agent: int

    @classmethod
    def synced(cls, folder: Path) -> "MemoryJournal":
        container = opened_container(JournalHome(folder))
        container.get(ModuleSync).run()
        database = container.get(Database)
        database.insert(Statement("INSERT INTO environments (creator_id, name, folder, created_at, updated_at) VALUES (1, 'main', '/work', ?, ?)", (NOW, NOW)))
        return cls(container, cls.agent(database, "s-1"), cls.agent(database, "s-2"))

    @staticmethod
    def agent(database: Database, session: str) -> int:
        actor_id = database.insert(Statement("INSERT INTO actors (creator_id, type, name, created_at, updated_at) VALUES (1, 'agent', ?, ?, ?)", (session, NOW, NOW)))
        database.insert(Statement("INSERT INTO agents (id, environment_id, creator_id, session, program, role, created_at, updated_at)"
                                  " VALUES (?, 1, 1, ?, 'claude', 'main', ?, ?)", (actor_id, session, NOW, NOW)))
        return actor_id

    @property
    def database(self) -> Database:
        return self.container.get(Database)
