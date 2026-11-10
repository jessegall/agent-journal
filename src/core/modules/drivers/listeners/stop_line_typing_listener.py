from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.event.logged_event import LoggedEvent
from engine.listener.commit_listener import CommitListener
from engine.query.queries import Queries
from core.modules.drivers.listeners.typed_line_listener import TERMINAL_SOURCES
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.drivers.support.line_typing import LineTyping
from core.modules.drivers.conditions.waking_lines import WakingLines
from core.modules.drivers.events.stop_allowed import StopAllowed


class StopLineTypingListener(CommitListener[StopAllowed]):
    """An agent let to stop sends no hook that could carry a line left during its turn, so the oldest one is typed;
    the turn that starts gives the rest."""

    name = "drivers.stop-line-typing"
    run_order = -1

    def __init__(self, queries: Queries, typing: LineTyping) -> None:
        self.queries, self.typing = queries, typing

    def handle(self, event: StopAllowed, logged: LoggedEvent) -> None:
        agent_id = event.row.session_agent_id
        line = self.queries.query(AgentLine).filter(session_agent_id=agent_id, state=AgentLineState.WAITING).matching(WakingLines(TERMINAL_SOURCES)).oldest().first()
        if line is not None:
            self.typing.enter_line(line, Actor(logged.actor_id, ActorType.AGENT))
