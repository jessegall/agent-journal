from collections.abc import Sequence
from dataclasses import dataclass

SKILLS_FOLDER = "skills"
SKILL_FILE = "SKILL.md"


@dataclass(frozen=True)
class SkillDeclaration:
    """A skill provided by a module for agent programs, for the agent types it names, or for every type when it names none."""

    folder: str
    description: str
    keywords: Sequence[str] = ()
    commands: Sequence[str] = ()
    events: Sequence[str] = ()
    file: str = SKILL_FILE
    types: Sequence[str] = ()
