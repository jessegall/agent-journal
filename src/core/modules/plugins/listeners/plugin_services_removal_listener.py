from core.base.change.deleted import Deleted
from core.base.change.logged_event import LoggedEvent
from engine.journal.journal_home import JournalHome
from core.base.listener.commit_listener import CommitListener
from core.modules.plugins.commands.support.plugin_service_round import PluginServiceRound
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.service_processes import ServiceProcesses


class PluginServicesRemovalListener(CommitListener[Deleted[Plugin]]):
    """Once a plugin is removed, stops its services before the command that removed it reports done."""

    name = "plugins.services-removal"

    def __init__(self, home: JournalHome, round: PluginServiceRound) -> None:
        self.home, self.round = home, round

    def handle(self, event: Deleted[Plugin], logged: LoggedEvent) -> None:
        processes = ServiceProcesses.shared(self.home)
        if processes.serving:
            self.round.run(processes)
