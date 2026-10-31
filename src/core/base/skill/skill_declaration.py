from collections.abc import Sequence
from dataclasses import dataclass

SKILLS_FOLDER = "skills"
SKILL_FILE = "SKILL.md"


@dataclass(frozen=True)
class SkillDeclaration:
    """A skill a module adds for the agent programs: its folder, which is its name and starts with journal, the
    description a program lists it by, the words that bring it up, the command nouns it covers, the event patterns
    it names, and the file of its text in the module's skills/<folder> folder."""

    folder: str
    description: str
    keywords: Sequence[str] = ()
    commands: Sequence[str] = ()
    events: Sequence[str] = ()
    file: str = SKILL_FILE
