from journal.features.registry import Registry
from journal.features.skills.support.skill_card import SkillCard
from journal.features.skills.support.skills_snapshot import SkillsSnapshot
from journal.models.agent import Agent
from journal.support.skill_files import SkillFiles


class SkillsSnapshotReader:
    """Reads the skills feature's part of the Snapshot for an agent."""

    def __init__(self, registry: Registry, files: SkillFiles) -> None:
        self.registry, self.files = registry, files

    def read(self, agent: Agent) -> SkillsSnapshot:
        cards = tuple(SkillCard(skill.name, str(self.files.path(skill).relative_to(self.files.config.root)), self.files.hash_of(skill), skill.keywords, skill.required_in) for skill in self.registry.skills())
        return SkillsSnapshot(owed=tuple(agent.skills_owed), loaded=dict(agent.skills_loaded), skills=cards)
