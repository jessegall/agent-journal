from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.sequences.commands.move_sequence_run.move_sequence_run import END, MoveSequenceRun
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery


class SequenceEndListener(CommitListener):
    """Ends the run a row started when that row reaches an event its sequence ends on."""

    name = "sequences.end"
    event = "*.*"

    def __init__(self, queries: Queries, runs: SequenceRunQuery, bus: Bus) -> None:
        self.queries, self.runs, self.bus = queries, runs, bus

    def handle(self, event: LoggedEvent) -> None:
        for run in self.runs.filter(subject_id=event.row_id).matching(IsNull("ended_at")).all_rows():
            if self.queries.query(Sequence).find(run.sequence_id).has_end_event(event.event):
                self.bus.run(MoveSequenceRun(END, reason=event.event), Actor(run.agent_id, ActorType.AGENT), cause_id=event.id, environment_id=event.environment_id)
