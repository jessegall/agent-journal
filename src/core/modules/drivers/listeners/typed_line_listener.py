from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.drivers.queries.hook_call_query import HookCallQuery

PAUSE_SOURCE = "drivers.pause"
RESUME_SOURCE = "drivers.resume"
IDLE_MESSAGE_SOURCE = "messages.idle"
TERMINAL_PREFIX = "[journal] "
TERMINAL_SOURCES = (PAUSE_SOURCE, RESUME_SOURCE, IDLE_MESSAGE_SOURCE, "tasks.wait-ended")


class TypedLineListener(CommitListener):
    """Types a line for an agent that may be sitting idle and so sends no hook that could carry it: that it
    was paused or resumed, that a message was edited, or that a task it waited on opened. With no terminal to
    type in, the line waits for its next hook; a line a hook has taken is typed no more, and the same line is typed
    once between two hooks of the agent: a repeat is entered without being typed again."""

    name = "drivers.typed-line"
    event = "agent_line.create"
    run_order = -1

    def __init__(self, queries: Queries, typing: TerminalTyping, bus: Bus, hook_calls: HookCallQuery) -> None:
        self.queries, self.typing, self.bus, self.hook_calls = queries, typing, bus, hook_calls

    def handle(self, event: LoggedEvent) -> None:
        line = self.queries.query(AgentLine).find(event.row_id)
        if line.source not in TERMINAL_SOURCES or line.state is not AgentLineState.WAITING:
            return
        actor = Actor(event.actor_id, ActorType.USER)
        if not self.typed_since_last_hook(line):
            try:
                self.typing.type_line(self.queries.query(Agent).find(line.agent_id).terminal_id, f"{TERMINAL_PREFIX}{line.text}")
            except Refusal:
                return
        # a hook of the agent may have taken the line while it was typed: it is entered only if it still waits, so the event is never handled twice
        if self.queries.query(AgentLine).find(line.id).state is AgentLineState.WAITING:
            self.bus.run(EnterAgentLine(line.id), actor, environment_id=event.environment_id)

    def typed_since_last_hook(self, line: AgentLine) -> bool:
        entered_lines = self.queries.query(AgentLine).filter(agent_id=line.agent_id, source=line.source, text=line.text, state=AgentLineState.ENTERED)
        hook = self.hook_calls.newest_agent_hook(line.agent_id)
        return (entered_lines if hook is None else entered_lines.matching(Greater("created_at", hook.creation_timestamp().text))).exists()
