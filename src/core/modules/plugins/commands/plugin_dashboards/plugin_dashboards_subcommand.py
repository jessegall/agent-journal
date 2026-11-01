from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.subcommand.row_list import RowList
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest


class PluginDashboardsSubcommand(ReadSubcommand[RowList]):
    """`journal plugin dashboards`: the dashboard each plugin switched on declares."""

    row_line = "{plugin}: {title}"
    empty_line = "no dashboards"

    cli_name = "plugin"
    name = "dashboards"

    def __init__(self, plugins: PluginQuery, folders: PluginFolders) -> None:
        self.plugins, self.folders = plugins, folders

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> RowList:
        boards = [(plugin.name, PluginManifest.read(self.folders.code(plugin.name)).dashboard) for plugin in self.plugins.enabled_ones()]
        return RowList([{"id": name, "plugin": name, "title": board.title} for name, board in boards if board is not None])
