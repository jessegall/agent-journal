from journal.engine.nudger import Nudger
from journal.events.listener import Listener
from journal.events.models.updated import Updated
from journal.models.actor import Actor
from journal.models.question import Question
from journal.models.ref import Ref
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.agents import Agents
from journal.repositories.tasks import Tasks
from journal.supervisor_link import SupervisorLink


class ClearWaits(Listener[Updated]):
    """A question answered or a task closed unblocks the tasks that wait on it by a link, once nothing else holds them, and the live agent is told."""

    def __init__(self, tasks: Tasks, nudger: Nudger, agents: Agents, supervisor: SupervisorLink) -> None:
        self.tasks, self.nudger, self.agents, self.supervisor = tasks, nudger, agents, supervisor

    def handle(self, event: Updated) -> None:
        if not self.ended(event):
            return
        for task in self.tasks.waiting_on(event.model):
            if not self.tasks.open_waits(task):
                self.cleared(self.tasks.save(task.unblocked(), Actor.system()), Ref.to(event.model))

    @staticmethod
    def ended(event: Updated) -> bool:
        model, was = event.model, event.was
        if isinstance(model, Question):
            return model.answer is not None and (was is None or was.answer is None)
        return isinstance(model, Task) and model.state in (TaskState.DONE, TaskState.CANCELLED)

    def cleared(self, task: Task, ref: Ref) -> None:
        from journal.features.tasks.feature import Tasks as TasksFeature
        agent = self.agents.live()
        line = agent and self.nudger.say(agent, TasksFeature.WAIT_CLEARED.about(n=task.id, on=f"{ref.type[:-1]} {ref.id}"))
        if line:
            self.supervisor.type(task.environment_id, line)
