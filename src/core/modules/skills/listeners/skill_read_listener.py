from pathlib import PurePath

from engine.command.bus import Bus
from engine.listener.save_listener import SaveListener
from engine.skill.skill_declaration import SKILL_FILE
from core.modules.drivers.models.hook_call import HookCall
from core.modules.skills.commands.load_skill.load_skill import LoadSkill
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from engine.event.created import Created
from engine.command.context import Context


class SkillReadListener(SaveListener[Created[HookCall]]):
    """When a file tool reads the SKILL.md of a skill in the catalogue, the agent has that skill loaded in the same
    write, with the digest of the catalogue's text, so the very next command finds it read. A shell line holds
    spaces and is never one path: its parts are read by the part listener."""

    name = "skills.read"

    def __init__(self, bus: Bus, catalogue: SkillCatalogue) -> None:
        self.bus, self.catalogue = bus, catalogue

    def handle(self, event: Created[HookCall], context: Context) -> None:
        call = event.row
        if call.tool == "" or " " in call.summary or PurePath(call.summary).name != SKILL_FILE:
            return
        folder = PurePath(call.summary).parent.name
        skill = next((entry for entry in self.catalogue.skills() if entry.folder == folder), None)
        if skill is not None:
            self.bus.dispatch(LoadSkill(call.session_agent_id, skill.folder, skill.digest), context)
