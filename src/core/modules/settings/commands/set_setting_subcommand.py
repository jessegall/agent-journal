from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.settings.commands.set_setting import SetSetting
from core.modules.settings.support.setting_lines import SettingLines
from core.modules.settings.support.current_setting import CurrentSetting


class SetSettingSubcommand(Subcommand[SetSetting, CurrentSetting]):
    """`journal setting set <key> <value> [--project]`: sets a declared setting for this environment or the project."""

    cli_name = "setting"
    name = "set"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("key")
        parser.add_argument("value")
        parser.add_argument("--project", action="store_true")

    def command(self, arguments: Namespace, caller: Caller) -> SetSetting:
        return SetSetting(arguments.key, arguments.value, arguments.project)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, CurrentSetting):
            SettingLines().write(value, output)
