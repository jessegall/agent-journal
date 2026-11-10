from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.skills.commands.request_skill.request_skill import RequestSkill
from core.modules.skills.models.skill_request import SkillRequest


class RequestSkillHandler(Handler[RequestSkill, SkillRequest]):
    """Saves the request, which the skill request listener turns into a due skill."""

    command = RequestSkill

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: RequestSkill, context: Context) -> SkillRequest:
        return self.repository.save(SkillRequest(session_agent_id=command.agent_id, creator_id=context.actor.id, skill=command.skill), context)
