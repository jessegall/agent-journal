from core.base.change.changed import Changed
from core.base.change.logged_event import LoggedEvent
from engine.journal.journal_home import JournalHome
from core.base.listener.commit_listener import CommitListener
from core.modules.plugins.commands.support.plugin_service_round import PluginServiceRound
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.service_processes import ServiceProcesses


class PluginServicesUpgradeListener(CommitListener[Changed[Plugin]]):
    """Once an upgrade has changed the files of a plugin, starts its services again with the new code before
    the command that upgraded it reports done, in the set of services the server keeps, so the first
    judging after an upgrade finds them running."""

    name = "plugins.services-upgrade"

    def __init__(self, home: JournalHome, round: PluginServiceRound) -> None:
        self.home, self.round = home, round

    def handle(self, event: Changed[Plugin], logged: LoggedEvent) -> None:
        processes = ServiceProcesses.shared(self.home)
        files_differ = processes.serving and event.old_row is not None and event.old_row.files_digest != event.row.files_digest
        if files_differ:
            self.round.run(processes)
