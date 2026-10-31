from core.base.container import Container
from core.base.database.database import Database
from core.base.journal_home import JournalHome
from core.base.registry.registry import Registry


def opened_container(home: JournalHome) -> Container:
    container = Container()
    container.bind(JournalHome, home)
    container.bind(Database, Database.opened(home))
    return container


def synced_container(home: JournalHome) -> Container:
    container = opened_container(home)
    registry = Registry.read(container.get(Database))
    container.bind(Registry, registry)
    registry.bind(container)
    return container
