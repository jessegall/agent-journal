from core.base.query.queries import Queries
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.models.enums.agent_skill_state import AgentSkillState
from core.modules.skills.support.skill_catalogue import SkillCatalogue


class DueSkills:
    """The skills due for an agent, oldest first, leaving out any the catalogue no longer holds."""

    def __init__(self, queries: Queries, catalogue: SkillCatalogue) -> None:
        self.queries, self.catalogue = queries, catalogue

    def folders(self, agent_id: int) -> list[str]:
        declared = {skill.folder for skill in self.catalogue.skills()}
        rows = self.queries.query(AgentSkill).filter(agent_id=agent_id, state=AgentSkillState.DUE).oldest().all_rows()
        return [row.skill for row in rows if row.skill in declared]

    def unread(self, agent_id: int) -> list[str]:
        current = {skill.folder: skill.digest for skill in self.catalogue.skills()}
        rows = self.queries.query(AgentSkill).filter(agent_id=agent_id).oldest().all_rows()
        return [row.skill for row in rows if row.skill in current and (row.state is AgentSkillState.DUE or row.digest != current[row.skill])]
