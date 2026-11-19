from dataclasses import dataclass

from engine.command.command import Command
from core.modules.drivers.models.agent_escalation import AgentEscalation


@dataclass(frozen=True)
class AnswerEscalation(Command[AgentEscalation]):
    """The responder's answer to an escalation: the agent goes on with these words, its deferrals and counts
    cleared."""

    lock = True

    escalation_id: int
    text: str
