from engine.database.row_history import RowHistory
from collections.abc import Sequence

from engine.enums.actor_type import ActorType
from engine.event.event_log import EventLog
from engine.database.kept_rows import KeptRows
from engine.model.model import Model
from engine.model.tables import Tables
from engine.time.timestamp import Timestamp
from engine.query.conditions.among import Among
from engine.query.conditions.minimum import Minimum
from engine.query.queries import Queries
from engine.query.query import Query
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import ENDED_FIELD, Agent
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.enums.wait_type import WORK_ENDED_TYPES
from core.modules.waits.models.wait import Wait

STOPPING_ACTOR_TYPES = (ActorType.USER, ActorType.AGENT)
AGENT_ENDING_EVENTS = ("agent.update", "agent.end")


class WorkerStop:
    """Whether a worker was stopped on purpose: ended by a user or by another agent, and not by itself or the
    journal, so the journal does not start it again. The answer is read once from the worker's ending events
    and kept until the worker's row changes."""

    def __init__(self, queries: Queries, log: EventLog, tables: Tables, kept: KeptRows) -> None:
        self.queries, self.log, self.tables, self.kept = queries, log, tables, kept

    def is_final(self, worker: Agent, actor_id: int) -> bool:
        return actor_id != worker.id and self.queries.query(ActorRecord).find(actor_id).type in STOPPING_ACTOR_TYPES

    def was_stopped(self, worker: Agent) -> bool:
        return self.kept.read(self.queries.query(Agent).filter(id=worker.id), lambda: self.has_final_ending(worker), name="workers.worker_stopped")

    def has_final_ending(self, worker: Agent) -> bool:
        events = self.log.newest_row_events(RowHistory(self.tables.table(Agent).name, worker.id, names=AGENT_ENDING_EVENTS))
        endings = [event for event in events if event.data.get(ENDED_FIELD, (None, None))[1]]
        return bool(endings) and self.is_final(worker, endings[-1].actor_id)

    def is_job_due(self, worker: Agent, work: Sequence[Model]) -> bool:
        ended_at = worker.ended_at
        if ended_at is not None and any(row.creation_timestamp().value > ended_at.value for row in work):
            return True
        return not self.was_stopped(worker)

    def has_open_help_request(self, worker_id: int) -> bool:
        requests = self.open_help_requests(worker_id)
        return self.kept.read(requests, requests.exists, name="workers.open_help_request")

    def open_help_requests(self, worker_id: int) -> Query[Wait]:
        return self.queries.query(Wait).filter(session_agent_id=worker_id, state=WaitState.OPEN).matching(Among("type", WORK_ENDED_TYPES))

    def has_help_request_opened_after(self, worker_id: int, opened_after: Timestamp) -> bool:
        requests = self.open_help_requests(worker_id).matching(Minimum("opened_at", opened_after.text))
        return self.kept.read(requests, requests.exists, name="workers.help_request_opened_after")
