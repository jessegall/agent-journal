from collections.abc import Sequence

from engine.query.conditions.among import Among
from engine.query.conditions.greater import Greater
from engine.query.queries import Queries
from engine.time.timestamp import Timestamp
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.reviews.models.enums.review_state import ReviewState
from core.modules.reviews.models.review import Review
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.wait import Wait
from suites.coding.modules.workers.models.enums.proof_state import TEST_WAITING_STATES
from suites.coding.modules.workers.models.proof import Proof

WAITING_WORK_REASON = "every run, wait, proof, review and request that keeps an agent waiting is counted"


class MainAgentWork:
    """Whether an agent waits on something of its own, read one way by the main agent's stop rule and by the lines
    that wake silent agents: a run, a wait, a proof's test, a review or a reader request."""

    def __init__(self, queries: Queries, processes: ProcessQuery) -> None:
        self.queries, self.processes = queries, processes

    def waiting_agents(self, agent_ids: Sequence[int], timestamp: Timestamp) -> set[int]:
        waiting = {row.session_agent_id for row in self.processes.running().every_row(WAITING_WORK_REASON)}
        waiting.update(row.session_agent_id for row in self.queries.query(Wait).matching(Among("session_agent_id", agent_ids)).filter(state=WaitState.OPEN).every_row(WAITING_WORK_REASON))
        waiting.update(row.creator_id for row in self.queries.query(Proof).matching(Among("creator_id", agent_ids)).matching(Among("state", TEST_WAITING_STATES)).every_row(WAITING_WORK_REASON))
        waiting.update(row.requester_id for row in self.queries.query(Review).matching(Among("state", [ReviewState.QUEUED, ReviewState.REVIEWING])).every_row(WAITING_WORK_REASON))
        waiting.update(row.creator_id for row in self.queries.query(ReaderRequest).matching(Among("creator_id", agent_ids)).filter(completed_at=None)
                       .matching(Greater("expires_at", timestamp.text)).every_row(WAITING_WORK_REASON))
        return waiting
