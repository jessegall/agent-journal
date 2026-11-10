from abc import ABC, abstractmethod

from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent


class WorkerRecoveryReports(ABC):
    """Reports a failed attempt to resume or stop an agent."""

    @abstractmethod
    def report(self, agent: Agent, reason: str, inactive_at: Timestamp) -> None:
        raise NotImplementedError
