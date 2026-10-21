import time

from journal.support.masks import Masks
from journal.support.cards import Cards
from journal.events.agent.ticked import Ticked
from journal.events.agent_listener import AgentListener
from journal.support.chat_mark import ChatMark

ALARM_INTERVAL_SECONDS = 600.0


class AlarmOnLeak(AgentListener[Ticked]):
    """A secret's value that reached a write was masked there; at the next tick the user is shown which, so the leak is seen and not only stopped."""

    def __init__(self, masks: Masks, cards: Cards) -> None:
        self.masks, self.cards = masks, cards
        self._said_at = 0.0

    def handle(self, event: Ticked) -> None:
        if not self.masks.leaks or time.time() - self._said_at < ALARM_INTERVAL_SECONDS:
            return
        variables = sorted({variable for variable, _ in self.masks.leaks})
        self.masks.leaks.clear()
        self._said_at = time.time()
        self.cards.show(event.environment_id, event.session, f"A secret's value was about to be recorded and was masked: {', '.join(variables)}", "key", "bad", shows=ChatMark.FAULTS)
