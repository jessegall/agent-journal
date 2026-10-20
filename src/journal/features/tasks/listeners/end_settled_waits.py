from journal.engine.machine import Machine
from journal.events.listener import Listener
from journal.events.models.updated import Updated
from journal.features.tasks.states.expecting import Expecting
from journal.repositories.agents import Agents
from journal.support.awaitables import Awaitables
from journal.support.ref import Ref
from journal.support.telling import Telling


class EndSettledWaits(Listener[Updated]):
    """An output ended or a wait's script passed: an agent whose wait names it, with nothing it names still out, goes back to what it was doing and is told what each came to."""

    def __init__(self, agents: Agents, machine: Machine, awaitables: Awaitables, telling: Telling) -> None:
        self.agents, self.machine, self.awaitables, self.telling = agents, machine, awaitables, telling

    def handle(self, event: Updated) -> None:
        name = self.awaitables.name_of(Ref.to(event.model)) if Awaitables.just_settled(event) else ""
        if not name:
            return
        for agent in self.agents.in_state(Expecting.name):
            wait = self.machine.states.named(agent.state, agent.data)
            if name in wait.waits_on() and self.awaitables.all_settled(wait.waits_on()):
                self.ended(agent, wait)

    def ended(self, agent, wait: Expecting) -> None:
        from journal.features.tasks.feature import Tasks
        self.machine.move(agent.session, agent.environment_id, wait.back().to)
        self.telling.tell_to(agent, Tasks.WAIT_OVER.create(what=wait.what, came=self.awaitables.came_to(wait.waits_on())))
