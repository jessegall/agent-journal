from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.set_active_slice.set_active_slice import SetActiveSlice

SWITCH_STATES = {"on": True, "off": False}


class SetActiveSliceSubcommand(Subcommand[SetActiveSlice, tuple[str, ...]]):
    """`journal driver set-active <slice> on|off`: a person switches a part of the new driver on or off."""

    cli_name = "driver"
    name = "set-active"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("slice")
        parser.add_argument("switch", choices=list(SWITCH_STATES))

    def command(self, arguments: Namespace, caller: Caller) -> SetActiveSlice:
        return SetActiveSlice(arguments.slice, SWITCH_STATES[arguments.switch])
