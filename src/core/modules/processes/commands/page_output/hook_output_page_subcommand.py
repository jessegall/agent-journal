from argparse import Namespace
from dataclasses import dataclass
import json

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.modules.processes.commands.page_output.page_output_subcommand import PageOutputSubcommand
from core.modules.processes.models.process import Process
from core.modules.drivers.models.hook_call import HookCall
from core.modules.processes.support.output_access import OutputAccess
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.output_page import OutputPage
from core.modules.processes.support.runner_line import RunnerLine


@dataclass(frozen=True)
class HookOutputPage(OutputPage):
    command: str = ""

    def write(self, output: Output) -> None:
        output.write("\n".join(self.lines), {"lines": list(self.lines), "first_byte": self.first_byte, "last_byte": self.last_byte, "total": self.total, "cut_bytes": self.cut_bytes, "command": self.command})


class HookOutputPageSubcommand(PageOutputSubcommand):
    """A page of the recorded output for a tool call."""

    name = "hook-page"

    def __init__(self, access: OutputAccess, folder: OutputFolder, queries: Queries) -> None:
        super().__init__(access, folder)
        self.queries = queries

    def read(self, arguments: Namespace, caller: Caller) -> OutputPage:
        call = self.queries.query(HookCall).find(arguments.process_id)
        rewritten = json.loads(call.updated_input)
        line = rewritten.get("command", "")
        process_id = RunnerLine.process_id(line) if isinstance(line, str) else None
        if process_id is None:
            return HookOutputPage((), 0, 0, 0)
        process = self.queries.query(Process).filter(id=process_id, session_agent_id=call.session_agent_id).first()
        if process is None:
            return HookOutputPage((), 0, 0, 0)
        page = super().read(Namespace(**{**vars(arguments), "process_id": process.id}), caller)
        return HookOutputPage(page.lines, page.first_byte, page.last_byte, page.total, page.cut_bytes, process.line)
