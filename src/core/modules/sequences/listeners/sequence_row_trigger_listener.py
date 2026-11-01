from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.sequences.commands.move_sequence_run.move_sequence_run import MoveSequenceRun
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.sequences.support.sequence_triggers import ROW_TRIGGER, SequenceTriggers

START = "start"
NO_TRIGGERS = "[]"


class SequenceRowTriggerListener(CommitListener):
    """An event a sequence names as its trigger starts that sequence for the environment's main agent, unless one is running."""

    name = "sequences.row-trigger"
    event = "*.*"

    def __init__(self, queries: Queries, runs: SequenceRunQuery, bus: Bus) -> None:
        self.queries, self.runs, self.bus = queries, runs, bus

    def handle(self, event: LoggedEvent) -> None:
        if event.environment_id is None:
            return
        sequence = next((row for row in self.queries.query(Sequence).all_rows() if row.triggers != NO_TRIGGERS and self.met(row, event)), None)
        if sequence is None:
            return
        agents = self.queries.query(Agent).filter(environment_id=event.environment_id, role=AgentRole.MAIN).matching(IsNull("ended_at")).newest().page(1, 1).rows
        if agents and self.runs.current(agents[0].id) is None:
            self.bus.run(MoveSequenceRun(START, sequence.id), Actor(agents[0].id, ActorType.AGENT), cause_id=event.id, environment_id=event.environment_id)

    @staticmethod
    def met(sequence: Sequence, event: LoggedEvent) -> bool:
        return any(trigger["trigger_type"] == ROW_TRIGGER and trigger["moment"] == event.event for trigger in SequenceTriggers.parsed(sequence.triggers))
