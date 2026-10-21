from datetime import datetime, timezone

from journal.support.caller import Caller
from journal.engine.clock import Clock
from journal.engine.state_machine import StateMachine
from journal.features.tasks.states.working import Working
from journal.models.task import Task
from journal.support.not_found import NotFound
from journal.repositories.tasks import Tasks


class InHand:
    """The work an agent has in hand, taken up and let go of in one place for the task and the work commands alike."""

    def __init__(self, tasks: Tasks, machine: StateMachine, clock: Clock) -> None:
        self.tasks, self.machine, self.clock = tasks, machine, clock

    def current(self, caller: Caller) -> Working | None:
        if not caller.session:
            return None
        try:
            current = self.machine.current(caller.session)
        except NotFound:
            return None
        return current if isinstance(current, Working) else None

    def start(self, task: Task, caller: Caller) -> Task:
        started = task.started(datetime.now(timezone.utc))
        self.tasks.refuse_second(started)
        return self.tasks.save(started, caller.actor)
