from datetime import datetime, timezone
from pathlib import Path

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.command import Command
from core.base.command.context import Context
from core.base.container import Container
from core.base.database.core_tables_migration import CORE_MIGRATIONS
from core.base.database.database import Database
from core.base.database.schema import Schema
from core.base.database.statement import Statement
from core.base.journal_home import JournalHome
from core.base.model.tables import Tables
from core.base.registry.registry import Registry
from core.base.timestamp import Timestamp

TIMESTAMP = Timestamp(datetime(2026, 10, 31, 9, tzinfo=timezone.utc))
ITEMS = ("CREATE TABLE items (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE, state TEXT NOT NULL, version INTEGER NOT NULL,"
         " metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT")


def sample_container(folder: Path, registry: Registry) -> Container:
    """A container on a temporary database with the core's tables and an items table, for unit tests of the core."""
    home = JournalHome(folder)
    database = Database.opened(home)
    Schema(database, Tables()).migrate([CORE_MIGRATIONS])
    database.update(Statement(ITEMS))
    container = Container()
    container.bind(JournalHome, home)
    container.bind(Database, database)
    container.bind(Registry, registry)
    return container


def context(command: Command[object]) -> Context:
    return Context(Actor(7, ActorType.AGENT), TIMESTAMP, command)


def empty_registry() -> Registry:
    return Registry("abc", {}, {}, {}, (), ())
