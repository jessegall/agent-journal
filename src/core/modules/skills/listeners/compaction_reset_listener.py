from core.base.change.logged_event import LoggedEvent
from core.base.driver.hook_event_name import HookEventName
from core.modules.skills.commands.reset_skills import ResetSkills
from core.modules.skills.listeners.skill_listener import SkillListener


class CompactionResetListener(SkillListener):
    """When an agent's context window is compacted, the skills it had read are loaded no more."""

    name = "skills.compaction-reset"
    event = "hook_call.create"

    def handle(self, event: LoggedEvent) -> None:
        call = self.call(event)
        if call.hook == HookEventName.COMPACT:
            self.run(event, ResetSkills(call.agent_id))
