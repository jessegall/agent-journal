from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.viewer.commands.rename_person_preset import RenamePersonPreset
from core.modules.viewer.models.person_preset import PersonPreset


class RenamePersonPresetSubcommand(Subcommand[RenamePersonPreset, PersonPreset]):
    """`journal person-preset rename <id> --name <name>`: another name for one of your presets of your own."""

    cli_name = "person-preset"
    name = "rename"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("row_id", type=int)
        parser.add_argument("--name", required=True)

    def command(self, arguments: Namespace, caller: Caller) -> RenamePersonPreset:
        return RenamePersonPreset(arguments.row_id, arguments.name)
