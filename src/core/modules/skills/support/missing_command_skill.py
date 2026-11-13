from collections.abc import Collection

from core.modules.skills.support.agent_profile_skills import AgentProfileSkills
from core.modules.skills.support.loaded_skills import LoadedSkills
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.skill_requirement import SkillRequirement


class MissingCommandSkill:
    """The first skill covering a journal command that an agent does not hold loaded, that is written for its kind
    of agent and that its profile gives it."""

    def __init__(self, catalogue: SkillCatalogue, loaded: LoadedSkills, requirement: SkillRequirement, profile_skills: AgentProfileSkills) -> None:
        self.catalogue, self.loaded, self.requirement, self.profile_skills = catalogue, loaded, requirement, profile_skills

    def first(self, agent_id: int, commands: Collection[str]) -> str | None:
        if not commands or not self.requirement.is_required:
            return None
        covered = set(commands)
        loaded = self.loaded.names(agent_id)
        agent_type = self.profile_skills.agent_type(agent_id)
        return next((skill.folder for skill in self.catalogue.skills() if covered.intersection(skill.commands) and skill.folder not in loaded
                     and (not skill.types or agent_type in skill.types) and not self.profile_skills.refuses(agent_id, skill.folder)), None)
