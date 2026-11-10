from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.enums.sandbox_level import SandboxLevel
from core.base.subcommand.subcommand import Subcommand
from core.modules.processes.commands.record_sandbox.record_sandbox import RecordSandbox
from core.modules.processes.models.process import Process


class RecordSandboxSubcommand(Subcommand[RecordSandbox, Process]):
    cli_name = "process"
    name = "sandbox"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("process_id", type=int)
        parser.add_argument("--level", required=True, type=SandboxLevel, choices=list(SandboxLevel))

    def command(self, arguments: Namespace, caller: Caller) -> RecordSandbox:
        return RecordSandbox(arguments.process_id, arguments.level)
