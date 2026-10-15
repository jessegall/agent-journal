from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.idle import Idle as AgentIdle
from journal.features.agent_listener import AgentListener
from journal.features.tasks.states.idle import Idle
from journal.hooks.decision import Decision
from journal.models.task_state import TaskState
from journal.repositories.settings import PROJECT, Settings
from journal.repositories.tasks import Tasks

AUTO = "tasks.auto"
"""With auto on, the agent works the list: a stop with a task open is answered with the next one, and only the user stops it."""


class OfferNext(AgentListener[AgentIdle]):
    """In auto mode, an agent that stops with nothing in hand while tasks wait is handed the next one and does not stop."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger, tasks: Tasks, settings: Settings) -> None:
        self.machine, self.nudger, self.tasks, self.settings = machine, nudger, tasks, settings

    def handle(self, event: AgentIdle) -> Decision | None:
        from journal.features.tasks.feature import Tasks as TasksFeature
        if event.again or not self.settings.get(PROJECT, AUTO, True):
            return None
        agent = self.machine.agent(event.session, event.environment_id)
        open_ = self.tasks.in_state(event.environment_id, TaskState.OPEN)
        if not open_ or not isinstance(self.machine.states.named(agent.state, agent.data), Idle):
            return None
        line = self.nudger.say(agent, TasksFeature.NEXT.about(n=open_[0].id, title=open_[0].title))
        return Decision.refuse(line) if line else None
