from suites.coding.support.coding_helper_kind import CodingHelperKind
from core.base.agent_role import AgentRole
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.tasks.support.task_assignees import TaskAssignees
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.support.coding_main_options import CodingMainOptions
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_next_task import WorkerNextTask


class WorkerTaskAssignees(TaskAssignees):
    """The main agent and a worker whose worktree is cut take a task; a worker whose work is delivered, or any
    other helper, never starts one. A main agent that writes no code keeps no task reserved: it hands them out."""

    def __init__(self, worktrees: WorktreeQuery, tasks: TaskQuery, next_task: WorkerNextTask, options: CodingMainOptions) -> None:
        self.next_task, self.options = next_task, options
        self.worktrees, self.tasks = worktrees, tasks

    def keeps_reservation(self, agent: Agent) -> bool:
        return agent.role != AgentRole.MAIN or self.options.options().writes_code

    def check(self, agent: Agent) -> None:
        worktree = self.worktrees.worker_worktree(agent.id) if agent.role == CodingHelperKind.WORKER else None
        if agent.role != AgentRole.MAIN and (worktree is None or worktree.state is not WorktreeState.CUT):
            raise Refusal(f"agent {agent.id} is a {agent.role} and takes no task", "only the main agent and a worker with a cut worktree take a task")

    def check_reassignment(self, task: Task) -> None:
        if task.delegated_to != task.holder_id or task.holder_id is None or self.next_task.following(task.holder_id) is not None:
            return
        if self.tasks.holder(task.holder_id).filter(state=TaskState.TESTING).exists():
            return
        raise Refusal(f"task {task.id} is the last of worker {task.holder_id}", f"journal worker release {task.holder_id} \"<why>\" takes it back")
