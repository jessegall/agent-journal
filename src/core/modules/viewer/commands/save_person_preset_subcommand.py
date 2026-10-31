from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.viewer.commands.save_person_preset import SavePersonPreset
from core.modules.viewer.models.person_preset import PersonPreset


class SavePersonPresetSubcommand(Subcommand[SavePersonPreset, PersonPreset]):
    """`journal person-preset save --page <page> --name <name> --shape <json>`: a layout of yours as a preset."""

    cli_name = "person-preset"
    name = "save"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--page", required=True)
        parser.add_argument("--name", required=True)
        parser.add_argument("--shape", required=True)

    def command(self, arguments: Namespace, caller: Caller) -> SavePersonPreset:
        return SavePersonPreset(arguments.page, arguments.name, arguments.shape)
