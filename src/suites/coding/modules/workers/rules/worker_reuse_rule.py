from engine.enums.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.path_mentions import PathMentions
from core.base.driver.part import Part
from core.base.driver.rule_answer import RuleAnswer
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_nudges import WORKER_REUSE
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.dispatch_arguments import DISPATCH_ARGUMENTS

NEW_WORKER_FLAG = "--fresh"


class WorkerReuseRule(DriverRule):
    """A dispatch whose tasks' briefs name a file an ended worker changed in the worktree it still has is refused,
    naming the line that sends it the job; --fresh passes when the job needs a new worker."""

    name = "workers.worker-reuse"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    refuses_one_action = "A dispatch for work that an ended worker still holds in its worktree is refused"

    def __init__(self, queries: Queries, git: WorktreeGit) -> None:
        self.queries, self.git = queries, git

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        for part in shell.parts if shell is not None else ():
            if part.arguments[:2] != DISPATCH_ARGUMENTS or NEW_WORKER_FLAG in part.arguments:
                continue
            worker_id = self.worker_with_files(part)
            if worker_id is not None:
                return RuleAnswer.refused(WORKER_REUSE.nudge(worker=worker_id))
        return RuleAnswer.allowed()

    def worker_with_files(self, part: Part) -> int | None:
        task_ids = [int(argument) for argument in part.arguments[2:] if argument.isdigit()]
        paths = PathMentions.found(" ".join(task.brief for task in self.queries.query(Task).find_many(task_ids)))
        if not paths:
            return None
        worktrees = list(self.queries.query(Worktree).all_rows())
        workers = {worker.id: worker for worker in self.queries.query(Agent).find_many([worktree.session_agent_id for worktree in worktrees])}
        for worktree in worktrees:
            is_ended = workers[worktree.session_agent_id].ended_at is not None
            if is_ended and PathMentions.overlap(paths, frozenset(self.git.changed_files(worktree))):
                return worktree.session_agent_id
        return None
