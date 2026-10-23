from journal.chat.moment_cards import MomentCards
from journal.engine.support.session_agents import SessionAgents
from journal.chat.turn import Turn
from journal.support.typed_lines import TypedLines
from journal.events.agent.ticked import Ticked
from journal.events.agent_listener import AgentListener
from journal.supervisor_link import SupervisorLink
from journal.support.card_kind import CardKind

WAIT_LIMIT_SECONDS = 10.0
TRY_COUNT = 6


class LineRetyping(AgentListener[Ticked]):
    """A line not seen back while the agent has sat between turns for a while was lost, to a menu, a dialog or a program still loading, or sits in the prompt box unsent: the box is erased with a Ctrl+U for every line typed and not seen back, and the line typed again, each time after twice the wait, up to six times; the chat gets one card when it is given up on."""

    def __init__(self, keystrokes: TypedLines, turn: Turn, sessions: SessionAgents, supervisor: SupervisorLink, cards: MomentCards) -> None:
        self.typed, self.turn, self.sessions, self.supervisor, self.cards = keystrokes, turn, sessions, supervisor, cards

    def handle(self, event: Ticked) -> None:
        if event.silence_seconds < WAIT_LIMIT_SECONDS:
            return
        agent = self.sessions.agent(event.session, event.environment_id)
        if not self.turn.is_finished(agent):
            return
        for dropped in self.typed.overdue(event.environment_id, event.time - WAIT_LIMIT_SECONDS):
            if event.time < dropped.time + WAIT_LIMIT_SECONDS * 2 ** (dropped.tries - 1):
                continue
            self.supervisor.erase(event.environment_id)
            if dropped.tries >= TRY_COUNT:
                self.typed.abandon(dropped)
                self.supervisor.release(event.environment_id)
                self.cards.show(event.environment_id, event.session, f"A line did not reach the agent, typed {TRY_COUNT} times over five minutes", "terminal", "bad", dropped.line, shows=CardKind.FAULTS)
            else:
                repeat = self.typed.retry(dropped, event.time)
                self.supervisor.retype(event.environment_id, repeat.line)
