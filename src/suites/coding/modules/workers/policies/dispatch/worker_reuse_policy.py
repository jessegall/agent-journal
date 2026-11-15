from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from engine.query.conditions.among import Among
from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.enums.agent_role import AgentRole
from engine.driver.path_mentions import PathMentions
from engine.driver.part import Part
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.nudges.worker_reuse_nudge import WorkerReuseNudge
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.dispatch_arguments import DISPATCH_ARGUMENTS

KEPT_WORK_STATES = (WorktreeState.CUT, WorktreeState.DELIVERED)

DISPATCHED_TASKS_REASON = "the tasks one dispatch line names, a few at most; a number with no task is no task"
REUSE_REASON = "every open worktree is checked for a worker that knows the files of the new tasks"

NEW_WORKER_FLAG = "--fresh"


class WorkerReusePolicy(EventPolicy):
    """A dispatch whose tasks' briefs name a file an ended worker changed in the worktree it still has is refused,
    naming the line that sends it the job; --fresh passes when the job needs a new worker."""

    key = "workers.worker-reuse"
    rank = "workers.policies"
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, queries: Queries, git: WorktreeGit, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.queries, self.git = queries, git

    def refusal(self, event: HookEvent, agent_id: int) -> Nudge | None:
        shell = event.tool.shell if event.tool is not None else None
        for part in shell.parts if shell is not None else ():
            if part.arguments[:2] != DISPATCH_ARGUMENTS or NEW_WORKER_FLAG in part.arguments:
                continue
            worker_id = self.worker_with_files(part)
            if worker_id is not None:
                return WorkerReuseNudge.declared().nudge(worker=self.numbers.number(AGENT_MODEL_NAME, worker_id))
        return None

    def worker_with_files(self, part: Part) -> int | None:
        task_ids = [int(argument) for argument in part.arguments[2:] if argument.isdigit()]
        tasks = self.queries.query(Task).matching(Among("id", tuple(task_ids))).every_row(DISPATCHED_TASKS_REASON)
        paths = PathMentions.found(" ".join(task.brief for task in tasks))
        if not paths:
            return None
        # only a worktree that still holds its work, cut or delivered, can hold the files; a merged or removed one does not
        worktrees = list(self.queries.query(Worktree).matching(Among("state", KEPT_WORK_STATES)).every_row(REUSE_REASON))
        workers = {worker.id: worker for worker in self.queries.query(Agent).find_many([worktree.session_agent_id for worktree in worktrees])}
        for worktree in worktrees:
            is_ended = workers[worktree.session_agent_id].ended_at is not None
            if is_ended and PathMentions.overlap(paths, frozenset(self.git.changed_files(worktree))):
                return worktree.session_agent_id
        return None
