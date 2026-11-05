from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.base.page import Page
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process


class QueueRunWorkers:
    """The workers responsible for the processes on one queue page."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def read(self, page: Page[Process]) -> dict[int, int]:
        if not page.rows:
            return {}
        agent_ids = tuple({process.session_agent_id for process in page.rows})
        workers = {worker.id for worker in self.queries.query(Agent).filter(role=AgentRole.WORKER).matching(Among("id", agent_ids)).limited(page.size)}
        return {process.id: process.session_agent_id for process in page.rows if process.session_agent_id in workers}
