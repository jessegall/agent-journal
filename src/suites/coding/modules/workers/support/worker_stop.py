from collections.abc import Sequence

from core.base.actor_type import ActorType
from core.base.change.event_log import EventLog
from core.base.model.model import Model
from core.base.model.tables import Tables
from core.base.query.queries import Queries
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import ENDED_FIELD, Agent
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.enums.wait_type import WaitType
from core.modules.waits.models.wait import Wait

STOPPING_ACTOR_TYPES = (ActorType.USER, ActorType.AGENT)
AGENT_ENDING_EVENTS = ("agent.update", "agent.end")


class WorkerStop:
    """Whether a worker was stopped on purpose: ended by a person or by another agent, and not by itself or the
    journal, so the journal does not start it again."""

    def __init__(self, queries: Queries, log: EventLog, tables: Tables) -> None:
        self.queries, self.log, self.tables = queries, log, tables

    def is_final(self, worker: Agent, actor_id: int) -> bool:
        return actor_id != worker.id and self.queries.query(ActorRecord).find(actor_id).type in STOPPING_ACTOR_TYPES

    def was_stopped(self, worker: Agent) -> bool:
        events = self.log.row_events(self.tables.table(Agent).name, worker.id)
        endings = [event for event in events if event.event in AGENT_ENDING_EVENTS and event.data.get(ENDED_FIELD, (None, None))[1]]
        return bool(endings) and self.is_final(worker, endings[-1].actor_id)

    def is_job_due(self, worker: Agent, work: Sequence[Model]) -> bool:
        if any(row.creation_timestamp().value > worker.ended_at.value for row in work):
            return True
        return not self.was_stopped(worker)

    def has_open_help_request(self, worker_id: int) -> bool:
        return self.queries.query(Wait).filter(session_agent_id=worker_id, state=WaitState.OPEN, type=WaitType.HELP_REQUEST).exists()
