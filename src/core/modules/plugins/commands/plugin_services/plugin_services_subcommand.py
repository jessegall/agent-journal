from core.base.file_access import FileAccess
from core.modules.plugins.support.plugin_services_subcommand_row_record import PluginServicesSubcommandRowRecord
from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.leftover_process import LeftoverProcess
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.subcommand.row_list import RowList
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.manifest_service import ManifestService
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_socket_paths import PluginSocketPaths


class PluginServicesSubcommand(ReadSubcommand[RowList]):
    """`journal plugin services`: each service of the plugins switched on and whether it runs, by the pid the
    journal kept for it. A service with a condition the journal never started it under, as a language this
    project does not have, is left out."""

    cli_name = "plugin"
    name = "services"

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, sockets: PluginSocketPaths) -> None:
        self.plugins, self.folders, self.sockets = plugins, folders, sockets

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> RowList:
        return RowList([self.row(plugin.name, service) for plugin in self.plugins.enabled_ones() for service in PluginManifest.read(self.folders.code(plugin.name)).services if self.is_listed(plugin.name, service)])

    def is_listed(self, plugin_name: str, service: ManifestService) -> bool:
        return service.is_listed(self.sockets.pid(plugin_name, service.name))

    def row(self, plugin_name: str, service: ManifestService) -> PluginServicesSubcommandRowRecord:
        pid_file = self.sockets.pid(plugin_name, service.name)
        pid = int(FileAccess.shared().read(pid_file)) if pid_file.is_file() else None
        program = str(self.folders.code(plugin_name) / service.command[0])
        running = pid is not None and program in LeftoverProcess.command_line(pid)
        return {"id": f"{plugin_name} {service.name}", "plugin": plugin_name, "service": service.name, "restart": service.restart.value, "running": running, "pid": pid if running else None}

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, RowList):
            output.write("\n".join(f"{row['id']}: {'running' if row['running'] else 'stopped'}" for row in value.rows) or "no services", value.json())
