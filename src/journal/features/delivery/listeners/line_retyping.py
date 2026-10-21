from journal.support.cards import Cards
from journal.engine.state_machine import StateMachine
from journal.support.turn import Turn
from journal.support.typed_lines import TypedLines
from journal.events.agent.ticked import Ticked
from journal.events.agent_listener import AgentListener
from journal.supervisor_link import SupervisorLink
from journal.support.card_kind import CardKind

WAIT_LIMIT_SECONDS = 10.0
TRIES = 6


class LineRetyping(AgentListener[Ticked]):
    """A line not seen back while the agent has sat between turns for a while was lost, to a menu, a dialog or a program still loading: it is typed again, each time after twice the wait, up to six times; the chat gets one card when it is given up on."""

    def __init__(self, typed: TypedLines, turn: Turn, machine: StateMachine, supervisor: SupervisorLink, cards: Cards) -> None:
        self.typed, self.turn, self.machine, self.supervisor, self.cards = typed, turn, machine, supervisor, cards

    def handle(self, event: Ticked) -> None:
        if event.quiet_for < WAIT_LIMIT_SECONDS:
            return
        agent = self.machine.agent(event.session, event.environment_id)
        if not self.turn.over(agent):
            return
        for lost in self.typed.overdue(event.environment_id, event.time - WAIT_LIMIT_SECONDS):
            if event.time < lost.time + WAIT_LIMIT_SECONDS * 2 ** (lost.tries - 1):
                continue
            if lost.tries >= TRIES:
                self.typed.given_up(lost)
                self.supervisor.release(event.environment_id)
                self.cards.show(event.environment_id, event.session, f"A line did not reach the agent, typed {TRIES} times over five minutes", "terminal", "bad", lost.line, shows=CardKind.FAULTS)
            else:
                again = self.typed.tried_again(lost, event.time)
                self.supervisor.type_again(event.environment_id, again.line)
