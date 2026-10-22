from datetime import datetime, timezone

from journal.support.caller import Caller
from journal.engine.clock import Clock
from journal.engine.support.session_agents import SessionAgents
from journal.features.tasks.states.working import Working
from journal.models.support.ref import Ref
from journal.models.task import Task
from journal.models.worker import Worker
from journal.repositories.agents import Agents
from journal.repositories.scope import Scope
from journal.support.missing_row import MissingRow
from journal.repositories.tasks import Tasks


class ActiveTask:
    """The work an agent has in hand, taken up and let go of in one place for the task and the work commands alike; a task started is held by the worker that started it, whose hooks never reach the journal, by the agent whose session started it, or by the environment's agent at work when the user started it."""

    def __init__(self, tasks: Tasks, sessions: SessionAgents, agents: Agents, scope: Scope, clock: Clock) -> None:
        self.tasks, self.sessions, self.agents, self.scope, self.clock = tasks, sessions, agents, scope, clock

    def current(self, caller: Caller) -> Working | None:
        if caller.session is None:
            return None
        try:
            current = self.sessions.top(caller.session)
        except MissingRow:
            return None
        return current if isinstance(current, Working) else None

    def start(self, task: Task, caller: Caller) -> Task:
        return self.tasks.holder_started(task.started(datetime.now(timezone.utc)), self.holder(caller), caller.actor)

    def holder(self, caller: Caller) -> Ref | None:
        if caller.worker_number is not None:
            return Ref(Worker.table(), caller.worker_number)
        if caller.session is not None:
            return Ref.build(self.sessions.agent(caller.session, self.scope.id))
        present = self.agents.current()
        return None if present is None else Ref.build(present)
