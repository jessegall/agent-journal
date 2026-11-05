from core.base.query.queries import Queries
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.models.enums.agent_skill_state import AgentSkillState
from core.modules.skills.support.skill_catalogue import SkillCatalogue


class LoadedSkills:
    """The skills an agent holds loaded in their current text: one read in an older text does not count."""

    def __init__(self, queries: Queries, catalogue: SkillCatalogue) -> None:
        self.queries, self.catalogue = queries, catalogue

    def names(self, agent_id: int) -> tuple[str, ...]:
        digests = {skill.folder: skill.digest for skill in self.catalogue.skills()}
        rows = self.queries.query(AgentSkill).filter(session_agent_id=agent_id, state=AgentSkillState.LOADED).all_rows()
        return tuple(sorted(row.skill for row in rows if digests.get(row.skill) == row.digest))
