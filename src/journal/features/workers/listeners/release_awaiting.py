from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.models.updated import Updated
from journal.features.listener import Listener
from journal.features.workers.states.awaiting import Awaiting
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.agents import Agents
from journal.repositories.workers import Workers
from journal.supervisor_link import SupervisorLink


class ReleaseAwaiting(Listener[Updated]):
    """When a worker reports or stops, every agent awaiting it is told, and the one whose last worker is back goes on with what it was doing."""

    def __init__(self, machine: Machine, nudger: Nudger, agents: Agents, workers: Workers, supervisor: SupervisorLink) -> None:
        self.machine, self.nudger, self.agents, self.workers, self.supervisor = machine, nudger, agents, workers, supervisor

    def handle(self, event: Updated) -> None:
        from journal.features.workers.feature import Workers as WorkersFeature
        worker = event.model
        if not isinstance(worker, Worker) or worker.state == WorkerState.DISPATCHED:
            return
        for agent in self.agents.in_state(Awaiting.name):
            state = self.machine.states.named(agent.state, agent.data)
            if worker.id not in state.workers:
                continue
            said = WorkersFeature.REPORTED if worker.state == WorkerState.REPORTED else WorkersFeature.STOPPED
            self._type(agent, self.nudger.say(agent, said.about(n=worker.id, name=worker.name, message="the chat")))
            if all(self.workers.find(n).state != WorkerState.DISPATCHED for n in state.workers):
                self.machine.move(agent.session, agent.environment_id, state.back().to)
                self._type(agent, self.nudger.say(agent, WorkersFeature.RETURNED.about()))

    def _type(self, agent, line: str | None) -> None:
        if line:
            self.supervisor.type(line)
