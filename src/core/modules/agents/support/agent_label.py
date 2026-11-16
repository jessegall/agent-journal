from dataclasses import dataclass
from typing import Self

from engine.agent.agent_name import AgentName
from core.modules.agents.models.agent import Agent

AGENT_WORD = "agent"


@dataclass(frozen=True)
class AgentLabel:
    """How a text names an agent: the word for what it is and its id, such as helper 5, and main agent for
    the main agent. Every text that names an agent uses this."""

    word: str
    agent_id: int

    @classmethod
    def labelled(cls, agent: Agent) -> Self:
        return cls(agent.role, agent.id)

    @classmethod
    def labelled_row(cls, agent_id: int, word: str = AGENT_WORD) -> Self:
        return cls(word, agent_id)

    @property
    def text(self) -> str:
        return AgentName(self.word, self.agent_id).label
