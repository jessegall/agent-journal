from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.skills.commands.load_skill import LoadSkill
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.models.enums.agent_skill_state import AgentSkillState
from core.modules.skills.support.agent_skill_rows import AgentSkillRows


class LoadSkillHandler(Handler[LoadSkill, AgentSkill]):
    """Marks the skill loaded for the agent with the digest it read; a second read of the same text changes
    nothing, and a read of another text loads again."""

    command = LoadSkill

    def __init__(self, rows: AgentSkillRows, repository: Repository) -> None:
        self.rows, self.repository = rows, repository

    def handle(self, command: LoadSkill, context: Context) -> AgentSkill:
        row = self.rows.find(command.agent_id, command.skill)
        if row is None:
            row = self.repository.save(AgentSkill(agent_id=command.agent_id, creator_id=context.actor.id, skill=command.skill), context)
        if row.state is AgentSkillState.LOADED and row.digest == command.digest:
            return row
        if row.state is AgentSkillState.LOADED:
            row = self.repository.save(row.reset(context.timestamp, context.actor), context)
        return self.repository.save(row.load(context.timestamp, context.actor, command.digest), context)
