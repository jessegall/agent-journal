from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.idle import Idle as AgentIdle
from journal.features.agent_listener import AgentListener
from journal.features.tasks.states.idle import Idle
from journal.hooks.decision import Decision
from journal.models.task_state import TaskState
from journal.repositories.tasks import Tasks


class NameParkedAtStop(AgentListener[AgentIdle]):
    """An agent that stops with nothing in hand while tasks are parked is told of them once, in auto mode or not: parked is still open, only set aside. A stop can only be answered by holding it, so the second stop goes through."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger, tasks: Tasks) -> None:
        self.machine, self.nudger, self.tasks = machine, nudger, tasks

    def handle(self, event: AgentIdle) -> Decision | None:
        from journal.features.tasks.feature import Tasks as TasksFeature
        agent = self.machine.agent(event.session, event.environment_id)
        parked = self.tasks.in_state(event.environment_id, TaskState.PARKED)
        if event.again or not parked or not isinstance(self.machine.states.named(agent.state, agent.data), Idle):
            return None
        rows = "; ".join(f"{t.id} {t.title} (parked because: {t.parked_why})" for t in parked)
        line = self.nudger.say(agent, TasksFeature.PARKED_AT_STOP.about(rows=rows))
        return Decision.tell(line) if line else None
