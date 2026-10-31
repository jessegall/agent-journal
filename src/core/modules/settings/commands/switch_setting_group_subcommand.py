from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.settings.commands.switch_setting_group import SwitchSettingGroup
from core.modules.settings.support.setting_lines import SettingLines
from core.modules.settings.support.current_setting import CurrentSetting

ON = "on"


class SwitchSettingGroupSubcommand(Subcommand[SwitchSettingGroup, CurrentSetting]):
    """`journal setting switch <group> on|off [--project]`: switches a group of settings and all inside it."""

    cli_name = "setting"
    name = "switch"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("key")
        parser.add_argument("state", choices=["on", "off"])
        parser.add_argument("--project", action="store_true")

    def command(self, arguments: Namespace, caller: Caller) -> SwitchSettingGroup:
        return SwitchSettingGroup(arguments.key, arguments.state == ON, arguments.project)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, CurrentSetting):
            SettingLines().write(value, output)
