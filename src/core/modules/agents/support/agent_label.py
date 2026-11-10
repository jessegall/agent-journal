from dataclasses import dataclass
from typing import Self

from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from core.modules.agents.models.agent import MAIN_ROLE, Agent

MAIN_LABEL = "main agent"
AGENT_WORD = "agent"


@dataclass(frozen=True)
class AgentLabel:
    """How a text names an agent: the word for what it is and its number in its environment, such as
    helper 5, and main agent for the main agent. Every text that names an agent uses this."""

    word: str
    number: int

    @classmethod
    def from_agent(cls, agent: Agent) -> Self:
        return cls(agent.role, agent.number)

    @classmethod
    def from_row_id(cls, agent_id: int, numbers: RowNumbers, word: str = AGENT_WORD) -> Self:
        return cls(word, numbers.number(AGENT_MODEL_NAME, agent_id))

    @property
    def text(self) -> str:
        return MAIN_LABEL if self.word == MAIN_ROLE else f"{self.word.lower()} {self.number}"
