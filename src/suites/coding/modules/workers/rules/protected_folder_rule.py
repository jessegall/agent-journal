from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.protected_folders import ProtectedFolders
from suites.coding.modules.workers.support.worker_nudges import PROTECTED_FOLDER
from suites.coding.support.coding_helper_kind import CodingHelperKind


class ProtectedFolderRule(DriverRule):
    """Stops worker edits to the project's protected folders."""

    name = "workers.protected-folder"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [CodingHelperKind.WORKER]

    def __init__(self, worktrees: WorktreeQuery, protected: ProtectedFolders) -> None:
        self.worktrees, self.protected = worktrees, protected

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or not tool.is_writing_files():
            return RuleAnswer.allowed()
        worktree = self.worktrees.worker_worktree(hook.agent_id)
        if worktree is None:
            return RuleAnswer.allowed()
        paths = list(tool.files)
        if tool.shell is not None:
            paths.extend(path for part in tool.shell.parts for path in part.output_paths)
        for path in paths:
            folder = self.protected.match(worktree.folder, path)
            if folder:
                return RuleAnswer.refused(PROTECTED_FOLDER.nudge(folder=folder))
        return RuleAnswer.allowed()
