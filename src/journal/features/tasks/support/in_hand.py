from dataclasses import replace
from datetime import datetime, timezone

from journal.support.where import Where
from journal.engine.clock import Clock
from journal.engine.state_machine import StateMachine
from journal.engine.states.paused import Paused
from journal.features.tasks.states.working import Working
from journal.models.task import Task
from journal.support.not_found import NotFound
from journal.repositories.tasks import Tasks


class InHand:
    """The work an agent has in hand, taken up and let go of in one place for the task and the work commands alike."""

    def __init__(self, tasks: Tasks, machine: StateMachine, clock: Clock) -> None:
        self.tasks, self.machine, self.clock = tasks, machine, clock

    def current(self, where: Where) -> Working | None:
        if not where.session:
            return None
        try:
            current = self.machine.current(where.session)
        except NotFound:
            return None
        return current if isinstance(current, Working) else None

    def start(self, task: Task, where: Where) -> Task:
        """One task in progress at a time, by the tasks themselves and not the agent's state, so a restart cannot leave two: a second start is refused until the first is done or parked. The agent moves to Working before the row is written, so the row's walk reads the agent as working. Work declared without a task gives way to a task taken up."""
        started = task.started(datetime.now(timezone.utc))
        self.tasks.refuse_second(started)
        if where.session:
            self.machine.move(where.session, task.environment_id, Working(task_id=task.id, logged_at=self.clock.now()))
        return self.tasks.save(started, where.actor)

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
