from core.base.driver.nudge import Nudge
from suites.coding.modules.workers.support.worker_nudges import WORKER_TASK
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.queries import Queries
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from core.base.agent_role import AgentRole


class WorkersOutRule(DriverRule):
    """A main agent's session starts with a line for each worker of its environment that still has a worktree out."""

    name = "workers.workers-out-at-start"
    start_line_rule = True
    hook = HookEventName.SESSION_START
    drivers = ["coding.builder", "coding.orchestrator"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, worktrees: WorktreeQuery) -> None:
        self.queries, self.worktrees = queries, worktrees

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudges: list[Nudge] = []
        for worktree in self.worktrees.environment_worktrees(hook.environment_id):
            task = self.queries.query(Task).find(worktree.task_id)
            nudges.append(WORKER_TASK.nudge(worker=worktree.agent_id, task=task.id, state=worktree.state.value))
        return RuleAnswer.with_nudges(*nudges) if nudges else RuleAnswer.allowed()
