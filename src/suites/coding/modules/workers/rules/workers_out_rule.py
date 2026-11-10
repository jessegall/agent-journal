from core.base.driver.nudge import Nudge
from suites.coding.modules.workers.support.worker_nudges import WORKER_TASK
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from engine.enums.agent_role import AgentRole


class WorkersOutRule(DriverRule):
    """A main agent's session starts with a line for each worker of its environment that still has a worktree
    out."""

    name = "workers.workers-out-at-start"
    start_line_rule = True
    hook = HookEventName.SESSION_START
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]

    def __init__(self, worktrees: WorktreeQuery) -> None:
        self.worktrees = worktrees

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudges: list[Nudge] = [WORKER_TASK.nudge(worker=worktree.session_agent_id, task=worktree.task_id) for worktree in self.worktrees.open_worktrees()]
        return RuleAnswer.with_nudges(*nudges) if nudges else RuleAnswer.allowed()
