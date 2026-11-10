from pathlib import Path

from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from suites.coding.modules.workers.rules.support.worker_worktrees import WorkerWorktrees
from suites.coding.modules.workers.support.worker_nudges import WORKER_FILE


class WorkerFileRule(DriverRule):
    """The main agent edits no file inside a worker's worktree: the work goes to the worker."""

    name = "workers.worker-file"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]
    refuses_one_action = "The main agent edits no file inside a worker's worktree"

    def __init__(self, worktrees: WorkerWorktrees) -> None:
        self.worktrees = worktrees

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or not tool.is_writing_files():
            return RuleAnswer.allowed()
        for worktree in self.worktrees.main_worktrees():
            if any(Path(path).is_relative_to(worktree.folder) for path in tool.files):
                return RuleAnswer.refused(WORKER_FILE.nudge(worker=worktree.session_agent_id))
        return RuleAnswer.allowed()
