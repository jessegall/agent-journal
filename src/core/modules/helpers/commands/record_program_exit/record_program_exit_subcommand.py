from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.helpers.commands.record_program_exit.record_program_exit import RecordProgramExit


class RecordProgramExitSubcommand(Subcommand[RecordProgramExit, None]):
    """`journal agent exited <agent> <exit code>`: the launcher tells that a program it started has exited."""

    cli_name = "agent"
    name = "exited"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=int)
        parser.add_argument("exit_code", type=int)
        parser.add_argument("--launch-ended", action="store_true")
        parser.add_argument("--pid", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> RecordProgramExit:
        return RecordProgramExit(arguments.agent_id, arguments.exit_code, arguments.launch_ended, arguments.pid)
