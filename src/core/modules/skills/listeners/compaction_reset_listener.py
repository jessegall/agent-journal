from core.base.change.logged_event import LoggedEvent
from core.modules.skills.commands.reset_skills.reset_skills import ResetSkills
from core.modules.skills.listeners.skill_listener import SkillListener
from core.base.change.created import Created
from core.modules.drivers.models.hook_call import HookCall


class CompactionResetListener(SkillListener[Created[HookCall]]):
    """When an agent's context window is compacted, the skills it had read are loaded no more."""

    name = "skills.compaction-reset"

    def handle(self, event: Created[HookCall], logged: LoggedEvent) -> None:
        call = self.call(logged)
        if call.is_compaction:
            self.run(logged, ResetSkills(call.agent_id))
