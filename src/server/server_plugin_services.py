from core.base.database.database import Database
from core.base.journal_container import synced_container
from core.base.journal_home import JournalHome
from core.modules.plugins.commands.support.plugin_health_check import PluginHealthCheck
from core.modules.plugins.support.plugin_services import PluginServices
from core.modules.plugins.support.service_processes import ServiceProcesses


class ServerPluginServices:
    """The plugin services the server keeps running: followed on a timer while the server runs, so a service
    that ended is started again and a switched off plugin's services stop, their health checked on a timer of
    its own, and all stopped with the server."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home
        self.processes = ServiceProcesses()

    def follow(self) -> None:
        container = synced_container(self.home)
        try:
            container.get(PluginServices).follow(self.processes)
        finally:
            container.get(Database).close()

    def check_health(self) -> None:
        container = synced_container(self.home)
        try:
            container.get(PluginHealthCheck).run(self.processes)
        finally:
            container.get(Database).close()

    def close(self) -> None:
        self.processes.close()
