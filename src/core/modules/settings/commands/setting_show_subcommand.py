from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.settings.support.declared_values import DeclaredValues
from core.modules.settings.support.setting_lines import SettingLines
from core.modules.settings.support.current_setting import CurrentSetting


class SettingShowSubcommand(ReadSubcommand[CurrentSetting]):
    """`journal setting show <key>`: a declared setting's value here and where it comes from; a secret only as set."""

    cli_name = "setting"
    name = "show"

    def __init__(self, values: DeclaredValues, environment_names: EnvironmentNames) -> None:
        self.values, self.environment_names = values, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("key")
        parser.add_argument("--environment")

    def read(self, arguments: Namespace, caller: Caller) -> CurrentSetting:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        return self.values.current(arguments.key, environment_id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, CurrentSetting):
            SettingLines().write(value, output)
