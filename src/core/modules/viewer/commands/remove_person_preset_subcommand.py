from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.viewer.commands.remove_person_preset import RemovePersonPreset
from core.modules.viewer.models.person_preset import PersonPreset


class RemovePersonPresetSubcommand(Subcommand[RemovePersonPreset, PersonPreset]):
    """`journal person-preset remove <id>`: delete one of your presets of your own."""

    cli_name = "person-preset"
    name = "remove"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("row_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> RemovePersonPreset:
        return RemovePersonPreset(arguments.row_id)
