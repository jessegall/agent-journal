from engine.container.container import Container
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.hosting.hosted_file import HostedFile
from engine.hosting.hosting import Hosting
from engine.database.database import Database
from engine.database.shared_tables import SharedTables
from engine.event.written_events import WrittenEvents
from engine.journal.journal_home import JournalHome
from engine.model.state_book import StateBook
from engine.module.module_sync import ModuleSync
from engine.registry.registry import Registry
from engine.process.plugin_script_processes import PluginScriptProcesses
from engine.database.write_turns import WriteTurns


def opened_container(home: JournalHome, turns: WriteTurns | None = None) -> Container:
    return database_container(home, Database.opened(home, turns))


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
    container.bind(Hosting, HostedFile.shared_hosting(home))
    container.bind(PluginScriptProcesses, PluginScriptProcesses.shared(home))
    container.bind(SharedTables, SharedTables.shared(home))
    container.bind(WrittenEvents, WrittenEvents.shared())
    return container


def synced_container(home: JournalHome, turns: WriteTurns | None = None) -> Container:
    return synced_database_container(home, Database.opened(home, turns))


def synced_database_container(home: JournalHome, database: Database) -> Container:
    container = database_container(home, database)
    registry = Registry.read(container.get(Database))
    container.bind(Registry, registry)
    container.bind(StateBook, registry.state_book())
    container.bind(HelperTypeBook, registry.helper_type_book())
    registry.bind(container)
    return container
