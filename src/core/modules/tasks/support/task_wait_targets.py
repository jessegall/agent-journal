from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.database.database import Database
from engine.database.statement import Statement
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.enums.agent_role import AgentRole
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.agents.support.agent_label import AgentLabel

TARGET_TABLES = {"task": "tasks", "question": "questions", "plan": "plans"}
FINISHED_STATES = ("completed", "cancelled", "answered", "closed")


class TaskWaitTargets:
    """Validates the rows a task can wait on and returns their stored references. A helper is named by its
    number in the environment of the line."""

    def __init__(self, database: Database, queries: Queries, numbers: RowNumbers) -> None:
        self.database, self.queries, self.numbers = database, queries, numbers

    def agent_row_id(self, number: int) -> int:
        return self.numbers.row_id(AGENT_MODEL_NAME, number, self.database.scope_environment_id)

    @property
    def target_types(self) -> tuple[str, ...]:
        return (*TARGET_TABLES, "helper")

    @property
    def target_help(self) -> str:
        choices = [f"--on {target}:<n>" for target in self.target_types]
        return f"write {', '.join(choices[:-1])} or {choices[-1]}"

    def target(self, target_type: str, row_id: int) -> str:
        if target_type == "helper":
            return self.helper_target(self.agent_row_id(row_id))
        table = TARGET_TABLES.get(target_type)
        if table is None:
            raise Refusal(f"{target_type}:{row_id} gives nothing to wait on", self.target_help)
        rows = self.database.rows(Statement.row_state(table, row_id))
        if not rows:
            raise Refusal(f"{target_type} {row_id} does not exist", "name a row that does")
        if rows[0]["state"] in FINISHED_STATES:
            raise Refusal(f"{target_type} {row_id} is {rows[0]['state']} already", "nothing waits on it; carry on with the task")
        return f"{table}:{row_id}"

    def helper_target(self, row_id: int) -> str:
        helper = self.queries.query(Agent).find(row_id)
        if helper.role == AgentRole.MAIN:
            raise Refusal("the main agent is no helper", "name a helper")
        job = self.queries.query(HelperJob).filter(helper_id=row_id).newest().first()
        if job is None or job.ended_at is not None:
            raise Refusal(f"{AgentLabel.from_agent(helper).text} has no open job", "nothing waits on it; carry on with the task")
        return f"helpers:{helper.id}:{job.id}"
