from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.new_session_line import NewSessionLine
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.support.driver_nudges import TAKEOVER


class TakeoverRule(DriverRule):
    """A new session of the main agent is told at its first hook which agent it is, what it carries from the
    session before it and that the chat above it is history; a session that has hooks already, after a
    compaction or a resume, and the agent's first session are told nothing. Each hook call keeps the program
    session it came from, which says whether the newest one is of this session."""

    name = "drivers.takeover"
    hook = HookEventName.SESSION_START
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, session_lines: NewSessionLine, hook_calls: HookCallQuery, agents: AgentRows) -> None:
        self.session_lines, self.hook_calls, self.agents = session_lines, hook_calls, agents

    def answer(self, hook: AgentHook) -> RuleAnswer:
        agent = self.agents.find(hook.agent_id)
        newest_hook = self.hook_calls.newest_agent_hook(hook.agent_id)
        if newest_hook is not None and newest_hook.program_session in ("", agent.session):
            return RuleAnswer.allowed()
        new_session = self.session_lines.new_session(agent)
        if new_session is None:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(TAKEOVER.nudge(agent=new_session.agent, tasks=new_session.tasks, report=new_session.report))
