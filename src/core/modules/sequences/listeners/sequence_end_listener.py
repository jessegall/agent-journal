from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit.commit_listener import CommitListener
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.among import Among
from core.modules.sequences.commands.move_sequence_run.move_sequence_run import END, MoveSequenceRun
from core.modules.sequences.support.sequence_events import SequenceEvents
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from engine.event.touched import Touched
from engine.model.model import Model


class SequenceEndListener(CommitListener[Touched[Model]]):
    """Ends the run a row started when that row reaches an event its sequence ends on."""

    name = "sequences.end"

    def __init__(self, events: SequenceEvents, runs: SequenceRunQuery, bus: Bus) -> None:
        self.events, self.runs, self.bus = events, runs, bus

    def handle(self, event: Touched[Model], logged: LoggedEvent) -> None:
        sequence_ids = self.events.ending(logged.event)
        if not sequence_ids:
            return
        for run in self.runs.filter(subject_id=logged.row_id).matching(IsNull("ended_at")).matching(Among("sequence_id", tuple(sequence_ids))).all_rows():
            self.bus.run(MoveSequenceRun(END, reason=logged.event, run_id=run.id), Actor(run.session_agent_id, ActorType.AGENT), cause_id=logged.id)
