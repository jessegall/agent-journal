from collections.abc import Collection

from core.modules.skills.support.agent_profile_skills import AgentProfileSkills
from core.modules.skills.support.agent_skill_rows import AgentSkillRows
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.skill_requirement import SkillRequirement


class MissingCommandSkill:
    """The first skill covering a journal command that an agent does not hold loaded and its profile gives it."""

    def __init__(self, catalogue: SkillCatalogue, rows: AgentSkillRows, requirement: SkillRequirement, profile_skills: AgentProfileSkills) -> None:
        self.catalogue, self.rows, self.requirement, self.profile_skills = catalogue, rows, requirement, profile_skills

    def first(self, agent_id: int, commands: Collection[str]) -> str | None:
        if not commands or not self.requirement.is_required:
            return None
        covered = set(commands)
        return next((skill.folder for skill in self.catalogue.skills() if covered.intersection(skill.commands) and not self.rows.is_loaded(agent_id, skill.folder, skill.digest)
                     and not self.profile_skills.refuses(agent_id, skill.folder)), None)
