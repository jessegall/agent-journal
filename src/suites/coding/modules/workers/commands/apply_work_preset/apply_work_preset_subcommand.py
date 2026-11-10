from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.apply_work_preset.apply_work_preset import ApplyWorkPreset
from suites.coding.support.work_settings import WorkSettings


class ApplyWorkPresetSubcommand(Subcommand[ApplyWorkPreset, WorkSettings]):
    """`journal work-settings preset <name> --revision <revision>`: writes the controls of a preset together."""

    cli_name = "work-settings"
    name = "preset"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("name")
        parser.add_argument("--revision", required=True)

    def command(self, arguments: Namespace, caller: Caller) -> ApplyWorkPreset:
        return ApplyWorkPreset(arguments.name, arguments.revision)
