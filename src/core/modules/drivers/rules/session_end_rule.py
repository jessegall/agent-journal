from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.agents.commands.end_agent.end_agent import EndAgent


class SessionEndRule(DriverRule):
    """A session that ends ends its agent, so it names no caller any more. A clear under a launch ends no agent:
    the program goes on under a new session id, which its next hook binds to the same agent."""

    name = "drivers.session-end"
    hook = HookEventName.SESSION_END
    drivers = ["*"]
    essential = True

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if hook.event.is_launch_clear_end:
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().running(EndAgent(hook.agent_id))
