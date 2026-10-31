from core.base.change.logged_event import LoggedEvent
from core.modules.skills.commands.require_skill import RequireSkill
from core.modules.skills.listeners.skill_listener import SkillListener
from core.modules.skills.models.skill_request import SkillRequest


class SkillRequestListener(SkillListener):
    """When another module asks that an agent read a skill the catalogue knows, the skill becomes due for that
    agent, unless the agent holds it loaded in its current text."""

    name = "skills.request"
    event = "skill_request.create"

    def handle(self, event: LoggedEvent) -> None:
        request = self.queries.query(SkillRequest).find(event.row_id)
        if request.skill in {skill.folder for skill in self.catalogue.skills()}:
            self.run(event, RequireSkill(request.agent_id, request.skill))
