from pathlib import PurePath

from core.base.change.change import Change
from core.base.command.bus import Bus
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.skill.skill_declaration import SKILL_FILE
from core.modules.drivers.models.hook_call import HookCall
from core.modules.skills.commands.load_skill.load_skill import LoadSkill
from core.modules.skills.support.skill_catalogue import SkillCatalogue


class SkillReadListener(SaveListener):
    """When a tool call reads the SKILL.md of a skill in the catalogue, the agent has that skill loaded in the same
    write, with the digest of the catalogue's text, so the very next command finds it read."""

    name = "skills.read"
    event = "hook_call.create"

    def __init__(self, bus: Bus, catalogue: SkillCatalogue) -> None:
        self.bus, self.catalogue = bus, catalogue

    def handle(self, change: Change[Model]) -> None:
        call = change.new_row
        if not isinstance(call, HookCall) or call.tool == "" or PurePath(call.summary).name != SKILL_FILE:
            return
        folder = PurePath(call.summary).parent.name
        skill = next((entry for entry in self.catalogue.skills() if entry.folder == folder), None)
        if skill is not None:
            self.bus.dispatch(LoadSkill(call.agent_id, skill.folder, skill.digest), change.context)
