from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.support.waiting_line_typing import IDLE_MESSAGE_SOURCE, PAUSE_SOURCE, RESUME_SOURCE, TERMINAL_SOURCES, WaitingLineTyping
from core.base.change.created import Created

__all__ = ["IDLE_MESSAGE_SOURCE", "PAUSE_SOURCE", "RESUME_SOURCE", "TERMINAL_SOURCES", "TypedLineListener"]


class TypedLineListener(CommitListener[Created[AgentLine]]):
    """Types that an agent was paused or resumed, and, for an idle agent, which sends no hook that could carry
    it, a line that wakes it, that a message was edited or that a task it waited on opened. An agent at
    work gets those by its next hook, as does one with no terminal to type in and one at its program's
    usage limit; a line a hook has taken is typed no more."""

    name = "drivers.typed-line"
    run_order = -1

    def __init__(self, typing: WaitingLineTyping) -> None:
        self.typing = typing

    def handle(self, event: Created[AgentLine], logged: LoggedEvent) -> None:
        self.typing.type(event.row, logged.actor_id, logged.timestamp)
