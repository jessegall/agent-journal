from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.drivers.support.driver_nudges import CONTINUED_SESSION


class ContinuedSessionRule(DriverRule):
    """A main agent started again from a session of an earlier run is told once, in the words version 4 used
    for a resumed conversation, that it is back in it and says so to the user, naming the session. The
    start hook is recorded as allowed, which is what shows the agent idle, though its last hook of that run
    may say it was working."""

    name = "drivers.continued-session"
    hook = HookEventName.SESSION_START
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_nudges(CONTINUED_SESSION.nudge(agent=hook.agent_id)) if hook.event.is_resume else RuleAnswer.allowed()
