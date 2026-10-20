from journal.engine.state_machine import StateMachine
from journal.events.listener import Listener
from journal.events.rows.row_event import RowEvent


class RowEventsToTheTop(Listener[RowEvent]):
    """Every row event, named for its moment, is asked of the top of each live agent's stack in the row's environment; a model's Updated reaches no state."""

    def __init__(self, machine: StateMachine) -> None:
        self.machine = machine

    def handle(self, event: RowEvent) -> None:
        self.machine.row_event(event)
