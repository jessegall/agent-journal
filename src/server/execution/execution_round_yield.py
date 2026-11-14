from contextlib import AbstractContextManager

from engine.listener.round_yield import RoundYield
from server.execution.round_tickets import RoundTickets


class ExecutionRoundYield(RoundYield):
    """A listener round's events each wait for a background ticket of the instant lane, so the round yields to
    hooks by the lane's order instead of pausing for them."""

    def __init__(self, tickets: RoundTickets) -> None:
        self.tickets = tickets

    def event_turn(self, event_name: str) -> AbstractContextManager[None]:
        return self.tickets.event_turn(event_name)
