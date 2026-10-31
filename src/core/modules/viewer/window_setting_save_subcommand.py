from argparse import ArgumentParser, Namespace
import json

from core.base.cli.usage_error import UsageError
from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.settings.setting import Setting
from core.modules.viewer.window_setting_save import WindowSettingSave


class WindowSettingSaveSubcommand(Subcommand[WindowSettingSave, Setting]):
    """`journal window save-setting <window> <key> <json value>`: one of the window's own settings."""

    cli_name = "window"
    name = "save-setting"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("window")
        parser.add_argument("key")
        parser.add_argument("value")

    def command(self, arguments: Namespace, caller: Caller) -> WindowSettingSave:
        try:
            json.loads(arguments.value)
        except json.JSONDecodeError as error:
            raise UsageError(f"a window setting's value is JSON: {arguments.value}") from error
        return WindowSettingSave(arguments.window, arguments.key, arguments.value)
