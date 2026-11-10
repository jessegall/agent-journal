from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from engine.enums.log_level import LogLevel
from core.base.subcommand.subcommand import Subcommand
from core.modules.plugins.commands.log_plugin_line.log_plugin_line import LogPluginLine
from core.modules.plugins.queries.plugin_query import PluginQuery

PLUGIN_LEVELS = (LogLevel.INFORMATION, LogLevel.WARNING, LogLevel.ERROR)


class LogPluginLineSubcommand(Subcommand[LogPluginLine, None]):
    """`journal plugin log <plugin> --level <info|warning|error> "<text>"`: a plugin's script or service writes a
    line to the system log under its name."""

    cli_name = "plugin"
    name = "log"

    def __init__(self, plugins: PluginQuery) -> None:
        self.plugins = plugins

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plugin")
        parser.add_argument("--level", type=LogLevel, choices=PLUGIN_LEVELS, default=LogLevel.INFORMATION)
        parser.add_argument("text")

    def command(self, arguments: Namespace, caller: Caller) -> LogPluginLine:
        return LogPluginLine(self.plugins.find_name(arguments.plugin).name, arguments.level, arguments.text)
