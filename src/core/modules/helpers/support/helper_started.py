from dataclasses import dataclass

from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class HelperStarted:
    """A helper that started, and when its profile's other program had to run it, which program was preferred and why
    it could not start."""

    agent: Agent
    note: str = ""
