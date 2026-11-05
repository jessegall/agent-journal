from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.conditions.is_null import IsNull
from core.modules.sequences.commands.move_sequence_run.move_sequence_run import END, MoveSequenceRun
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.sequences.support.sequence_rows import SequenceRows
from core.base.change.touched import Touched
from core.base.model.model import Model


class SequenceEndListener(CommitListener[Touched[Model]]):
    """Ends the run a row started when that row reaches an event its sequence ends on."""

    name = "sequences.end"

    def __init__(self, runs: SequenceRunQuery, bus: Bus, sequences: SequenceRows) -> None:
        self.runs, self.bus, self.sequences = runs, bus, sequences

    def handle(self, event: Touched[Model], logged: LoggedEvent) -> None:
        ending = {row.id for row in self.sequences.rows() if row.has_end_event(logged.event)}
        if not ending:
            return
        for run in self.runs.matching(IsNull("ended_at")).kept_rows():
            if run.subject_id == logged.row_id and run.sequence_id in ending:
                self.bus.run(MoveSequenceRun(END, reason=logged.event), Actor(run.agent_id, ActorType.AGENT), cause_id=logged.id, environment_id=logged.environment_id)
