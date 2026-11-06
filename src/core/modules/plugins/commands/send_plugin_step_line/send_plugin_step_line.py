from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class SendPluginStepLine(Command[None]):
    """Tells an agent and the agent that started it what a plugin said about a step it did not hold."""

    agent_id: int
    text: str
