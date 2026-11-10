from core.base.database.kept_rows import KeptRows
from engine.query.queries import Queries
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.models.enums.agent_skill_state import AgentSkillState
from core.modules.skills.support.agent_profile_skills import AgentProfileSkills
from core.modules.skills.support.skill_catalogue import SkillCatalogue


DUE_SKILLS_REASON = "the skills due for one agent are at most the skills of the project, kept until one changes"

class UnreadSkills:
    """The skills an agent must still read, oldest first, leaving out any the catalogue no longer holds and any its
    profile does not give it, which it could not read."""

    def __init__(self, queries: Queries, catalogue: SkillCatalogue, kept: KeptRows, profile_skills: AgentProfileSkills) -> None:
        self.queries, self.catalogue, self.kept, self.profile_skills = queries, catalogue, kept, profile_skills

    def names(self, agent_id: int) -> list[str]:
        rows = self.kept.read("agent_skills", lambda: tuple(self.queries.query(AgentSkill).filter(session_agent_id=agent_id, state=AgentSkillState.DUE).oldest().full_table(DUE_SKILLS_REASON).all_rows()),
                              "session_agent_id = ? AND state = ?", [agent_id, AgentSkillState.DUE], name="skills.due")
        if not rows:
            return []
        declared = {skill.folder for skill in self.catalogue.skills()}
        return [row.skill for row in rows if row.skill in declared and not self.profile_skills.refuses(agent_id, row.skill)]

    def unread(self, agent_id: int) -> list[str]:
        current = {skill.folder: skill.digest for skill in self.catalogue.skills()}
        rows = self.queries.query(AgentSkill).filter(session_agent_id=agent_id).oldest().all_rows()
        return [row.skill for row in rows if row.skill in current and (row.state is AgentSkillState.DUE or row.digest != current[row.skill])]
