from journal.support.cards import Cards
from journal.engine.machine import Machine
from journal.support.turn import Turn
from journal.support.typed_lines import TypedLines
from journal.events.agent.ticked import Ticked
from journal.events.agent_listener import AgentListener
from journal.supervisor_link import SupervisorLink
from journal.support.chat_mark import ChatMark

PATIENCE = 10.0
"""Seconds a typed line may go unconfirmed while the agent sits between turns before it is typed again; each try waits twice as long as the one before."""
TRIES = 6
"""Six tries span five minutes: a program loading a long conversation at its start drops what is typed for a minute or more."""


class RetypeLost(AgentListener[Ticked]):
    """A line not seen back while the agent has sat between turns for a while was lost, to a menu, a dialog or a program still loading: it is typed again, each time after twice the wait, up to six times, and the chat says so."""

    def __init__(self, typed: TypedLines, turn: Turn, machine: Machine, supervisor: SupervisorLink, cards: Cards) -> None:
        self.typed, self.turn, self.machine, self.supervisor, self.cards = typed, turn, machine, supervisor, cards

    def handle(self, event: Ticked) -> None:
        if event.quiet_for < PATIENCE:
            return
        agent = self.machine.agent(event.session, event.environment_id)
        if not self.turn.over(agent):
            return
        for lost in self.typed.overdue(event.environment_id, event.at - PATIENCE):
            if event.at < lost.at + PATIENCE * 2 ** (lost.tries - 1):
                continue
            if lost.tries >= TRIES:
                self.typed.given_up(lost)
                self.supervisor.release(event.environment_id)
                self.cards.show(event.environment_id, event.session, f"A line did not reach the agent in {TRIES} tries", "terminal", "bad", lost.line, shows=ChatMark.FAULTS)
            else:
                again = self.typed.tried_again(lost, event.at)
                self.supervisor.type_again(event.environment_id, again.line)
                self.cards.show(event.environment_id, event.session, f"Typed again, try {again.tries}: the line had not reached the agent", "terminal", "", lost.line, shows=ChatMark.FAULTS)
