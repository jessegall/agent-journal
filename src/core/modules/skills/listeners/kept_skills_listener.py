from engine.change.created import Created
from engine.command.bus import Bus
from engine.command.context import Context
from core.base.driver.hook_event_name import HookEventName
from core.base.listener.save_listener import SaveListener
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.skills.commands.load_skill.support.kept_skills import KeptSkills
from core.modules.skills.support.unread_skills import UnreadSkills


class KeptSkillsListener(SaveListener[Created[HookCall]]):
    """A tool use of a main agent loads the due skills its program put back into its context after a compaction."""

    name = "skills.kept"

    def __init__(self, bus: Bus, unread_skills: UnreadSkills, kept: KeptSkills, agents: AgentRows, suites: SuiteChoice) -> None:
        self.bus, self.unread_skills, self.kept, self.agents, self.suites = bus, unread_skills, kept, agents, suites

    def handle(self, event: Created[HookCall], context: Context) -> None:
        call = event.row
        if call.hook != HookEventName.PRE_TOOL_USE or self.agents.find(call.session_agent_id).role not in self.suites.agent_policy().prompt_roles:
            return
        names = self.unread_skills.names(call.session_agent_id)
        for skill_command in self.kept.loads(call.session_agent_id, call.transcript, names) if names else ():
            self.bus.dispatch(skill_command, context)
