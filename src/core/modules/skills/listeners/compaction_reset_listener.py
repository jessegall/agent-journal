from engine.event.logged_event import LoggedEvent
from core.modules.skills.commands.reset_skills.reset_skills import ResetSkills
from core.modules.skills.listeners.skill_listener import SkillListener
from core.modules.drivers.events.agent_compacted import AgentCompacted


class CompactionResetListener(SkillListener[AgentCompacted]):
    """When an agent's context window is compacted, the skills it had read are loaded no more."""

    name = "skills.compaction-reset"

    def handle(self, event: AgentCompacted, logged: LoggedEvent) -> None:
        call = event.row
        self.run(logged, ResetSkills(call.session_agent_id))
