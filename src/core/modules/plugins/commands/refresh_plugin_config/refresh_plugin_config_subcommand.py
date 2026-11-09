import json
import sys
from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.refusal import Refusal
from core.base.scope.environment_scope import EnvironmentScope
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.plugins.commands.refresh_plugin_config.refresh_plugin_config import RefreshPluginConfig
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.queries.plugin_query import PluginQuery

POINTER_SEPARATOR = "="


class RefreshPluginConfigSubcommand(Subcommand[RefreshPluginConfig, Plugin]):
    """`journal plugin config <name> [--set <pointer>=<json value>]... [--stdin] [--json]`: the plugin's
    config as the project holds it, from any checkout, with its version; --set changes the values at those
    places and --stdin hands in a whole document, each checked against the plugin's schema before it is
    written."""

    cli_name = "plugin"
    name = "config"
    disabled_scopes = tuple([EnvironmentScope])

    def __init__(self, plugins: PluginQuery) -> None:
        self.plugins = plugins

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plugin")
        parser.add_argument("--set", action="append", default=[], dest="changes")
        parser.add_argument("--stdin", action="store_true")

    def command(self, arguments: Namespace, caller: Caller) -> RefreshPluginConfig:
        plugin = self.plugins.find_name(arguments.plugin)
        if arguments.stdin:
            return RefreshPluginConfig(plugin.id, sys.stdin.read())
        return RefreshPluginConfig(plugin.id, changes=tuple(self.change(change) for change in arguments.changes))

    def change(self, change: str) -> tuple[str, object]:
        pointer, separator, value = change.partition(POINTER_SEPARATOR)
        if not separator:
            raise Refusal(f"{change} has no value", "write it as /path/to/key=<json value>")
        return pointer, self.value(value)

    @staticmethod
    def value(text: str) -> object:
        try:
            decoded: object = json.loads(text)
            return decoded
        except ValueError:
            return text

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Plugin):
            document = json.loads(value.config_document)
            output.write(f"version {value.config_version}\n{json.dumps(document, indent=2)}", {"version": value.config_version, "config": document})
