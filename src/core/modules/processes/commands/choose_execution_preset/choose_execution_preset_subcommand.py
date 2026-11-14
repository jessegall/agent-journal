from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.processes.commands.choose_execution_preset.choose_execution_preset import ChooseExecutionPreset


class ChooseExecutionPresetSubcommand(Subcommand[ChooseExecutionPreset, str]):
    """`journal queue-class preset <small|medium|large>`: sets each lane's capacity for this machine's cores."""

    cli_name = "queue-class"
    name = "preset"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("preset")

    def command(self, arguments: Namespace, caller: Caller) -> ChooseExecutionPreset:
        return ChooseExecutionPreset(arguments.preset)
