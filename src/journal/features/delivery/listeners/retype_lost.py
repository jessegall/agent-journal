from journal.engine.cards import Cards
from journal.engine.machine import Machine
from journal.engine.turn import Turn
from journal.engine.typed_lines import TypedLines
from journal.events.agent.ticked import Ticked
from journal.events.agent_listener import AgentListener
from journal.supervisor_link import SupervisorLink

PATIENCE = 10.0
"""Seconds a typed line may go unconfirmed while the agent sits between turns before it is typed again."""
TRIES = 3


class RetypeLost(AgentListener[Ticked]):
    """A line not seen back while the agent has sat between turns for a while was lost, to a menu or a dialog: it is typed again, up to three times, and the chat says so."""

    def __init__(self, typed: TypedLines, turn: Turn, machine: Machine, supervisor: SupervisorLink, cards: Cards) -> None:
        self.typed, self.turn, self.machine, self.supervisor, self.cards = typed, turn, machine, supervisor, cards

    def handle(self, event: Ticked) -> None:
        if event.quiet_for < PATIENCE:
            return
        agent = self.machine.agent(event.session, event.environment_id)
        if not self.turn.over(agent):
            return
        for lost in self.typed.overdue(event.environment_id, event.at - PATIENCE):
            if lost.tries >= TRIES:
                self.typed.given_up(lost)
                self.cards.show(event.environment_id, event.session, f"A line did not reach the agent in {TRIES} tries", "terminal", "bad", lost.line)
            else:
                again = self.typed.tried_again(lost, event.at)
                self.supervisor.type_again(event.environment_id, again.line)
                self.cards.show(event.environment_id, event.session, f"Typed again, try {again.tries}: the line had not reached the agent", "terminal", "", lost.line)
