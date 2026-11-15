from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.restore_stack_frame.restore_stack_frame import RestoreStackFrame


class RestoreStackFrameSubcommand(Subcommand[RestoreStackFrame, str]):
    """`journal driver restore <agent> <frame>`: a person shows the work they removed from an agent's stack
    again."""

    cli_name = "driver"
    name = "restore"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent", type=int)
        parser.add_argument("frame")

    def command(self, arguments: Namespace, caller: Caller) -> RestoreStackFrame:
        return RestoreStackFrame(arguments.agent, arguments.frame)
