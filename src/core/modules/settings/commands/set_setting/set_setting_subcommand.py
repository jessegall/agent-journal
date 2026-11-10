from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.modules.settings.commands.support.current_setting_output import CurrentSettingOutput
from core.base.subcommand.subcommand import Subcommand
from core.modules.settings.commands.set_setting.set_setting import SetSetting
from core.modules.settings.support.current_setting import CurrentSetting


class SetSettingSubcommand(CurrentSettingOutput, Subcommand[SetSetting, CurrentSetting]):
    """`journal setting set <key> <value> [--project]`: sets a declared setting for this environment or the
    project."""

    cli_name = "setting"
    name = "set"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("key")
        parser.add_argument("value")
        parser.add_argument("--project", action="store_true")
        parser.add_argument("--expected-revision", default="")

    def command(self, arguments: Namespace, caller: Caller) -> SetSetting:
        return SetSetting(arguments.key, arguments.value, arguments.project, arguments.expected_revision)
