from collections.abc import Sequence
from dataclasses import dataclass

SKILLS_FOLDER = "skills"
SKILL_FILE = "SKILL.md"


@dataclass(frozen=True)
class SkillDeclaration:
    """A skill provided by a module for agent programs."""

    folder: str
    description: str
    keywords: Sequence[str] = ()
    commands: Sequence[str] = ()
    events: Sequence[str] = ()
    file: str = SKILL_FILE
