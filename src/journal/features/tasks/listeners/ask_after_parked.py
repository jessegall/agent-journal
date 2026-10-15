from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.ticked import Ticked
from journal.features.agent_listener import AgentListener
from journal.features.tasks.states.idle import Idle
from journal.models.task_state import TaskState
from journal.repositories.tasks import Tasks
from journal.supervisor_link import SupervisorLink

QUIET_FOR = 60.0


class AskAfterParked(AgentListener[Ticked]):
    """An idle agent with a parked task and nothing in hand is asked, now and then, whether it can go on with it."""

    def __init__(self, machine: Machine, nudger: Nudger, tasks: Tasks, supervisor: SupervisorLink) -> None:
        self.machine, self.nudger, self.tasks, self.supervisor = machine, nudger, tasks, supervisor

    def handle(self, event: Ticked) -> None:
        from journal.features.tasks.feature import Tasks as TasksFeature
        agent = self.machine.agent(event.session, event.environment_id)
        parked = self.tasks.in_state(event.environment_id, TaskState.PARKED)
        if event.quiet_for < QUIET_FOR or not parked or not isinstance(self.machine.states.named(agent.state, agent.data), Idle):
            return
        task = parked[0]
        line = self.nudger.say(agent, TasksFeature.PARKED_STILL.about(n=task.id, title=task.title, why=task.parked_why))
        if line:
            self.supervisor.type(line)
