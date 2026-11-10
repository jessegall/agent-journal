from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.agents.support.agent_sessions import AgentSessions
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.support.driver_nudges import TAKEOVER


class TakeoverRule(DriverRule):
    """A new session of the main agent is told at its first hook that the chat above it is history; a session
    that has hooks already, after a compaction or a resume, and the agent's first session are told nothing.
    Each hook call keeps the program session it came from, which says whether the newest one is of this session."""

    name = "drivers.takeover"
    hook = HookEventName.SESSION_START
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, sessions: AgentSessions, hook_calls: HookCallQuery) -> None:
        self.sessions, self.hook_calls = sessions, hook_calls

    def answer(self, hook: AgentHook) -> RuleAnswer:
        current = self.sessions.current(hook.agent_id)
        if current is None or self.sessions.earlier_session_count(hook.agent_id) < 1:
            return RuleAnswer.allowed()
        newest_hook = self.hook_calls.newest_agent_hook(hook.agent_id)
        if newest_hook is not None and newest_hook.program_session in ("", current.session):
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(TAKEOVER.nudge())
