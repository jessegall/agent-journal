from core.base.change.created import Created
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.listener.save_listener import SaveListener
from core.modules.skills.commands.require_skill.require_skill import RequireSkill
from core.modules.skills.models.skill_request import SkillRequest
from core.modules.skills.support.skill_catalogue import SkillCatalogue


class SkillRequestSaveListener(SaveListener[Created[SkillRequest]]):
    """Makes a requested skill due in the same transaction as the request."""

    name = "skills.request-save"

    def __init__(self, bus: Bus, catalogue: SkillCatalogue) -> None:
        self.bus, self.catalogue = bus, catalogue

    def handle(self, event: Created[SkillRequest], context: Context) -> None:
        request = event.row
        if self.catalogue.contains(request.skill):
            self.bus.dispatch(RequireSkill(request.session_agent_id, request.skill), context)
