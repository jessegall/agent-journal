from journal.support.card_outcome import CardOutcome
from journal.chat.moment_cards import MomentCards
from journal.chat.turn import Turn
from journal.support.typed_lines import TypedLines
from journal.events.agent.ticked import Ticked
from journal.events.agent_listener import AgentListener
from journal.supervisor_link import SupervisorLink
from journal.support.card_type import CardType

WAIT_LIMIT_SECONDS = 10.0
TRY_COUNT = 6


class LineRetyping(AgentListener[Ticked]):
    """A line not seen back while the agent has sat between turns for a while was lost, to a menu, a dialog or a program still loading, or sits in the prompt box unsent: the box is erased with a Ctrl+U for every line typed and not seen back, and the line typed again, each time after twice the wait, up to six times; the chat gets one card when it is given up on."""

    def __init__(self, keystrokes: TypedLines, turn: Turn, supervisor: SupervisorLink, cards: MomentCards) -> None:
        self.typed, self.turn, self.supervisor, self.cards = keystrokes, turn, supervisor, cards

    def handle(self, event: Ticked) -> None:
        if event.silence_seconds < WAIT_LIMIT_SECONDS:
            return
        agent = event.agent
        if not self.turn.is_finished(agent):
            return
        for dropped in self.typed.overdue(event.environment_id, event.time - WAIT_LIMIT_SECONDS):
            if event.time < dropped.time + WAIT_LIMIT_SECONDS * 2 ** (dropped.tries - 1):
                continue
            self.supervisor.erase(event.environment_id)
            if dropped.tries >= TRY_COUNT:
                self.typed.abandon(dropped)
                # the agent sits between turns, so the wake that marked it working never started one: it rests again,
                # or every later line would wait for a turn end that does not come
                self.supervisor.resting(event.environment_id)
                self.cards.show(event.environment_id, event.session, f"A message did not reach the agent after {TRY_COUNT} tries over five minutes", dropped.line, shows=CardType.FAULTS, outcome=CardOutcome.WARNED)
            else:
                repeat = self.typed.retry(dropped, event.time)
                self.supervisor.retype(event.environment_id, repeat.line)
