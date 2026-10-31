from core.base.container import Container
from core.base.database.database import Database
from core.base.journal_home import JournalHome
from core.base.registry.registry import Registry


def opened_container(home: JournalHome) -> Container:
    return database_container(home, Database.opened(home))


def database_container(home: JournalHome, database: Database) -> Container:
    container = Container()
    container.bind(JournalHome, home)
    container.bind(Database, database)
    return container


def synced_container(home: JournalHome) -> Container:
    return synced_database_container(home, Database.opened(home))


def synced_database_container(home: JournalHome, database: Database) -> Container:
    container = database_container(home, database)
    registry = Registry.read(container.get(Database))
    container.bind(Registry, registry)
    registry.bind(container)
    return container
