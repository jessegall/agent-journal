from argparse import Namespace
from collections.abc import Sequence

from core.base.caller.caller import Caller
from core.base.registry.setting_entry import SettingEntry
from core.base.setting.setting_declaration import ANY_KEY, GROUP_TYPE, REFERENCE_TYPE
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from core.modules.settings.support.setting_catalogue import SettingCatalogue
from core.modules.settings.support.setting_lines import SettingLines
from core.modules.settings.commands.support.setting_tree_row import SettingTreeRow
from core.modules.settings.support.setting_reader import SettingReader
from core.modules.settings.support.setting_rows import SettingRows
from core.modules.settings.support.tree_line import TreeLine
from core.modules.settings.support.undeclared_settings import UNDECLARED_TYPE, UndeclaredSettings

INDENT = "  "
UNCOVERED_HEADING = "Not declared by any installed module"


class SettingTreeSubcommand(ReadSubcommand[Sequence[TreeLine]]):
    """`journal setting tree`: every declared setting and group in the order the modules declare them, each
    with what it holds here, a secret only as set or not set; a group another module places is drawn where
    it is placed as well as in its own module, under its one key; an open group lists the keys stored under
    it; rows no installed module declares come last."""

    cli_name = "setting"
    name = "tree"

    def __init__(self, declared: SettingCatalogue, values: SettingReader, undeclared: UndeclaredSettings,
                 rows: SettingRows) -> None:
        self.declared, self.values, self.undeclared, self.rows = declared, values, undeclared, rows

    def read(self, arguments: Namespace, caller: Caller) -> Sequence[TreeLine]:
        lines: list[TreeLine] = []
        for entry in self.declared.all():
            if self.is_hidden(entry):
                continue
            depth = len(list(self.declared.enclosing_groups(entry)))
            if entry.type == REFERENCE_TYPE:
                lines.extend(self.placed(entry.target, depth))
            elif entry.key.endswith(f".{ANY_KEY}"):
                lines.extend(self.stored(entry, depth))
            else:
                lines.append(self.line(entry, depth))
        kept = [self.undeclared.current(self.declared.all(), key) for key in dict.fromkeys(report.key for report in self.undeclared.found(self.declared.all()))]
        return (*lines, *(TreeLine(setting, 0) for setting in kept if setting is not None))

    def is_hidden(self, entry: SettingEntry) -> bool:
        return any(self.declared.entry(key).type == GROUP_TYPE and self.values.current(key).value is False for key in entry.depends_on)

    def line(self, entry: SettingEntry, depth: int) -> TreeLine:
        return TreeLine(self.values.current(entry.key), depth)

    def stored(self, template: SettingEntry, depth: int) -> list[TreeLine]:
        prefix = template.key.removesuffix(ANY_KEY)
        return [self.line(self.declared.entry(key), depth) for key in sorted(self.rows.stored_keys()) if key.startswith(prefix)]

    def placed(self, key: str, depth: int) -> list[TreeLine]:
        lines = [self.line(self.declared.entry(key), depth)]
        for child in self.declared.children(key):
            lines.extend(self.placed(child.target, depth + 1) if child.type == REFERENCE_TYPE else self.placed(child.key, depth + 1))
        return lines

    def write_output(self, value: object, output: Output) -> None:
        lines = [line for line in value if isinstance(line, TreeLine)] if is_tuple(value) else []
        declared = [f"{INDENT * line.depth}{line.setting.entry.key}: {SettingLines.shown(line.setting)}" for line in lines if line.setting.entry.type != UNDECLARED_TYPE]
        kept = [f"{line.setting.entry.key}: {SettingLines.shown(line.setting)} ({line.setting.entry.module})" for line in lines if line.setting.entry.type == UNDECLARED_TYPE]
        section = [UNCOVERED_HEADING, *kept] if kept else []
        output.write("\n".join([*declared, *section]), {"rows": [output.values(SettingTreeRow.listed(line.setting)) for line in lines]})
