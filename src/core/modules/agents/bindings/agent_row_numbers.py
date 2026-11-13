from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.scope.environment_scope import EnvironmentScope
from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.fold_record import FoldRecord
from core.modules.environments.support.environment_rows import EnvironmentRows


class AgentRowNumbers(RowNumbers):
    """Finds the agent that has a number in one environment, and the number of an agent. A number no agent of
    the environment has is refused with one text, whether or not an agent of another environment has it.
    A line that runs in no environment has no numbering to read and is refused. The id or number of a main
    agent row folded into the environment's main agent finds that main agent."""

    def __init__(self, queries: Queries, scopes: Scopes, environments: EnvironmentRows, folds: FoldRecord) -> None:
        self.queries, self.scopes, self.environments, self.folds = queries, scopes, environments, folds

    def row_id(self, model_name: str, number: int, environment_id: int | None) -> int:
        label = f"agent {number}"
        environment = self.environment_of(label, environment_id)
        with self.scopes.opened(None, environment):
            survivor_id = self.folds.number_holder(number)
        return survivor_id if survivor_id is not None else self.environment_agent(model_name, environment, label, number=number).id

    def number(self, model_name: str, row_id: int) -> int:
        self.check_model(model_name)
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            return self.queries.query(Agent).find(self.folds.agent_id(row_id)).number

    def numbers(self, model_name: str, row_ids: set[int]) -> dict[int, int]:
        self.check_model(model_name)
        if not row_ids:
            return {}
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            agent_index = self.folds.agent_ids(row_ids)
            numbers = {agent.id: agent.number for agent in self.queries.query(Agent).find_many(list(set(agent_index.values())))}
        return {row_id: numbers[agent_id] for row_id, agent_id in agent_index.items() if agent_id in numbers}

    def environment_number(self, model_name: str, row_id: int, environment_id: int | None) -> int:
        return self.environment_agent(model_name, environment_id, f"agent with row {row_id}", id=self.folds.agent_id(row_id)).number

    @staticmethod
    def environment_of(label: str, environment_id: int | None) -> int:
        if environment_id is None:
            raise Refusal(f"{label} is read in an environment, and this line runs in none", "name the environment with --environment")
        return environment_id

    def environment_agent(self, model_name: str, environment_id: int | None, label: str, **column: int) -> Agent:
        self.check_model(model_name)
        environment_id = self.environment_of(label, environment_id)
        with self.scopes.opened(None, environment_id):
            agent = self.queries.query(Agent).filter(**column).first()
        if agent is None:
            raise Refusal(f"no {label} in environment {self.environments.find(environment_id).name}", "journal agent list")
        return agent

    @staticmethod
    def check_model(model_name: str) -> None:
        if model_name != AGENT_MODEL_NAME:
            raise ValueError(f"only agents are numbered, not {model_name}")
