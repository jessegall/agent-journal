from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from engine.query.queries import Queries
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.plugins.commands.support.plugin_setting_lines import PluginSettingLines
from core.modules.plugins.models.plugin_setting import PluginSetting
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest


class PluginSettingsSubcommand(ReadSubcommand[PluginSettingLines]):
    """`journal plugin settings <name>`: each setting the plugin declares, its type, its value and its title.
    """

    cli_name = "plugin"
    name = "settings"

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, queries: Queries) -> None:
        self.plugins, self.folders, self.queries = plugins, folders, queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plugin")

    def read(self, arguments: Namespace, caller: Caller) -> PluginSettingLines:
        plugin = self.plugins.find_name(arguments.plugin)
        rows = tuple(self.queries.query(PluginSetting).filter(plugin_id=plugin.id).all_rows())
        values = {row.key: row.value for row in rows if row.environment_id is None}
        if caller.environment_id is not None:
            values.update({row.key: row.value for row in rows if row.environment_id == caller.environment_id})
        return PluginSettingLines(PluginManifest.read(self.folders.code(plugin.name)), values)
