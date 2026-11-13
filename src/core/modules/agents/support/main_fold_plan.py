from collections.abc import Sequence

from engine.enums.agent_role import AgentRole
from core.modules.agents.models.agent import MAIN_NUMBER
from core.modules.agents.support.main_row import MainRow
from core.modules.agents.support.environment_fold import EnvironmentFold


class MainFoldPlan:
    """Chooses, in each environment with more than one main row, the row that survives: the running one, else
    the one numbered 1, else the newest; every other main row of the environment folds into it."""

    @staticmethod
    def folds(agents: Sequence[MainRow]) -> tuple[EnvironmentFold, ...]:
        main_agents = [agent for agent in agents if agent.role == AgentRole.MAIN]
        environments = sorted({agent.environment_id for agent in main_agents})
        matched = (MainFoldPlan.environment_fold(environment_id, [agent for agent in main_agents if agent.environment_id == environment_id]) for environment_id in environments)
        return tuple(fold for fold in matched if fold.folded)

    @staticmethod
    def environment_fold(environment_id: int, mains: list[MainRow]) -> EnvironmentFold:
        survivor = MainFoldPlan.survivor(mains)
        return EnvironmentFold(environment_id, survivor, tuple(agent for agent in mains if agent.id != survivor.id))

    @staticmethod
    def survivor(mains: list[MainRow]) -> MainRow:
        running = [agent for agent in mains if agent.ended_at is None]
        if running:
            return max(running, key=lambda agent: agent.id)
        numbered = [agent for agent in mains if agent.number == MAIN_NUMBER]
        if numbered:
            return numbered[0]
        return max(mains, key=lambda agent: agent.id)
