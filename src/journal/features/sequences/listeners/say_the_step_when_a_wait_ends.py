from journal.engine.machine import Machine
from journal.engine.states.paused import Paused
from journal.events.models.updated import Updated
from journal.features.listener import Listener
from journal.features.registry import Registry
from journal.features.sequences.running import Running
from journal.models.agent import Agent
from journal.supervisor_link import SupervisorLink


class SayTheStepWhenAWaitEnds(Listener[Updated]):
    """An agent that leaves a wait with a step open is typed the step, so it picks the sequence up again."""

    def __init__(self, machine: Machine, running: Running, registry: Registry, supervisor: SupervisorLink) -> None:
        self.machine, self.running, self.registry, self.supervisor = machine, running, registry, supervisor

    def handle(self, event: Updated) -> None:
        agent, was = event.model, event.was
        if not isinstance(agent, Agent) or "state" not in event.changed() or not self.paused(was) or self.paused(agent):
            return
        run = self.running.in_hand(agent.session, agent.environment_id)
        if run is None or run.parked_why or not self.running.typed_to(agent.session, agent.environment_id):
            return
        said = self.running.step(run)
        if not self.registry.silenced(said):
            self.running.said_now(agent.session, agent.environment_id)
            self.supervisor.type(agent.environment_id, said.rendered())

    def paused(self, agent: Agent) -> bool:
        return isinstance(self.machine.states.named(agent.state, agent.data), Paused)
