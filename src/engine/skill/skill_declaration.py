from collections.abc import Sequence
from dataclasses import dataclass

SKILLS_FOLDER = "skills"
SKILL_FILE = "SKILL.md"


@dataclass(frozen=True)
class SkillDeclaration:
    """A skill provided by a module for agent programs, for the agent types it names, or for every type when it
    names none. With required_setting set, every agent must load it while that setting is on."""

    folder: str
    description: str
    keywords: Sequence[str] = ()
    commands: Sequence[str] = ()
    events: Sequence[str] = ()
    file: str = SKILL_FILE
    types: Sequence[str] = ()
    required_setting: str | None = None
