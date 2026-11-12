from collections import defaultdict

from engine.query.conditions.among import Among
from engine.query.conditions.equal import Equal
from engine.query.conditions.excluding import Excluding
from engine.query.conditions.greater import Greater
from engine.query.conditions.has_value import HasValue
from engine.query.queries import Queries
from core.modules.agents.models.agent import MAIN_ROLE, Agent
from core.modules.assignments.models.assignment import Assignment
from core.modules.drivers.models.helper_job import HelperJob

TASK_MODEL = "task"
WORKING_AGENTS_REASON = "The agents that ran a helper job or were assigned a task in the counted days, each read once to name its type and model."


class AgentJobCounts:
    """Counts the helper jobs and the task assignments made after a time, by the type and model of their agent, in
    the database, so no job or task row is loaded to be counted."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def counted_after(self, oldest_created_at: str) -> dict[tuple[str, str], int]:
        jobs: dict[int, int] = defaultdict(int)
        helper_jobs = self.queries.query(HelperJob).matching(Greater("created_at", oldest_created_at)).matching(HasValue("helper_id")).group_by("helper_id")
        assigned = self.queries.query(Assignment).filter(subject_model=TASK_MODEL).matching(Greater("created_at", oldest_created_at)).group_by("actor_id")
        for grouped in (helper_jobs, assigned):
            for agent_id, count in grouped.count_by().items():
                if isinstance(agent_id, int):
                    jobs[agent_id] += count
        counts: dict[tuple[str, str], int] = defaultdict(int)
        agents = self.queries.query(Agent).matching(Among("id", list(jobs))).matching(Excluding(Equal("role", MAIN_ROLE)))
        for agent in agents.every_row(WORKING_AGENTS_REASON):
            counts[agent.use_key] += jobs[agent.id]
        return counts
