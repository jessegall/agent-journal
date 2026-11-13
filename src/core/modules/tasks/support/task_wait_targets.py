from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.database.database import Database
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.enums.agent_role import AgentRole
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.agents.support.agent_label import AgentLabel
from engine.model.model import Model
from engine.registry.registry import Registry

TARGET_MODELS = ("task", "question", "plan")
FINISHED_STATES = ("completed", "cancelled", "answered", "closed")

# the word of --on helper:<n>, a wait on a helper agent by its number
HELPER_TARGET = "helper"


class TaskWaitTargets:
    """Validates the rows a task can wait on and returns their stored references. A helper is named by its
    number in the environment of the line."""

    def __init__(self, database: Database, queries: Queries, numbers: RowNumbers, registry: Registry) -> None:
        self.database, self.queries, self.numbers, self.registry = database, queries, numbers, registry

    def agent_row_id(self, number: int) -> int:
        return self.numbers.row_id(AGENT_MODEL_NAME, number, self.database.scope_environment_id)

    @property
    def target_types(self) -> tuple[str, ...]:
        return (*TARGET_MODELS, HELPER_TARGET)

    @property
    def target_help(self) -> str:
        choices = [f"--on {target}:<n>" for target in self.target_types]
        return f"write {', '.join(choices[:-1])} or {choices[-1]}"

    def target(self, target_type: str, row_id: int) -> str:
        if target_type == HELPER_TARGET:
            return self.helper_target(self.agent_row_id(row_id))
        if target_type not in TARGET_MODELS:
            raise Refusal(f"{target_type}:{row_id} gives nothing to wait on", self.target_help)
        query = self.queries.query(self.registry.models[target_type].model.checked_class(Model))
        row = query.filter(id=row_id).first()
        if row is None:
            raise Refusal(f"{target_type} {row_id} does not exist", "name a row that does")
        if row.state in FINISHED_STATES:
            raise Refusal(f"{target_type} {row_id} is {row.state} already", "nothing waits on it; carry on with the task")
        return f"{query.table.name}:{row_id}"

    def helper_target(self, row_id: int) -> str:
        helper = self.queries.query(Agent).find(row_id)
        if helper.role == AgentRole.MAIN:
            raise Refusal("the main agent is no helper", "name a helper")
        job = self.queries.query(HelperJob).filter(helper_id=row_id).newest().first()
        if job is None or job.ended_at is not None:
            raise Refusal(f"{AgentLabel.labelled(helper).text} has no open job", "nothing waits on it; carry on with the task")
        return f"helpers:{helper.id}:{job.id}"
