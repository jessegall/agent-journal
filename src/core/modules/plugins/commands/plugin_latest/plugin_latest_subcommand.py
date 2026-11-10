from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_latest import PluginLatest
from core.modules.plugins.support.plugin_releases import PluginReleases


class PluginLatestSubcommand(ReadSubcommand[PluginLatest]):
    """`journal plugin latest <name>`: whether the plugin's source has a newer release than the one installed.
    """

    cli_name = "plugin"
    name = "latest"

    def __init__(self, plugins: PluginQuery, releases: PluginReleases) -> None:
        self.plugins, self.releases = plugins, releases

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plugin")

    def read(self, arguments: Namespace, caller: Caller) -> PluginLatest:
        plugin = self.plugins.find_name(arguments.plugin)
        return self.releases.latest(plugin.name, plugin.release, plugin.source)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PluginLatest):
            output.write(value.line(), value.json())
