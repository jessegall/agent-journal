from journal.events.agent.line_delivered import LineDelivered
from journal.events.agent_listener import AgentListener
from journal.support.card_kind import CardKind
from journal.chat.cards import Cards


class DispatchRefusalMarks(AgentListener[LineDelivered]):
    """A dispatch held in favour of idle workers is one mark in the chat: refused, and how many idle workers could take it, the idle list in its lines."""

    def __init__(self, cards: Cards) -> None:
        self.cards = cards

    def handle(self, event: LineDelivered) -> None:
        from journal.features.workers.feature import Workers
        if event.nudge not in Workers.DISPATCH_REFUSALS:
            return
        count = int(event.values["count"])
        self.cards.show(event.environment_id, event.session, f"Dispatch refused, {count} idle {'worker' if count == 1 else 'workers'} could take it", "agents", tone="bad", detail=f"idle workers:\n{event.values['workers']}", shows=CardKind.WORKERS)
