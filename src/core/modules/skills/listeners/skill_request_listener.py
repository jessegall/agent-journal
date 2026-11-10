from engine.event.logged_event import LoggedEvent
from core.modules.skills.commands.require_skill.require_skill import RequireSkill
from core.modules.skills.listeners.skill_listener import SkillListener
from core.modules.skills.models.skill_request import SkillRequest
from engine.event.created import Created


class SkillRequestListener(SkillListener[Created[SkillRequest]]):
    """When another module asks that an agent read a skill the catalogue knows, the skill becomes due for that
    agent, unless the agent holds it loaded in its current text."""

    name = "skills.request"

    def handle(self, event: Created[SkillRequest], logged: LoggedEvent) -> None:
        request = event.row
        if self.catalogue.contains(request.skill):
            self.run(logged, RequireSkill(request.session_agent_id, request.skill))
