from argparse import ArgumentParser, Namespace
from collections.abc import Sequence

from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.registry.setting_entry import REFERENCE_TYPE, SettingEntry
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from core.modules.settings.support.setting_catalogue import SettingCatalogue
from core.modules.settings.support.setting_lines import SettingLines
from core.modules.settings.commands.setting_tree_row import SettingTreeRow
from core.modules.settings.support.setting_reader import SettingReader
from core.modules.settings.support.tree_line import TreeLine
from core.modules.settings.support.undeclared_settings import UNDECLARED_TYPE, UndeclaredSettings

INDENT = "  "
UNCOVERED_HEADING = "Not declared by any installed module"


class SettingTreeSubcommand(ReadSubcommand[Sequence[TreeLine]]):
    """`journal setting tree`: every declared setting and group in the order the modules declare them, each
    with what it holds here, a secret only as set or not set; a group another module places is drawn where
    it is placed as well as in its own module, under its one key; rows no installed module declares come
    last."""

    cli_name = "setting"
    name = "tree"

    def __init__(self, declared: SettingCatalogue, values: SettingReader, environment_names: EnvironmentNames, undeclared: UndeclaredSettings) -> None:
        self.declared, self.values, self.environment_names, self.undeclared = declared, values, environment_names, undeclared

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")

    def read(self, arguments: Namespace, caller: Caller) -> Sequence[TreeLine]:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        lines: list[TreeLine] = []
        for entry in self.declared.all():
            depth = len(list(self.declared.enclosing_groups(entry)))
            lines.extend(self.placed(entry.target, depth, environment_id) if entry.type == REFERENCE_TYPE else [self.line(entry, depth, environment_id)])
        kept = [self.undeclared.current(self.declared.all(), key, environment_id) for key in dict.fromkeys(report.key for report in self.undeclared.found(self.declared.all()))]
        return (*lines, *(TreeLine(setting, 0) for setting in kept if setting is not None))

    def line(self, entry: SettingEntry, depth: int, environment_id: int | None) -> TreeLine:
        return TreeLine(self.values.current(entry.key, environment_id), depth)

    def placed(self, key: str, depth: int, environment_id: int | None) -> list[TreeLine]:
        lines = [self.line(self.declared.entry(key), depth, environment_id)]
        for child in self.declared.children(key):
            lines.extend(self.placed(child.target, depth + 1, environment_id) if child.type == REFERENCE_TYPE else self.placed(child.key, depth + 1, environment_id))
        return lines

    def write_output(self, value: object, output: Output) -> None:
        lines = [line for line in value if isinstance(line, TreeLine)] if is_tuple(value) else []
        declared = [f"{INDENT * line.depth}{line.setting.entry.key}: {SettingLines.shown(line.setting)}" for line in lines if line.setting.entry.type != UNDECLARED_TYPE]
        kept = [f"{line.setting.entry.key}: {SettingLines.shown(line.setting)} ({line.setting.entry.module})" for line in lines if line.setting.entry.type == UNDECLARED_TYPE]
        section = [UNCOVERED_HEADING, *kept] if kept else []
        output.write("\n".join([*declared, *section]), {"rows": [output.values(SettingTreeRow.listed(line.setting)) for line in lines]})
