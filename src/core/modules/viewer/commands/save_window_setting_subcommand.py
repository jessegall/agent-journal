from argparse import ArgumentParser, Namespace
import json

from core.base.cli.usage_error import UsageError
from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.settings.models.setting import Setting
from core.modules.viewer.commands.save_window_setting import SaveWindowSetting


class SaveWindowSettingSubcommand(Subcommand[SaveWindowSetting, Setting]):
    """`journal window save-setting <window> <key> <json value>`: one of the window's own settings."""

    cli_name = "window"
    name = "save-setting"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("window")
        parser.add_argument("key")
        parser.add_argument("value")

    def command(self, arguments: Namespace, caller: Caller) -> SaveWindowSetting:
        try:
            json.loads(arguments.value)
        except json.JSONDecodeError as error:
            raise UsageError(f"a window setting's value is JSON: {arguments.value}") from error
        return SaveWindowSetting(arguments.window, arguments.key, arguments.value)
