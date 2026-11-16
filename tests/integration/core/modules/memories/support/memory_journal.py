from dataclasses import dataclass
from pathlib import Path

from engine.container.container import Container
from engine.database.database import Database
from engine.database.statement import Statement
from engine.module.journal_container import opened_container
from engine.journal.journal_home import JournalHome
from engine.module.module_sync import ModuleSync

FIXED_TIME = "2026-10-31T09:00:00+00:00"


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
        database.insert(Statement("INSERT INTO environments (creator_id, name, folder, created_at, updated_at) VALUES (0, 'main', '/work', ?, ?)", (FIXED_TIME, FIXED_TIME)))
        return cls(container, cls.agent(database, 1, "s-1", "main"), cls.agent(database, 2, "s-2", "worker"))

    @staticmethod
    def agent(database: Database, agent_id: int, session: str, role: str) -> int:
        database.insert(Statement("INSERT INTO actors (id, creator_id, type, name, created_at, updated_at) VALUES (?, 0, 'agent', ?, ?, ?)", (agent_id, session, FIXED_TIME, FIXED_TIME)))
        database.insert(Statement("INSERT INTO agents (id, actor_id, environment_id, creator_id, session, program, role, created_at, updated_at)"
                                  " VALUES (?, ?, 1, 0, ?, 'claude', ?, ?, ?)", (agent_id, agent_id, session, role, FIXED_TIME, FIXED_TIME)))
        return agent_id

    @property
    def database(self) -> Database:
        return self.container.get(Database)
