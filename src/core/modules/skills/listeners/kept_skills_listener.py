from pathlib import Path

from core.base.change.logged_event import LoggedEvent
from core.base.skill.skill_contents import SkillContents
from core.base.skill.skill_digest import SkillDigest
from core.modules.drivers.events.session_started import SessionStarted
from core.modules.skills.commands.load_skill.load_skill import LoadSkill
from core.modules.skills.listeners.skill_listener import SkillListener


class KeptSkillsListener(SkillListener[SessionStarted]):
    """When a session starts again after a compaction, the skills its program put back into the context count as
    loaded, each only while the text it put back is the skill's current text."""

    name = "skills.kept-after-compaction"

    def handle(self, event: SessionStarted, logged: LoggedEvent) -> None:
        call = event.row
        kept = call.kept_skills
        for skill in self.catalogue.skills():
            if skill.folder not in kept or kept[skill.folder] != SkillDigest.digest(SkillContents.read(Path(skill.path)).body):
                continue
            self.run(logged, LoadSkill(call.session_agent_id, skill.folder, skill.digest))
