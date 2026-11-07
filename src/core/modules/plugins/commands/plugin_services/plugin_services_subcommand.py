from core.base.file_access import FileAccess
from core.modules.plugins.support.plugin_services_subcommand_row_record import PluginServicesSubcommandRowRecord
from argparse import ArgumentParser, Namespace
import os

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.subcommand.row_list import RowList
from core.modules.plugins.support.runnable_plugins import RunnablePlugins
from core.modules.plugins.support.manifest_service import ManifestService
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_socket_paths import PluginSocketPaths
from core.modules.plugins.support.plugin_services import PluginServices
from core.modules.plugins.support.plugin_health import PluginHealth


class PluginServicesSubcommand(ReadSubcommand[RowList]):
    """`journal plugin services`: each service of the plugins switched on and whether it runs, by the pid the
    journal kept for it. A service with a condition the journal never started it under, as a language this
    project does not have, is left out."""

    cli_name = "plugin"
    name = "services"

    def __init__(self, runnable: RunnablePlugins, folders: PluginFolders, sockets: PluginSocketPaths) -> None:
        self.runnable, self.folders, self.sockets = runnable, folders, sockets

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> RowList:
        return RowList([self.row(runnable.plugin.name, service, runnable.manifest.health) for runnable in self.runnable.running() for service in runnable.manifest.services if self.is_listed(runnable.plugin.name, service)])

    def is_listed(self, plugin_name: str, service: ManifestService) -> bool:
        return service.is_listed(self.sockets.pid(plugin_name, service.name))

    def row(self, plugin_name: str, service: ManifestService, health: PluginHealth | None) -> PluginServicesSubcommandRowRecord:
        pid_file = self.sockets.pid(plugin_name, service.name)
        pid = int(FileAccess.shared().read(pid_file)) if pid_file.is_file() else None
        running = pid is not None and self.alive(pid) and (health is None or PluginServices.is_healthy(self.sockets.health(plugin_name, service.name), health))
        return {"id": f"{plugin_name} {service.name}", "plugin": plugin_name, "service": service.name, "restart": service.restart.value, "running": running, "pid": pid if running else None}

    @staticmethod
    def alive(pid: int) -> bool:
        try:
            os.kill(pid, 0)
            return True
        except (ProcessLookupError, PermissionError):
            return False

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, RowList):
            output.write("\n".join(f"{row['id']}: {'running' if row['running'] else 'stopped'}" for row in value.rows) or "no services", value.json())
