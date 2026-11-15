from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries
from engine.query.query import Query
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.models.enums.agent_skill_state import AgentSkillState

AGENT_SKILLS_REASON = "an agent holds one row for each skill it was asked to read, a few dozen at most"


class AgentSkillRows:
    """The one row an agent holds for a skill, if it holds one. An agent's rows are read together once and kept, and
    a row saved is put in the kept rows, so a session start that requires many skills reads them once."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def find(self, agent_id: int, skill: str) -> AgentSkill | None:
        return self.agent_skills(agent_id).get(skill)

    def agent_skills(self, agent_id: int) -> dict[str, AgentSkill]:
        rows = self.agent_rows(agent_id)
        return self.kept.read(rows, lambda: {row.skill: row for row in rows.every_row(AGENT_SKILLS_REASON)}, name="skills.agent_skills")

    def remember(self, row: AgentSkill) -> AgentSkill:
        self.kept.update(self.agent_rows(row.session_agent_id), lambda previous: {**previous, row.skill: row}, name="skills.agent_skills")
        return row

    def agent_rows(self, agent_id: int) -> Query[AgentSkill]:
        return self.queries.query(AgentSkill).filter(session_agent_id=agent_id)

    def is_loaded(self, agent_id: int, skill: str, digest: str) -> bool:
        row = self.find(agent_id, skill)
        return row is not None and row.state is AgentSkillState.LOADED and row.digest == digest
