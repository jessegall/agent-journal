from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_event_row import PluginEventRow
from core.modules.plugins.support.plugin_event_rows import PluginEventRows
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.runnable_plugins import RunnablePlugins


class PluginEventsSubcommand(ReadSubcommand[tuple[PluginEventRow, ...]]):
    """`journal plugin events [<name>]`: one row for each entry and form of what a plugin listens to, and every wrong
    entry."""

    cli_name = "plugin"
    name = "events"

    def __init__(self, plugins: PluginQuery, runnable: RunnablePlugins, folders: PluginFolders, rows: PluginEventRows) -> None:
        self.plugins, self.runnable, self.folders, self.rows = plugins, runnable, folders, rows

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plugin", nargs="?", default="")

    def read(self, arguments: Namespace, caller: Caller) -> tuple[PluginEventRow, ...]:
        entries: list[PluginEventRow] = []
        for plugin in self.plugins.oldest().all_rows():
            manifest = self.runnable.readable_manifest(plugin)
            if manifest is not None and arguments.plugin in ("", plugin.name):
                entries.extend(self.rows.rows(manifest, self.folders.code(plugin.name)))
        return tuple(entries)

    def write_output(self, value: object, output: Output) -> None:
        rows = [row for row in value if isinstance(row, PluginEventRow)] if is_tuple(value) else []
        text = "\n".join("  ".join(field for field in (row.plugin, row.key, row.form, row.script, row.state.value, row.current_key) if field) for row in rows)
        output.write(text or "no plugin listens to anything", {"rows": [output.values(row) for row in rows]})
