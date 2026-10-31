from argparse import ArgumentParser, Namespace
from collections.abc import Sequence

from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from core.modules.settings.support.setting_catalogue import SettingCatalogue
from core.modules.settings.support.setting_reader import SettingReader
from core.modules.settings.support.setting_lines import SettingLines
from core.modules.settings.commands.setting_tree_row import SettingTreeRow
from core.modules.settings.support.undeclared_settings import UNDECLARED_TYPE, UndeclaredSettings
from core.modules.settings.support.current_setting import CurrentSetting

INDENT = "  "
NOT_DECLARED = "Not declared by any installed module"


class SettingTreeSubcommand(ReadSubcommand[Sequence[CurrentSetting]]):
    """`journal setting tree`: every declared setting and group in the order the modules declare them, each with
    what it holds here, a secret only as set or not set."""

    cli_name = "setting"
    name = "tree"

    def __init__(self, declared: SettingCatalogue, values: SettingReader, environment_names: EnvironmentNames, undeclared: UndeclaredSettings) -> None:
        self.declared, self.values, self.environment_names, self.undeclared = declared, values, environment_names, undeclared

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")

    def read(self, arguments: Namespace, caller: Caller) -> Sequence[CurrentSetting]:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        kept = [self.undeclared.current(self.declared.all(), key, environment_id) for key in dict.fromkeys(report.key for report in self.undeclared.found(self.declared.all()))]
        return (*(self.values.current(entry.key, environment_id) for entry in self.declared.all()), *(setting for setting in kept if setting is not None))

    def write_output(self, value: object, output: Output) -> None:
        settings = [setting for setting in value if isinstance(setting, CurrentSetting)] if is_tuple(value) else []
        declared = [setting for setting in settings if setting.entry.type != UNDECLARED_TYPE]
        lines = [f"{INDENT * len(list(self.declared.enclosing_groups(setting.entry)))}{setting.entry.key}: {SettingLines.shown(setting)}" for setting in declared]
        kept = [f"{setting.entry.key}: {SettingLines.shown(setting)} ({setting.entry.module})" for setting in settings if setting.entry.type == UNDECLARED_TYPE]
        output.write("\n".join([*lines, *([NOT_DECLARED, *kept] if kept else [])]), {"rows": [output.values(SettingTreeRow.listed(setting)) for setting in settings]})
