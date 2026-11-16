from dataclasses import dataclass

from engine.command.command import Command
from engine.driver.agent_message import AgentMessage


@dataclass(frozen=True)
class PhraseTriggerAnswer:
    """What the phrase triggers answered one hook: the line of a trigger that refuses it, the lines of the
    others, the skill a trigger holds the agent to before its next tools, with the line that asks for it, and
    the commands that fire them and request the skill."""

    refusal: AgentMessage | None
    agent_messages: tuple[AgentMessage, ...]
    skill_block: tuple[AgentMessage, str] | None
    commands: tuple[Command[object], ...]
