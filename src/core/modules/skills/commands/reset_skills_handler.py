from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.skills.commands.reset_skills import ResetSkills
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.models.enums.agent_skill_state import AgentSkillState
from core.base.query.queries import Queries


class ResetSkillsHandler(Handler[ResetSkills, AgentSkill | None]):
    """Removes the loaded rows of the agent."""

    command = ResetSkills

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: ResetSkills, context: Context) -> AgentSkill | None:
        for row in tuple(self.queries.query(AgentSkill).filter(agent_id=command.agent_id, state=AgentSkillState.LOADED).all_rows()):
            self.repository.delete(row, context)
        return None
