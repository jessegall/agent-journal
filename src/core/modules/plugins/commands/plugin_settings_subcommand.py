from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.plugins.commands.support.plugin_setting_lines import PluginSettingLines
from core.modules.plugins.models.plugin_setting import PluginSetting
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest


class PluginSettingsSubcommand(ReadSubcommand[PluginSettingLines]):
    """`journal plugin settings <name>`: each setting the plugin declares, its type, its value and its title."""

    cli_name = "plugin"
    name = "settings"

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, queries: Queries) -> None:
        self.plugins, self.folders, self.queries = plugins, folders, queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plugin")

    def read(self, arguments: Namespace, caller: Caller) -> PluginSettingLines:
        plugin = self.plugins.find_name(arguments.plugin)
        values = {row.key: row.value for row in self.queries.query(PluginSetting).filter(plugin_id=plugin.id).all_rows()}
        return PluginSettingLines(PluginManifest.read(self.folders.code(plugin.name)), values)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PluginSettingLines):
            output.line("\n".join(value.lines()))
