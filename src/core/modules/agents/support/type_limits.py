from collections.abc import Iterable
from dataclasses import dataclass

from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class TypeLimits:
    """The running and retained limits for one agent type."""

    run: int
    kept: int

    @staticmethod
    def retirement_instruction(agents: Iterable[Agent]) -> str:
        stopped = next((agent for agent in agents if agent.ended_at is not None), None)
        return "all of them run: wait for a report" if stopped is None else f'journal agent retire {stopped.id} --reason "<why>"'
