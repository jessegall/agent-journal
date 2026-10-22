from journal.features.registry import Registry
from journal.features.skills.support.skill_card import SkillCard
from journal.features.skills.support.skills_data import SkillsData
from journal.models.agent import Agent
from journal.features.skills.support.skill_files import SkillFiles


class SkillsDataReader:
    """Reads the skills feature's part of the feature data for an agent."""

    def __init__(self, registry: Registry, files: SkillFiles) -> None:
        self.registry, self.files = registry, files

    def read(self, agent: Agent) -> SkillsData:
        cards = tuple(SkillCard(skill.name, self.files.relative_path(skill), self.files.digest(skill), skill.keywords, skill.required_states) for skill in self.registry.skills())
        return SkillsData(skills_due=tuple(agent.skills_due), loaded=dict(agent.skills_loaded), skills=cards)
