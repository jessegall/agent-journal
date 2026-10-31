from argparse import ArgumentParser, Namespace

from core.base.environment_names import EnvironmentNames
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.settings.setting import Setting
from core.modules.viewer.window_setting_key import window_setting_key


class WindowSettingSubcommand(ReadSubcommand[Setting]):
    """`journal window setting <window> <key> [--environment <name>]`: one of the window's own settings."""

    cli_name = "window"
    name = "setting"

    def __init__(self, queries: Queries, environment_names: EnvironmentNames) -> None:
        self.queries, self.environment_names = queries, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("window")
        parser.add_argument("key")
        parser.add_argument("--environment")

    def read(self, arguments: Namespace, caller: Caller) -> Setting:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        rows = self.queries.query(Setting).filter(key=window_setting_key(arguments.window, arguments.key), environment_id=environment_id).page(1, 1).rows
        if not rows:
            raise Refusal(f"{arguments.window} has no setting {arguments.key}", f"journal window save-setting {arguments.window} {arguments.key} <json value> saves one")
        return rows[0]
