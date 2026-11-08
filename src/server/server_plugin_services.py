from core.base.database.database import Database
from core.base.journal_container import synced_container
from core.base.journal_home import JournalHome
from core.modules.plugins.commands.support.plugin_health_check import PluginHealthCheck
from core.modules.plugins.commands.support.plugin_service_round import PluginServiceRound
from core.modules.plugins.support.login_path import LoginPath
from core.modules.plugins.support.service_processes import ServiceProcesses


class ServerPluginServices:
    """The plugin services the server keeps running: followed on a timer while the server runs, so a service
    that ended is started again and a switched off plugin's services stop, each round first making sure the
    login shell's PATH is known so a service finds its tools, their health checked on a timer of its own, and
    all stopped with the server."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home
        self.processes = ServiceProcesses.shared(home)
        self.processes.serving = True

    def follow(self) -> None:
        LoginPath(self.home).fill_missing()
        self.run_job(PluginServiceRound)

    def check_health(self) -> None:
        self.run_job(PluginHealthCheck)

    def run_job(self, job: type[PluginServiceRound] | type[PluginHealthCheck]) -> None:
        container = synced_container(self.home)
        try:
            container.get(job).run(self.processes)
        finally:
            container.get(Database).close()

    def close(self) -> None:
        self.processes.close()
