from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.sequences.commands.move_sequence_run.move_sequence_run import MoveSequenceRun, START
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.sequences.support.sequence_trigger import ROW_TRIGGER
from core.modules.sequences.support.sequence_triggers import SequenceTriggers
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.sequences.rules.sequence_trigger_rule import EMPTY_TRIGGERS


class SequenceRowTriggerListener(CommitListener):
    """An event a sequence names as its trigger starts that sequence for the agent that caused it, subagent or
    worker too, or for the environment's main agent when no agent did, unless one is running."""

    name = "sequences.row-trigger"
    event = "*.*"

    def __init__(self, queries: Queries, runs: SequenceRunQuery, bus: Bus) -> None:
        self.queries, self.runs, self.bus = queries, runs, bus

    def handle(self, event: LoggedEvent) -> None:
        sequence = next((row for row in self.queries.query(Sequence).all_rows() if row.triggers != EMPTY_TRIGGERS and self.is_triggered(row, event)), None)
        if sequence is None:
            return
        agent_id = self.acting_agent_id(event)
        if agent_id is not None and self.runs.current(agent_id) is None:
            self.bus.run(MoveSequenceRun(START, sequence.id), Actor(agent_id, ActorType.AGENT), cause_id=event.id, environment_id=event.environment_id)

    def acting_agent_id(self, event: LoggedEvent) -> int | None:
        if self.queries.query(ActorRecord).find(event.actor_id).type is ActorType.AGENT:
            return event.actor_id
        agents = MainAgentFinder.rows(self.queries, event.environment_id) if event.environment_id is not None else ()
        return agents[0].id if agents else None

    @staticmethod
    def is_triggered(sequence: Sequence, event: LoggedEvent) -> bool:
        return any(trigger.trigger_type == ROW_TRIGGER and trigger.event == event.event for trigger in SequenceTriggers.parsed(sequence.triggers))
