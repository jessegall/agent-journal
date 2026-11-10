from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.subcommand.row_list import RowList
from engine.errors.refusal import Refusal
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest


class PluginDescriptionsSubcommand(ReadSubcommand[RowList]):
    """`journal plugin descriptions`: what each installed plugin's manifest says it is for."""

    row_line = "{plugin}: {description}"
    empty_line = "no plugins"

    cli_name = "plugin"
    name = "descriptions"

    def __init__(self, plugins: PluginQuery, folders: PluginFolders) -> None:
        self.plugins, self.folders = plugins, folders

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> RowList:
        return RowList([{"id": plugin.name, "plugin": plugin.name, "description": self.description(plugin)} for plugin in self.plugins.all_rows()])

    def description(self, plugin: Plugin) -> str:
        try:
            return PluginManifest.read(self.folders.code(plugin.name)).description
        except Refusal as refusal:
            return refusal.reason
