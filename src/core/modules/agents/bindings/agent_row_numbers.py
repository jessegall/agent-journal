from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.scope.environment_scope import EnvironmentScope
from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.environments.support.environment_rows import EnvironmentRows


class AgentRowNumbers(RowNumbers):
    """Finds the agent that has a number in one environment, and the number of an agent. A number no agent of
    the environment has is refused with one text, whether or not an agent of another environment has it.
    A line that runs in no environment has no numbering to read and is refused."""

    def __init__(self, queries: Queries, scopes: Scopes, environments: EnvironmentRows) -> None:
        self.queries, self.scopes, self.environments = queries, scopes, environments

    def row_id(self, model_name: str, number: int, environment_id: int | None) -> int:
        return self.environment_agent(model_name, environment_id, f"agent {number}", number=number).id

    def number(self, model_name: str, row_id: int) -> int:
        self.check_model(model_name)
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            return self.queries.query(Agent).find(row_id).number

    def environment_number(self, model_name: str, row_id: int, environment_id: int | None) -> int:
        return self.environment_agent(model_name, environment_id, f"agent with row {row_id}", id=row_id).number

    def environment_agent(self, model_name: str, environment_id: int | None, label: str, **column: int) -> Agent:
        self.check_model(model_name)
        if environment_id is None:
            raise Refusal(f"{label} is read in an environment, and this line runs in none", "name the environment with --environment")
        with self.scopes.opened(None, environment_id):
            agent = self.queries.query(Agent).filter(**column).first()
        if agent is None:
            raise Refusal(f"no {label} in environment {self.environments.find(environment_id).name}", "journal agent list")
        return agent

    @staticmethod
    def check_model(model_name: str) -> None:
        if model_name != AGENT_MODEL_NAME:
            raise ValueError(f"only agents are numbered, not {model_name}")
