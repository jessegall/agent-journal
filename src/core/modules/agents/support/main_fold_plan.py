from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from engine.enums.agent_role import AgentRole
from core.modules.agents.models.agent import MAIN_NUMBER


@dataclass(frozen=True)
class MainRow:
    """The fields of a main agent row that decide a fold."""

    id: int
    environment_id: int
    number: int
    role: str
    ended_at: str | None

    @classmethod
    def from_row(cls, row: Mapping[str, object]) -> "MainRow":
        return cls(int(row["id"]), int(row["environment_id"]), int(row["number"]), str(row["role"]), None if row["ended_at"] is None else str(row["ended_at"]))


@dataclass(frozen=True)
class EnvironmentFold:
    """The main agent row of one environment that survives, and the main rows folded into it."""

    environment_id: int
    survivor: MainRow
    folded: tuple[MainRow, ...]


class MainFoldPlan:
    """Chooses, in each environment with more than one main row, the row that survives: the running one, else
    the one numbered 1, else the newest; every other main row of the environment folds into it."""

    @staticmethod
    def folds(agents: Sequence[MainRow]) -> tuple[EnvironmentFold, ...]:
        mains = [agent for agent in agents if agent.role == AgentRole.MAIN]
        environments = sorted({agent.environment_id for agent in mains})
        found = (MainFoldPlan.environment_fold(environment_id, [agent for agent in mains if agent.environment_id == environment_id]) for environment_id in environments)
        return tuple(fold for fold in found if fold.folded)

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
