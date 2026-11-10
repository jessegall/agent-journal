from dataclasses import replace

from core.base.profile.agent_profile import AgentProfile
from engine.errors.refusal import Refusal
from engine.registry.skill_entry import SkillEntry
from core.modules.profiles.support.profile_skill import ProfileSkill
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.start_skills import StartSkills


class ProfileSkills:
    """The skills a profile's agents get: of the skills the journal ships, the ones the profile names, or else
    the ones made for its agent type and those made for every type; every plugin or project skill that fits
    its type; and always the ones every agent reads at its start."""

    def __init__(self, catalogue: SkillCatalogue, start: StartSkills) -> None:
        self.catalogue, self.start = catalogue, start

    def folders(self, profile: AgentProfile) -> tuple[str, ...]:
        wanted = tuple(skill.folder for skill in self.catalogue.skills() if self.is_given(skill, profile))
        return tuple(dict.fromkeys((*wanted, *self.start_folders())))

    def start_folders(self) -> tuple[str, ...]:
        return (*self.start.session_start(), *self.start.after_compaction())

    def with_required(self, profile: AgentProfile, required: tuple[str, ...] | None) -> AgentProfile:
        given = self.folders(profile)
        if required is None:
            return replace(profile, required_skills=tuple(folder for folder in profile.required_skills if folder in given))
        missing = [folder for folder in required if folder not in given]
        if missing:
            raise Refusal(f"{', '.join(missing)} is not a skill of {profile.name}", "switch the skill on first, or name it in --skills")
        return replace(profile, required_skills=required)

    def refuses(self, profile: AgentProfile, folder: str) -> bool:
        return self.catalogue.contains(folder) and folder not in self.folders(profile)

    def rows(self, profile: AgentProfile) -> tuple[ProfileSkill, ...]:
        listed, locked = set(self.folders(profile)), set(self.start_folders())
        return tuple(ProfileSkill(skill.folder, skill.description, skill.folder in listed, profile.agent_type in skill.types, skill.folder in profile.required_skills, skill.folder in locked) for skill in self.catalogue.skills())

    def is_given(self, skill: SkillEntry, profile: AgentProfile) -> bool:
        return skill.folder in profile.skills if profile.skills and skill.shipped else self.fits(skill, profile)

    @staticmethod
    def fits(skill: SkillEntry, profile: AgentProfile) -> bool:
        return not skill.types or profile.agent_type in skill.types
