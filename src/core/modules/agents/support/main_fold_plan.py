from collections.abc import Sequence
from dataclasses import dataclass

from engine.enums.agent_role import AgentRole
from core.modules.agents.models.agent import MAIN_NUMBER, Agent


@dataclass(frozen=True)
class EnvironmentFold:
    """The main agent row of one environment that survives, and the main rows folded into it."""

    environment_id: int
    survivor: Agent
    folded: tuple[Agent, ...]


class MainFoldPlan:
    """Chooses, in each environment with more than one main row, the row that survives: the running one, else
    the one numbered 1, else the newest; every other main row of the environment folds into it."""

    @staticmethod
    def folds(agents: Sequence[Agent]) -> tuple[EnvironmentFold, ...]:
        mains = [agent for agent in agents if agent.role == AgentRole.MAIN]
        environments = sorted({agent.environment_id for agent in mains})
        found = (MainFoldPlan.environment_fold(environment_id, [agent for agent in mains if agent.environment_id == environment_id]) for environment_id in environments)
        return tuple(fold for fold in found if fold.folded)

    @staticmethod
    def environment_fold(environment_id: int, mains: list[Agent]) -> EnvironmentFold:
        survivor = MainFoldPlan.survivor(mains)
        return EnvironmentFold(environment_id, survivor, tuple(agent for agent in mains if agent.id != survivor.id))

    @staticmethod
    def survivor(mains: list[Agent]) -> Agent:
        running = [agent for agent in mains if agent.ended_at is None]
        if running:
            return max(running, key=lambda agent: agent.id)
        numbered = [agent for agent in mains if agent.number == MAIN_NUMBER]
        if numbered:
            return numbered[0]
        return max(mains, key=lambda agent: agent.id)
