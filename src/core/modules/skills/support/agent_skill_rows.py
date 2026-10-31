from core.base.query.queries import Queries
from core.modules.skills.models.agent_skill import AgentSkill


class AgentSkillRows:
    """The one row an agent holds for a skill, if it holds one."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def find(self, agent_id: int, skill: str) -> AgentSkill | None:
        return next(self.queries.query(AgentSkill).filter(agent_id=agent_id, skill=skill).all_rows(), None)
