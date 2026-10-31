from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.modules.settings.commands.support.current_setting_output import CurrentSettingOutput
from core.base.subcommand.subcommand import Subcommand
from core.modules.settings.commands.switch_setting_group import SwitchSettingGroup
from core.modules.settings.support.current_setting import CurrentSetting

ENABLED_STATE = "on"


class SwitchSettingGroupSubcommand(CurrentSettingOutput, Subcommand[SwitchSettingGroup, CurrentSetting]):
    """`journal setting switch <group> on|off [--project]`: switches a group of settings and all inside it."""

    cli_name = "setting"
    name = "switch"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("key")
        parser.add_argument("state", choices=["on", "off"])
        parser.add_argument("--project", action="store_true")

    def command(self, arguments: Namespace, caller: Caller) -> SwitchSettingGroup:
        return SwitchSettingGroup(arguments.key, arguments.state == ENABLED_STATE, arguments.project)
