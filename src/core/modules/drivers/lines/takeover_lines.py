from collections.abc import Sequence
from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.new_session_line import NewSessionLine
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.nudges.takeover_message import TakeoverMessage


class TakeoverLines(EventLineSource):
    """A new session of the main agent is told at its first hook which agent it is, what it carries from the
    session before it and that the chat above it is history; a session that has hooks already, after a
    compaction or a resume, and the agent's first session are told nothing. Each hook call keeps the program
    session it came from, which says whether the newest one is of this session."""

    key = "drivers.takeover"
    events = [HookEventName.SESSION_START]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, session_lines: NewSessionLine, hook_calls: HookCallQuery, agents: AgentRows) -> None:
        self.session_lines, self.hook_calls, self.agents = session_lines, hook_calls, agents

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        agent = self.agents.find(agent_id)
        newest_hook = self.hook_calls.newest_agent_hook(agent_id)
        if newest_hook is not None and newest_hook.program_session in ("", agent.session):
            return []
        new_session = self.session_lines.new_session(agent)
        if new_session is None:
            return []
        return [TakeoverMessage.declared().nudge(agent=new_session.agent, tasks=new_session.tasks, report=new_session.report)]
