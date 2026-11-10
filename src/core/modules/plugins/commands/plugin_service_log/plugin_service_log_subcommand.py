from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.file.file_access import FileAccess
from engine.errors.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.runnable_plugins import RunnablePlugins


class PluginServiceLogSubcommand(ReadSubcommand[str]):
    """Reads the latest output of a plugin service."""

    cli_name = "plugin"
    name = "service-log"

    def __init__(self, plugins: PluginQuery, runnable: RunnablePlugins, folders: PluginFolders) -> None:
        self.plugins, self.runnable, self.folders = plugins, runnable, folders

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plugin")
        parser.add_argument("service")
        parser.add_argument("--lines", type=int, default=100)

    def read(self, arguments: Namespace, caller: Caller) -> str:
        plugin = self.plugins.filter(name=arguments.plugin).first()
        manifest = self.runnable.readable_manifest(plugin) if plugin else None
        if manifest is None or not any(service.name == arguments.service for service in manifest.services):
            raise Refusal("that plugin service does not exist", "name an installed plugin and its service")
        if arguments.lines < 1:
            raise Refusal("the line count must be positive", "use --lines with a positive number")
        path = self.folders.service_log(arguments.plugin, arguments.service)
        if not path.is_file():
            return ""
        return "\n".join(FileAccess.shared().read(path, errors="replace").splitlines()[-arguments.lines:])

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, str):
            output.write(value or "no service output", {"text": value})
