from argparse import ArgumentParser, Namespace

from engine.errors.refusal import Refusal
from engine.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.settings.commands.support.current_setting_output import CurrentSettingOutput
from core.modules.settings.support.current_setting import CurrentSetting
from core.modules.settings.support.setting_reader import DEFAULT_SOURCE, SettingReader
from core.modules.viewer.commands.support.window_setting_keys import WindowSettingKeys


class WindowSettingSubcommand(CurrentSettingOutput, ReadSubcommand[CurrentSetting]):
    """`journal window setting <window> <key> [--environment <name>]`: one of the window's own settings."""

    cli_name = "window"
    name = "setting"
    outward = True
    environment_refusal = "a window's settings belong to an environment"

    def __init__(self, reader: SettingReader, keys: WindowSettingKeys) -> None:
        self.reader, self.keys = reader, keys

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("window")
        parser.add_argument("key")

    def read(self, arguments: Namespace, caller: Caller) -> CurrentSetting:
        setting = self.reader.current(self.keys.key(arguments.window, arguments.key))
        if setting.source == DEFAULT_SOURCE:
            raise Refusal(f"{arguments.window} has no setting {arguments.key}", f"journal window save-setting {arguments.window} {arguments.key} <json value> saves one")
        return setting
