from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.logged_event import LoggedEvent
from engine.listener.commit_listener import CommitListener
from engine.listener.event_rows import EventRows
from core.modules.agents.models.agent import Agent
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_command import WorkerCommand
from core.modules.agents.commands.start_agent_program.start_agent_program import StartAgentProgram
from engine.event.moved import Moved
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle


class WorkerProgramListener(CommitListener[Moved[Worktree]]):
    """Starts fresh workers after their worktrees are cut; ended sessions resume through waiting jobs."""

    name = "workers.worker-program-request"
    moves = tuple([WorktreeLifecycle.cut])

    def __init__(self, bus: Bus, rows: EventRows, worker_command: WorkerCommand, environments: EnvironmentRows, worktrees: WorktreeQuery) -> None:
        self.bus, self.rows, self.worker_command, self.environments, self.worktrees = bus, rows, worker_command, environments, worktrees

    def handle(self, event: Moved[Worktree], logged: LoggedEvent) -> None:
        worktree = event.row
        if not worktree.starts_program or not self.worktrees.is_first_worktree(worktree):
            return
        worker = self.rows.required(Agent, worktree.session_agent_id)
        environment = self.environments.find(worktree.environment_id)
        command = self.worker_command.command(worker, worktree, environment, self.rows.required(Task, worktree.task_id))
        self.bus.run(StartAgentProgram.launching(worker.id, command), Actor.core(), environment_id=environment.id)
