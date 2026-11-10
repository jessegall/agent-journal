from engine.time.clock import Clock
from datetime import datetime, timezone
from pathlib import Path

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.command import Command
from engine.command.context import Context
from engine.container.container import Container
from engine.database.core_tables_migration import CORE_MIGRATIONS
from engine.database.database import Database
from engine.database.schema import Schema
from engine.database.statement import Statement
from engine.journal.journal_home import JournalHome
from engine.model.tables import Tables
from core.base.registry.registry import Registry
from engine.time.timestamp import Timestamp

TIMESTAMP = Timestamp(datetime(2026, 10, 31, 9, tzinfo=timezone.utc))
ITEMS = ("CREATE TABLE items (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE, state TEXT NOT NULL, version INTEGER NOT NULL,"
         " metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT")
AGENTS = "CREATE TABLE agents (id INTEGER PRIMARY KEY, role TEXT NOT NULL, environment_id INTEGER NOT NULL) STRICT"


def sample_container(folder: Path, registry: Registry) -> Container:
    """A container on a temporary database with the core's tables and an items table, for unit tests of the core."""
    home = JournalHome(folder)
    database = Database.opened(home)
    Schema(database, Tables(), Clock()).migrate([CORE_MIGRATIONS])
    database.update(Statement(ITEMS))
    database.update(Statement(AGENTS))
    container = Container()
    container.bind(JournalHome, home)
    container.bind(Database, database)
    container.bind(Registry, registry)
    return container


def context(command: Command[object]) -> Context:
    return Context(Actor(7, ActorType.AGENT), TIMESTAMP, command)


def empty_registry() -> Registry:
    return Registry("abc", {}, {}, {}, (), ())
