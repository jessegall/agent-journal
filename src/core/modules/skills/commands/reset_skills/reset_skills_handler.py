from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.skills.commands.reset_skills.reset_skills import ResetSkills
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.models.enums.agent_skill_state import AgentSkillState
from engine.query.queries import Queries

LOADED_SKILLS_REASON = "a reset forgets every skill the agent has loaded"


class ResetSkillsHandler(Handler[ResetSkills, AgentSkill | None]):
    """Removes the loaded rows of the agent."""

    command = ResetSkills

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: ResetSkills, context: Context) -> AgentSkill | None:
        for row in tuple(self.queries.query(AgentSkill).filter(session_agent_id=command.agent_id, state=AgentSkillState.LOADED).every_row(LOADED_SKILLS_REASON)):
            self.repository.delete(row, context)
        return None
