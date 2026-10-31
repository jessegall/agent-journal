from typing import TextIO

from core.base.cli.console import REFUSED_CODE, SUCCESS_CODE
from core.base.subcommand.output import Output
from core.base.model.tables import Tables
from core.base.module.module_error import ModuleError
from core.base.module.module_sync import ModuleSync

SYNC_ARGV = ["module", "sync"]


class ModuleSyncLine:
    """Runs `journal module sync`, the one command line that works while the registry is stale or missing, and
    prints what the sync found and changed, or why it refused."""

    def __init__(self, sync: ModuleSync, tables: Tables) -> None:
        self.sync, self.tables = sync, tables

    def run(self, argv: list[str], stream: TextIO) -> int:
        output = Output(self.tables, "--json" in argv, stream)
        try:
            report = self.sync.run()
        except ModuleError as error:
            output.error(str(error))
            return REFUSED_CODE
        output.line(report.text)
        return SUCCESS_CODE
