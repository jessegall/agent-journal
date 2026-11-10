from engine.change.created import Created
from engine.command.bus import Bus
from engine.command.context import Context
from engine.listener.save_listener import SaveListener
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.skills.commands.require_skill.require_skill import RequireSkill
from core.modules.skills.support.missing_command_skill import MissingCommandSkill


class CommandSkillListener(SaveListener[Created[HookCall]]):
    """A journal command of a subject a skill covers makes that skill due for a main agent that does not hold it."""

    name = "skills.command-due"

    def __init__(self, bus: Bus, missing: MissingCommandSkill, agents: AgentRows, suites: SuiteChoice) -> None:
        self.bus, self.missing, self.agents, self.suites = bus, missing, agents, suites

    def handle(self, event: Created[HookCall], context: Context) -> None:
        call = event.row
        if not call.journal_commands or self.agents.find(call.session_agent_id).role not in self.suites.agent_policy().prompt_roles:
            return
        folder = self.missing.first(call.session_agent_id, call.journal_commands)
        if folder is not None:
            self.bus.dispatch(RequireSkill(call.session_agent_id, folder), context)
