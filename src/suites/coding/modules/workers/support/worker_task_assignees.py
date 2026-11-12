from core.modules.assignments.support.assignments import Assignments
from engine.enums.agent_role import AgentRole
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.tasks.support.task_assignees import TaskAssignees
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_next_task import WorkerNextTask
from core.modules.agents.support.agent_label import AgentLabel
from engine.cli.row_numbers import RowNumbers


class WorkerTaskAssignees(TaskAssignees):
    """The main agent and a worker whose worktree is cut take a task; a worker whose work is delivered, or any
    other helper, never starts one."""

    def __init__(self, worktrees: WorktreeQuery, tasks: TaskQuery, next_task: WorkerNextTask, numbers: RowNumbers, assignments: Assignments) -> None:
        self.numbers, self.assignments = numbers, assignments
        self.next_task = next_task
        self.worktrees, self.tasks = worktrees, tasks

    def check(self, agent: Agent) -> None:
        if agent.role == AgentRole.MAIN:
            return
        worktree = self.worktrees.worker_worktree(agent.id)
        if worktree is None or worktree.state is not WorktreeState.CUT:
            raise Refusal(f"{AgentLabel.from_agent(agent).text} is a {agent.role} and takes no task", "only the main agent and a worker with a cut worktree take a task")

    def check_reassignment(self, task: Task) -> None:
        if task.holder_id is None or self.assignments.actor(task) != task.holder_id or self.worktrees.worker_worktree(task.holder_id) is None:
            return
        if self.next_task.following(task.holder_id) is not None:
            return
        if self.tasks.holder(task.holder_id).filter(state=TaskState.TESTING).exists():
            return
        raise Refusal(f"task {task.id} is the last of {AgentLabel.from_row_id(task.holder_id, self.numbers, "worker").text}", f"journal worker release {AgentLabel.from_row_id(task.holder_id, self.numbers).number} \"<why>\" takes it back")
