from core.modules.assignments.support.assignments import Assignments
from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from engine.listener.commit_listener import CommitListener
from engine.listener.event_rows import EventRows
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.agents.commands.start_agent_program.start_agent_program import StartAgentProgram
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_command import WorkerCommand


class UnstartedWorkerListener(CommitListener[Moved[Task]]):
    """Starts a worker that was made without starting, once one of its tasks opens."""

    name = "workers.unstarted-worker-start"
    moves = tuple([TaskLifecycle.unblock])
    disabled_scopes = [ActorScope]

    def __init__(self, bus: Bus, rows: EventRows, worker_command: WorkerCommand, environments: EnvironmentRows, worktrees: WorktreeQuery, assignments: Assignments) -> None:
        self.bus, self.rows, self.worker_command, self.environments, self.worktrees = bus, rows, worker_command, environments, worktrees
        self.assignments = assignments

    def handle(self, event: Moved[Task], logged: LoggedEvent) -> None:
        task = event.row
        worker_id = self.assignments.actor(task)
        worktree = None if worker_id is None else self.worktrees.worker_worktree(worker_id)
        if worktree is None or worktree.starts_program:
            return
        worker = self.rows.required(Agent, worktree.session_agent_id)
        if worker.pid is None and worker.ended_at is None:
            environment = self.environments.find(worktree.environment_id)
            command = self.worker_command.command(worker, worktree, environment, task)
            self.bus.run(StartAgentProgram.launching(worker.id, command), Actor.core(), environment_id=environment.id)
