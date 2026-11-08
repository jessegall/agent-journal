from core.base.profile.agent_profile import AgentProfile
from core.base.registry.skill_entry import SkillEntry
from core.modules.skills.support.profile_skill import ProfileSkill
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.start_skills import StartSkills


class ProfileSkills:
    """The skills a profile's agents get: the ones the profile names, or else the ones made for its agent type
    and those made for every type, and always the ones every agent reads at its start."""

    def __init__(self, catalogue: SkillCatalogue, start: StartSkills) -> None:
        self.catalogue, self.start = catalogue, start

    def folders(self, profile: AgentProfile) -> tuple[str, ...]:
        wanted = tuple(profile.skills) or tuple(skill.folder for skill in self.catalogue.skills() if self.fits(skill, profile))
        return tuple(dict.fromkeys((*wanted, *self.start.session_start(), *self.start.after_compaction())))

    def refuses(self, profile: AgentProfile, folder: str) -> bool:
        return self.catalogue.contains(folder) and folder not in self.folders(profile)

    def rows(self, profile: AgentProfile) -> tuple[ProfileSkill, ...]:
        listed = set(self.folders(profile))
        return tuple(ProfileSkill(skill.folder, skill.description, skill.folder in listed, profile.agent_type in skill.types) for skill in self.catalogue.skills())

    @staticmethod
    def fits(skill: SkillEntry, profile: AgentProfile) -> bool:
        return not skill.types or profile.agent_type in skill.types
