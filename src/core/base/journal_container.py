from core.base.container import Container
from core.base.agent_type_book import AgentTypeBook
from core.base.database.database import Database
from core.base.journal_home import JournalHome
from core.base.model.state_book import StateBook
from core.base.module.module_sync import ModuleSync
from core.base.registry.registry import Registry
from core.base.plugin_script_processes import PluginScriptProcesses


def opened_container(home: JournalHome) -> Container:
    return database_container(home, Database.opened(home))


def sync_modules(home: JournalHome) -> None:
    container = opened_container(home)
    try:
        container.get(ModuleSync).run()
    finally:
        container.get(Database).close()


def database_container(home: JournalHome, database: Database) -> Container:
    container = Container()
    container.bind(JournalHome, home)
    container.bind(Database, database)
    container.bind(PluginScriptProcesses, PluginScriptProcesses.shared(home))
    return container


def synced_container(home: JournalHome) -> Container:
    return synced_database_container(home, Database.opened(home))


def synced_database_container(home: JournalHome, database: Database) -> Container:
    container = database_container(home, database)
    registry = Registry.read(container.get(Database))
    container.bind(Registry, registry)
    container.bind(StateBook, registry.state_book())
    container.bind(AgentTypeBook, registry.agent_type_book())
    registry.bind(container)
    return container
