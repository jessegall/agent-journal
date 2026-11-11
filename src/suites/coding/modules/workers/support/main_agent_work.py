from collections import defaultdict
from collections.abc import Sequence

from engine.query.conditions.among import Among
from engine.query.conditions.greater import Greater
from engine.query.queries import Queries
from engine.time.timestamp import Timestamp
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.reviews.models.enums.review_state import ReviewState
from core.modules.reviews.models.review import Review
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TASK_PAGE_ROWS
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.wait import Wait
from suites.coding.modules.workers.models.enums.proof_state import TEST_WAITING_STATES
from suites.coding.modules.workers.models.proof import Proof


class MainAgentWork:
    """The work an agent has not finished, read one way by the main agent's stop rule and by the lines that wake
    silent agents: the open and started tasks it holds or that were delegated to it, read a page at a time,
    and whether it waits on something of its own: a run, a wait, a proof's test, a review or a reader request."""

    def __init__(self, queries: Queries, processes: ProcessQuery) -> None:
        self.queries, self.processes = queries, processes

    def unfinished_tasks(self, agent_ids: Sequence[int]) -> dict[int, tuple[int, ...]]:
        tasks = self.queries.query(Task).matching(Among("state", [TaskState.OPEN, TaskState.STARTED])).ordered("id")
        rows = (*tasks.matching(Among("holder_id", agent_ids)).all_rows(TASK_PAGE_ROWS), *tasks.matching(Among("delegated_to", agent_ids)).all_rows(TASK_PAGE_ROWS))
        task_ids: dict[int, set[int]] = defaultdict(set)
        for task in rows:
            for agent_id in (task.holder_id, task.delegated_to):
                if agent_id is not None and agent_id in agent_ids:
                    task_ids[agent_id].add(task.id)
        return {agent_id: tuple(sorted(ids)) for agent_id, ids in task_ids.items()}

    def waiting_agents(self, agent_ids: Sequence[int], timestamp: Timestamp) -> set[int]:
        waiting = {row.session_agent_id for row in self.processes.running().all_rows()}
        waiting.update(row.session_agent_id for row in self.queries.query(Wait).matching(Among("session_agent_id", agent_ids)).filter(state=WaitState.OPEN).all_rows())
        waiting.update(row.creator_id for row in self.queries.query(Proof).matching(Among("creator_id", agent_ids)).matching(Among("state", TEST_WAITING_STATES)).all_rows())
        waiting.update(row.requester_id for row in self.queries.query(Review).matching(Among("state", [ReviewState.QUEUED, ReviewState.REVIEWING])).all_rows())
        waiting.update(row.creator_id for row in self.queries.query(ReaderRequest).matching(Among("creator_id", agent_ids)).filter(completed_at=None)
                       .matching(Greater("expires_at", timestamp.text)).all_rows())
        return waiting
