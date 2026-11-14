from argparse import Namespace

from engine.caller.caller import Caller
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.processes.support.execution_presets import ExecutionPresets


class ListExecutionPresetsSubcommand(ReadSubcommand[str]):
    """`journal queue-class presets`: each preset with the capacities it gives on this machine."""

    cli_name = "queue-class"
    name = "presets"

    def read(self, arguments: Namespace, caller: Caller) -> str:
        return "\n".join(ExecutionPresets().lines())
