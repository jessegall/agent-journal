from argparse import ArgumentParser, Namespace

from core.base.environment_names import EnvironmentNames
from core.base.refusal import Refusal
from core.base.subcommand.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.settings.setting import Setting
from core.modules.settings.setting_values import SettingValues
from core.modules.viewer.window_setting_keys import WindowSettingKeys


class WindowSettingSubcommand(ReadSubcommand[Setting]):
    """`journal window setting <window> <key> [--environment <name>]`: one of the window's own settings."""

    cli_name = "window"
    name = "setting"

    def __init__(self, values: SettingValues, keys: WindowSettingKeys, environment_names: EnvironmentNames) -> None:
        self.values, self.keys, self.environment_names = values, keys, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("window")
        parser.add_argument("key")
        parser.add_argument("--environment")

    def read(self, arguments: Namespace, caller: Caller) -> Setting:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if environment_id is None:
            raise Refusal("a window's settings belong to an environment", "name one with --environment")
        setting = self.values.row(self.keys.key(arguments.window, arguments.key), environment_id)
        if setting is None:
            raise Refusal(f"{arguments.window} has no setting {arguments.key}", f"journal window save-setting {arguments.window} {arguments.key} <json value> saves one")
        return setting
