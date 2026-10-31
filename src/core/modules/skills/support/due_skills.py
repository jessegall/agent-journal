from core.base.query.queries import Queries
from core.base.registry.registry import Registry
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.models.enums.agent_skill_state import AgentSkillState


class DueSkills:
    """The skills due for an agent, oldest first, leaving out any the catalogue no longer holds."""

    def __init__(self, queries: Queries, registry: Registry) -> None:
        self.queries, self.registry = queries, registry

    def folders(self, agent_id: int) -> list[str]:
        declared = {skill.folder for skill in self.registry.skills}
        rows = self.queries.query(AgentSkill).filter(agent_id=agent_id, state=AgentSkillState.DUE).oldest().all_rows()
        return [row.skill for row in rows if row.skill in declared]
