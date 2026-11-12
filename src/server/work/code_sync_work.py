from engine.container.container import Container
from engine.database.auto_vacuum_upgrade import AutoVacuumUpgrade
from engine.database.database import Database
from engine.enums.log_level import LogLevel
from engine.journal.journal_home import JournalHome
from engine.log.system_log_writer import SystemLogWriter
from engine.time.clock import Clock
from engine.database.registry_table import RegistryTable
from engine.module.code_fingerprint import CodeFingerprint
from engine.module.module_finder import ModuleFinder
from engine.module.module_sync import ModuleSync
from server.work.round_work import RoundWork


class CodeSyncWork(RoundWork):
    """The first round as the server starts: when code changed, turns on auto vacuum for a database made before it,
    runs the migrations and writes the registry, before any request is taken, so no hook, tick or listener reads a
    table its code has outgrown. It runs
    on a container with no bindings of the old registry, since a class that registry names may have moved. A
    journal that was never synced stays for its install to sync."""

    def run(self, container: Container) -> None:
        row = RegistryTable(container.get(Database)).row()
        current = container.get(CodeFingerprint).text(container.get(ModuleFinder).modules())
        if row is not None and row["fingerprint"] != current:
            log = SystemLogWriter(container.get(JournalHome), container.get(Clock))
            AutoVacuumUpgrade(container.get(Database)).run(lambda line: log.write(LogLevel.INFORMATION, line))
            container.get(ModuleSync).run()
