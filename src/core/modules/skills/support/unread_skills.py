from core.base.database.kept_rows import KeptRows
from core.base.query.queries import Queries
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.models.enums.agent_skill_state import AgentSkillState
from core.modules.skills.support.skill_catalogue import SkillCatalogue


class UnreadSkills:
    """The skills an agent must still read, oldest first, leaving out any the catalogue no longer holds."""

    def __init__(self, queries: Queries, catalogue: SkillCatalogue, kept: KeptRows) -> None:
        self.queries, self.catalogue, self.kept = queries, catalogue, kept

    def names(self, agent_id: int) -> list[str]:
        rows = self.kept.read("agent_skills", lambda: tuple(self.queries.query(AgentSkill).filter(session_agent_id=agent_id, state=AgentSkillState.DUE).oldest().all_rows()),
                              "session_agent_id = ? AND state = ?", [agent_id, AgentSkillState.DUE], name="skills.due")
        if not rows:
            return []
        declared = {skill.folder for skill in self.catalogue.skills()}
        return [row.skill for row in rows if row.skill in declared]

    def unread(self, agent_id: int) -> list[str]:
        current = {skill.folder: skill.digest for skill in self.catalogue.skills()}
        rows = self.queries.query(AgentSkill).filter(session_agent_id=agent_id).oldest().all_rows()
        return [row.skill for row in rows if row.skill in current and (row.state is AgentSkillState.DUE or row.digest != current[row.skill])]
