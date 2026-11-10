from argparse import Namespace
from collections.abc import Sequence

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from core.modules.pins.models.pin import Pin
from core.modules.pins.queries.pin_query import PinQuery


class PinListSubcommand(ReadSubcommand[Sequence[Pin]]):
    """`journal pin list [--environment <name>]`: the open pins of an environment, oldest first."""

    cli_name = "pin"
    name = "list"
    environment_refusal = "pins belong to an environment"

    def __init__(self, pins: PinQuery) -> None:
        self.pins = pins

    def read(self, arguments: Namespace, caller: Caller) -> Sequence[Pin]:
        return tuple(self.pins.open_pins().oldest().all_rows())

    def write_output(self, value: object, output: Output) -> None:
        listed = [row for row in value if isinstance(row, Pin)] if is_tuple(value) else []
        output.write("\n".join(f"{row.id:>4}  {row.title}: {row.link}" for row in listed), {"rows": [output.values(row) for row in listed]})
