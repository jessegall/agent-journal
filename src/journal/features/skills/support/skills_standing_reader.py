from journal.features.skills.support.skills_standing import SkillsStanding
from journal.models.agent import Agent


class SkillsStandingReader:
    """Reads the skills feature's part of the Standing for an agent."""

    def read(self, agent: Agent) -> SkillsStanding:
        return SkillsStanding(owed=tuple(agent.skills_owed))
