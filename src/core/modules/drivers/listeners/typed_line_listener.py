from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.support.line_typing import LineTyping
from core.base.change.created import Created

PAUSE_SOURCE = "drivers.pause"
RESUME_SOURCE = "drivers.resume"
IDLE_MESSAGE_SOURCE = "messages.idle"
TERMINAL_SOURCES = (PAUSE_SOURCE, RESUME_SOURCE, IDLE_MESSAGE_SOURCE, "tasks.wait-ended")


class TypedLineListener(CommitListener[Created[AgentLine]]):
    """Types that an agent was paused or resumed, and, for an idle agent, which sends no hook that
    could carry it, a line that wakes it, that a message was edited or that a task it waited on opened. An
    agent at work gets those by its next hook, as does one with no terminal to type in; a line a hook has
    taken is typed no more, and the same line is typed once between two hooks of the agent: a repeat is
    entered without being typed again."""

    name = "drivers.typed-line"
    run_order = -1

    def __init__(self, queries: Queries, typing: LineTyping, bus: Bus, hook_calls: HookCallQuery) -> None:
        self.queries, self.typing, self.bus, self.hook_calls = queries, typing, bus, hook_calls

    def handle(self, event: Created[AgentLine], logged: LoggedEvent) -> None:
        line = event.row
        if not (line.wakes_agent or line.source in TERMINAL_SOURCES) or line.state is not AgentLineState.WAITING:
            return
        if line.source not in (PAUSE_SOURCE, RESUME_SOURCE) and not self.hook_calls.is_idle(line.session_agent_id, logged.timestamp):
            return
        actor = Actor(logged.actor_id, ActorType.USER)
        if self.has_entered_repeat(line):
            self.bus.run(EnterAgentLine(line.id), actor)
        else:
            self.typing.enter_line(line, actor)

    def has_entered_repeat(self, line: AgentLine) -> bool:
        if line.repeats_without_hook:
            return False
        entered_lines = self.queries.query(AgentLine).filter(session_agent_id=line.session_agent_id, source=line.source, text=line.text, state=AgentLineState.ENTERED)
        hook = self.hook_calls.newest_agent_hook(line.session_agent_id)
        return (entered_lines if hook is None else entered_lines.matching(Greater("created_at", hook.creation_timestamp().text))).exists()
