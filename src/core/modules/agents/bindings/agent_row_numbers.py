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
    the environment has is refused with one text, whether or not an agent of another environment has it. A line
    that runs in no environment has no numbering to read, so there the number is the row id."""

    def __init__(self, queries: Queries, scopes: Scopes, environments: EnvironmentRows) -> None:
        self.queries, self.scopes, self.environments = queries, scopes, environments

    def row_id(self, model_name: str, number: int, environment_id: int | None) -> int:
        self.check_model(model_name)
        if environment_id is None:
            return number
        with self.scopes.opened(None, environment_id):
            agent = self.queries.query(Agent).filter(number=number).first()
        if agent is None:
            raise Refusal(f"no agent {number} in environment {self.environments.find(environment_id).name}", "journal agent list")
        return agent.id

    def number(self, model_name: str, row_id: int) -> int:
        self.check_model(model_name)
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            return self.queries.query(Agent).find(row_id).number

    @staticmethod
    def check_model(model_name: str) -> None:
        if model_name != AGENT_MODEL_NAME:
            raise ValueError(f"only agents are numbered, not {model_name}")
