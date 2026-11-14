from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.errors.refusal import Refusal
from engine.event.journal_booting import JournalBooting
from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.rules.support.run_folder_ends import RunFolderEnds
from core.modules.processes.commands.orphan_process.orphan_process import OrphanProcess
from core.modules.processes.support.output_folder import OutputFolder

BOOT_RUNS_REASON = "at a start every run marked running is checked for a process that is gone"


class BootedRunsListener(CommitListener[JournalBooting]):
    """As the journal starts, ends each run still marked running whose process is gone, at once and not after the
    waiting time of the run end recovery: from the end its folder holds, or else as lost. A run whose process
    still lives is left to run."""

    name = "processes.booted-runs"

    def __init__(self, bus: Bus, processes: ProcessQuery, folder: OutputFolder, ends: RunFolderEnds) -> None:
        self.bus, self.processes, self.folder, self.ends = bus, processes, folder, ends

    def handle(self, event: JournalBooting, logged: LoggedEvent) -> None:
        for process in tuple(self.processes.running().oldest().every_row(BOOT_RUNS_REASON)):
            if self.folder.has_leader_process(process.id):
                continue
            try:
                for command in self.ends.commands(process) or [OrphanProcess(process.id)]:
                    self.bus.run(command, Actor.core(), cause_id=logged.id, environment_id=process.environment_id)
            except Refusal:
                continue
