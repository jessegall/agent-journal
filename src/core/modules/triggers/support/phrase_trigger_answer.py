from dataclasses import dataclass

from engine.command.command import Command
from engine.driver.nudge import Nudge


@dataclass(frozen=True)
class PhraseTriggerAnswer:
    """What the phrase triggers answered one hook: the line of a trigger that refuses it, the lines of the others,
    the skill a trigger holds the agent to before its next tools, with the line that asks for it, and the commands
    that fire them and request the skill."""

    refusal: Nudge | None
    nudges: tuple[Nudge, ...]
    skill_block: tuple[Nudge, str] | None
    commands: tuple[Command[object], ...]
