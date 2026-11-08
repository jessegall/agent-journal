from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.skills.support.profile_skill import ProfileSkill


@dataclass(frozen=True)
class ProfileSkillList:
    """Every skill with whether a profile's agents get it, and whether it is made for the profile's agent type."""

    profile: str
    skills: tuple[ProfileSkill, ...]

    @property
    def rows(self) -> Sequence[Mapping[str, object]]:
        return [{"key": skill.folder, "description": skill.description, "state": "on" if skill.listed else "off", "own": skill.matches_type} for skill in self.skills]

    def json(self) -> Mapping[str, object]:
        return {"profile": self.profile, "rows": list(self.rows)}
