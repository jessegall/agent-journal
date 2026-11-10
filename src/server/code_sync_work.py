from engine.container.container import Container
from engine.database.database import Database
from engine.database.registry_table import RegistryTable
from engine.module.code_fingerprint import CodeFingerprint
from engine.module.module_finder import ModuleFinder
from engine.module.module_sync import ModuleSync
from server.round_work import RoundWork


class CodeSyncWork(RoundWork):
    """The first round as the server starts: runs the migrations and writes the registry when code changed,
    before any request is taken, so no hook, tick or listener reads a table its code has outgrown. It runs
    on a container with no bindings of the old registry, since a class that registry names may have moved. A
    journal that was never synced stays for its install to sync."""

    def run(self, container: Container) -> None:
        row = RegistryTable(container.get(Database)).row()
        current = container.get(CodeFingerprint).text(container.get(ModuleFinder).modules())
        if row is not None and row["fingerprint"] != current:
            container.get(ModuleSync).run()
