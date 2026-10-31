from argparse import ArgumentParser, Namespace

from core.base.environment_names import EnvironmentNames
from core.base.refusal import Refusal
from core.base.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.settings.commands.support.current_setting_output import CurrentSettingOutput
from core.modules.settings.support.current_setting import CurrentSetting
from core.modules.settings.support.setting_reader import DEFAULT_SOURCE, SettingReader
from core.modules.viewer.commands.support.window_setting_keys import WindowSettingKeys


class WindowSettingSubcommand(CurrentSettingOutput, ReadSubcommand[CurrentSetting]):
    """`journal window setting <window> <key> [--environment <name>]`: one of the window's own settings."""

    cli_name = "window"
    name = "setting"

    def __init__(self, reader: SettingReader, keys: WindowSettingKeys, environment_names: EnvironmentNames) -> None:
        self.reader, self.keys, self.environment_names = reader, keys, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("window")
        parser.add_argument("key")
        parser.add_argument("--environment")

    def read(self, arguments: Namespace, caller: Caller) -> CurrentSetting:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if environment_id is None:
            raise Refusal("a window's settings belong to an environment", "name one with --environment")
        setting = self.reader.current(self.keys.key(arguments.window, arguments.key), environment_id)
        if setting.source == DEFAULT_SOURCE:
            raise Refusal(f"{arguments.window} has no setting {arguments.key}", f"journal window save-setting {arguments.window} {arguments.key} <json value> saves one")
        return setting
