from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.skills.commands.require_skill import RequireSkill
from core.modules.skills.models.agent_skill import AgentSkill
from core.modules.skills.models.enums.agent_skill_state import AgentSkillState
from core.modules.skills.support.agent_skill_rows import AgentSkillRows
from core.modules.skills.support.skill_catalogue import SkillCatalogue


class RequireSkillHandler(Handler[RequireSkill, AgentSkill]):
    """Makes the skill due for the agent; a skill the agent holds loaded with the current text stays loaded, and
    one it read in an older text becomes due again."""

    command = RequireSkill

    def __init__(self, catalogue: SkillCatalogue, rows: AgentSkillRows, repository: Repository) -> None:
        self.catalogue, self.rows, self.repository = catalogue, rows, repository

    def handle(self, command: RequireSkill, context: Context) -> AgentSkill:
        current = next((skill for skill in self.catalogue.skills() if skill.folder == command.skill), None)
        if current is None:
            raise Refusal(f"no module declares the skill {command.skill}", "journal skill list shows the skills")
        row = self.rows.find(command.agent_id, command.skill)
        if row is None:
            return self.repository.save(AgentSkill(agent_id=command.agent_id, creator_id=context.actor.id, skill=command.skill), context)
        if row.state is AgentSkillState.LOADED and row.digest != current.digest:
            return self.repository.save(row.reset(context.timestamp, context.actor), context)
        return row
