from journal.engine.state_machine import StateMachine
from journal.events.listener import Listener
from journal.events.models.created import Created
from journal.features.dumps.states.sorting_dump import SortingDump
from journal.models.dump import Dump
from journal.repositories.agents import Agents


class StartSortingDump(Listener[Created]):
    """A dump the user drops moves the live agent here into sorting it, from whatever it was doing, which it goes back to once the dump is filed; one dump is sorted at a time."""

    def __init__(self, agents: Agents, machine: StateMachine) -> None:
        self.agents, self.machine = agents, machine

    def handle(self, event: Created) -> None:
        dump = event.model
        if not isinstance(dump, Dump) or not event.by.is_the_user():
            return
        agent = self.agents.live()
        if agent is None or agent.state == SortingDump.name:
            return
        self.machine.move(agent.session, dump.environment_id, SortingDump.leaving(self.machine.current(agent.session), dump_id=dump.id))
