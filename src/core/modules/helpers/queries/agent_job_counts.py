from collections import defaultdict

from engine.query.conditions.among import Among
from engine.query.conditions.equal import Equal
from engine.query.conditions.excluding import Excluding
from engine.query.conditions.greater import Greater
from engine.query.conditions.has_value import HasValue
from engine.query.queries import Queries
from core.modules.agents.models.agent import MAIN_ROLE, Agent
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.tasks.models.task import Task

WORK_SOURCES = ((HelperJob, "helper_id"), (Task, "delegated_to"))
WORKING_AGENTS_REASON = "The agents that ran a helper job or took a delegated task in the counted days, each read once to name its type and model."


class AgentJobCounts:
    """Counts the helper jobs and the delegated tasks made after a time, by the type and model of their agent, in
    the database, so no job or task row is loaded to be counted."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def counted_after(self, oldest_created_at: str) -> dict[tuple[str, str], int]:
        jobs: dict[int, int] = defaultdict(int)
        for model, agent_column in WORK_SOURCES:
            for agent_id, count in self.queries.query(model).matching(Greater("created_at", oldest_created_at)).matching(HasValue(agent_column)).group_by(agent_column).count_by().items():
                if isinstance(agent_id, int):
                    jobs[agent_id] += count
        counts: dict[tuple[str, str], int] = defaultdict(int)
        agents = self.queries.query(Agent).matching(Among("id", list(jobs))).matching(Excluding(Equal("role", MAIN_ROLE)))
        for agent in agents.every_row(WORKING_AGENTS_REASON):
            counts[agent.use_key] += jobs[agent.id]
        return counts
