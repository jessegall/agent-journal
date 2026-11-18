from engine.command.bus import Bus
from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener
from engine.listener.rows.event_rows import EventRows
from engine.module.module_actors import ModuleActors
from core.modules.processes.models.enums.reading_phase import ReadingPhase
from core.modules.processes.models.process import Process
from core.modules.processes.support.reading.recorded_decisions import RecordedDecisions
from core.modules.processes.support.run_visibility import RunVisibility
from core.modules.processes.commands.send_reading_notices.send_reading_notices import SendReadingNotices
from core.modules.processes.commands.store_end_decisions.store_end_decisions import StoreEndDecisions
from core.modules.processes.events.output_ended import OutputEnded
from core.modules.processes.listeners.process_end_mark_listener import MODULE_NAME


class EndDecisionListener(CommitListener[OutputEnded]):
    """Keeps the reading decision of a run once its output has all its text, after the run's end is saved, so
    ending a run never waits for the judge, and then tells the run's agent how to read such a run better. The output is
    read and the readers judged before the write, so the write turn is held only to keep the decisions."""

    name = "processes.end-decision"

    def __init__(self, bus: Bus, actors: ModuleActors, rows: EventRows, visibility: RunVisibility, trial: RecordedDecisions) -> None:
        self.bus, self.actors, self.rows, self.visibility, self.shadow = bus, actors, rows, visibility, trial

    def handle(self, event: OutputEnded, logged: LoggedEvent) -> None:
        process = self.rows.required(Process, event.row.process_id)
        decided = self.shadow.decided(process, self.visibility.shown_parts(process), ReadingPhase.END)
        self.bus.run(StoreEndDecisions(process.id, decided), self.actors.actor(MODULE_NAME), cause_id=logged.id)
        self.bus.run(SendReadingNotices(event.row.process_id), self.actors.actor(MODULE_NAME), cause_id=logged.id)
