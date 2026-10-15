import time
from dataclasses import replace
from datetime import datetime, timezone

from journal.console.where import Where
from journal.engine.machine import Machine
from journal.engine.states.paused import Paused
from journal.features.tasks.states.working import Working
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.refused import Refused
from journal.repositories.not_found import NotFound
from journal.repositories.tasks import Tasks


class InHand:
    """The work an agent has in hand, taken up and let go of in one place for the task and the work commands alike."""

    def __init__(self, tasks: Tasks, machine: Machine) -> None:
        self.tasks, self.machine = tasks, machine

    def current(self, where: Where) -> Working | None:
        if not where.session:
            return None
        try:
            current = self.machine.current(where.session)
        except NotFound:
            return None
        return current if isinstance(current, Working) else None

    def start(self, task: Task, where: Where) -> Task:
        """One task in progress at a time, by the tasks themselves and not the agent's state, so a restart cannot leave two: a second start is refused until the first is done or parked. Work declared without a task gives way to a task taken up."""
        for other in self.tasks.in_state(task.environment_id, TaskState.STARTED):
            if other.id != task.id:
                raise Refused(f"task {other.id} is in progress: finish it or park it before you start task {task.id}")
        started = self.tasks.save(task.started(datetime.now(timezone.utc)), where.actor)
        if where.session:
            self.machine.move(where.session, started.environment_id, Working(task_id=started.id, logged_at=time.time()))
        return started

    def let_go(self, task: Task, where: Where) -> None:
        """An agent that finished or parked the task it was on is idle again, also when it held the task under a pause, such as a skill owed: the pause then goes back to idle."""
        if not where.session:
            return
        try:
            current = self.machine.current(where.session)
        except NotFound:
            return
        if isinstance(current, Working) and current.task_id == task.id:
            self.machine.move(where.session, task.environment_id, self.machine.states.first())
        elif isinstance(current, Paused) and current.resume.get("state") == Working.name and current.resume.get("data", {}).get("task_id") == task.id:
            self.machine.move(where.session, task.environment_id, replace(current, resume={"state": self.machine.states.first().name, "data": {}}))
