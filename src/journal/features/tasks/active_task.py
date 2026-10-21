from datetime import datetime, timezone

from journal.support.caller import Caller
from journal.engine.clock import Clock
from journal.engine.support.session_agents import SessionAgents
from journal.features.tasks.states.working import Working
from journal.models.task import Task
from journal.support.missing_row import MissingRow
from journal.repositories.tasks import Tasks


class ActiveTask:
    """The work an agent has in hand, taken up and let go of in one place for the task and the work commands alike."""

    def __init__(self, tasks: Tasks, sessions: SessionAgents, clock: Clock) -> None:
        self.tasks, self.sessions, self.clock = tasks, sessions, clock

    def current(self, caller: Caller) -> Working | None:
        if caller.session is None:
            return None
        try:
            current = self.sessions.top(caller.session)
        except MissingRow:
            return None
        return current if isinstance(current, Working) else None

    def start(self, task: Task, caller: Caller) -> Task:
        started = task.started(datetime.now(timezone.utc))
        self.tasks.refuse_second(started)
        return self.tasks.save(started, caller.actor)
