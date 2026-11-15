from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.remove_stack_frame.remove_stack_frame import RemoveStackFrame


class RemoveStackFrameSubcommand(Subcommand[RemoveStackFrame, str]):
    """`journal driver pop <agent> <frame> --reason "<why>"`: a person removes a frame of an agent's stack,
    named by its generation as journal driver stack prints it."""

    cli_name = "driver"
    name = "pop"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent", type=int)
        parser.add_argument("frame")
        parser.add_argument("--reason", required=True)

    def command(self, arguments: Namespace, caller: Caller) -> RemoveStackFrame:
        return RemoveStackFrame(arguments.agent, arguments.frame, arguments.reason)
