from dataclasses import dataclass

from engine.command.command import Command
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.context_change_requests import PERSON_REASON


@dataclass(frozen=True)
class ChooseAgentControl(Command[Agent]):
    """Applies one choice of the agent bar to a running agent's program, by typing the line the program takes
    for it. A choice that compacts or clears the context carries why it is asked: a person, unless a rule says
    otherwise."""

    lock = False

    agent_id: int
    key: str
    value: str
    reason: str = PERSON_REASON
