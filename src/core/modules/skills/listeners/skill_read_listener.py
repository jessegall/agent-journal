from pathlib import PurePath

from core.base.change.logged_event import LoggedEvent
from core.base.skill.skill_declaration import SKILL_FILE
from core.modules.skills.commands.load_skill import LoadSkill
from core.modules.skills.listeners.skill_listener import SkillListener


class SkillReadListener(SkillListener):
    """When a tool call reads the SKILL.md of a skill in the catalogue, the agent has that skill loaded, with the
    digest of the catalogue's text."""

    name = "skills.read"
    event = "hook_call.create"

    def handle(self, event: LoggedEvent) -> None:
        call = self.call(event)
        path = PurePath(call.summary)
        if call.tool == "" or path.name != SKILL_FILE:
            return
        skill = next((entry for entry in self.registry.skills if entry.folder == path.parent.name), None)
        if skill is not None:
            self.run(event, LoadSkill(call.agent_id, skill.folder, skill.digest))
