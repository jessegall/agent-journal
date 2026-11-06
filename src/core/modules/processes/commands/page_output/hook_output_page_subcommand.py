from argparse import Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.modules.processes.commands.page_output.page_output_subcommand import PageOutputSubcommand
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_access import OutputAccess
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.output_page import OutputPage


class HookOutputPageSubcommand(PageOutputSubcommand):
    """A page of the recorded output for a tool call."""

    name = "hook-page"

    def __init__(self, access: OutputAccess, folder: OutputFolder, queries: Queries) -> None:
        super().__init__(access, folder)
        self.queries = queries

    def read(self, arguments: Namespace, caller: Caller) -> OutputPage:
        process = self.queries.query(Process).filter(hook_call_id=arguments.process_id).oldest().first()
        if process is None:
            return OutputPage((), 0, 0, 0)
        return super().read(Namespace(**{**vars(arguments), "process_id": process.id}), caller)
