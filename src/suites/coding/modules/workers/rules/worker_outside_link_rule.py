from pathlib import Path

from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_nudges import WORKER_FOREIGN_LINK
from suites.coding.models.enums.coding_helper_role import CodingHelperRole

LINK_PROGRAM = "ln"


class WorkerOutsideLinkRule(DriverRule):
    """Stops a worker linking something from outside its worktree into it; the journal links the shared libraries."""

    name = "workers.outside-link"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [CodingHelperRole.WORKER]
    refuses_one_action = "A worker may not link a folder from outside its worktree into it"

    def __init__(self, worktrees: WorktreeQuery) -> None:
        self.worktrees = worktrees

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        worktree = self.worktrees.worker_worktree(hook.agent_id)
        if tool is None or tool.shell is None or worktree is None:
            return RuleAnswer.allowed()
        arguments = [argument for part in tool.shell.parts if part.program == LINK_PROGRAM for argument in part.arguments if not argument.startswith("-")]
        if any(not Path(worktree.folder, argument).resolve().is_relative_to(Path(worktree.folder).resolve()) for argument in arguments):
            return RuleAnswer.refused(WORKER_FOREIGN_LINK.nudge())
        return RuleAnswer.allowed()
