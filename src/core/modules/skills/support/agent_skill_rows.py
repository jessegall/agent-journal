from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.models.enums.agent_skill_state import AgentSkillState


class AgentSkillRows:
    """The one row an agent holds for a skill, if it holds one."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def find(self, agent_id: int, skill: str) -> AgentSkill | None:
        skills = self.queries.query(AgentSkill).filter(session_agent_id=agent_id, skill=skill)
        return self.kept.read(skills, skills.first, name="skills.agent_skill")

    def is_loaded(self, agent_id: int, skill: str, digest: str) -> bool:
        row = self.find(agent_id, skill)
        return row is not None and row.state is AgentSkillState.LOADED and row.digest == digest
