from collections import defaultdict

from engine.database.database import Database
from engine.database.statement import Statement
from core.modules.helpers.models.support.views import job_counts_select

WORK_SOURCES = (("helper_jobs", "helper_id"), ("tasks", "delegated_to"))


class AgentJobCounts:
    """Counts the helper jobs and the delegated tasks made after a time, by the type and model of their agent, in
    the database, so no job or task row is loaded to be counted."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def counted_after(self, oldest_created_at: str) -> dict[tuple[str, str], int]:
        environment_id = self.database.scope_environment_id
        counts: dict[tuple[str, str], int] = defaultdict(int)
        for work_table, agent_column in WORK_SOURCES:
            for agent_type, model, count in self.database.rows(Statement(job_counts_select(work_table, agent_column), (oldest_created_at, environment_id, environment_id))):
                counts[(str(agent_type), str(model))] += int(count)
        return counts
