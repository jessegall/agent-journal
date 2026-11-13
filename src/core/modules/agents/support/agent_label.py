from dataclasses import dataclass
from typing import Self

from engine.agent.agent_name import AgentName
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from core.modules.agents.models.agent import Agent

AGENT_WORD = "agent"


@dataclass(frozen=True)
class AgentLabel:
    """How a text names an agent: the word for what it is and its number in its environment, such as
    helper 5, and main agent for the main agent. Every text that names an agent uses this."""

    word: str
    number: int

    @classmethod
    def labelled(cls, agent: Agent) -> Self:
        return cls(agent.role, agent.number)

    @classmethod
    def labelled_row(cls, agent_id: int, numbers: RowNumbers, word: str = AGENT_WORD) -> Self:
        return cls(word, numbers.number(AGENT_MODEL_NAME, agent_id))

    @property
    def text(self) -> str:
        return AgentName(self.word, self.number).label
