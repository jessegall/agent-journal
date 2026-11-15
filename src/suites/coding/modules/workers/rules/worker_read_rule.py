from suites.coding.modules.workers.types.worker import Worker
from os.path import join, normpath
from pathlib import Path

from engine.provider.providers import Providers
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_nudges import WORKER_READ_REFUSAL

SHARED_FOLDERS = ("/tmp", "/private/tmp")


class WorkerReadRule(DriverRule):
    """A worker reads only its own worktree, the temporary folder and its program's home, never another worker's
    worktree beside its own. The OS sandbox holds its shell lines to the same limit."""

    name = "workers.worker-read"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [Worker.key]
    single_action_refusal = "A worker reads only its own worktree, the temporary folder and its program's home"

    def __init__(self, worktrees: WorktreeQuery, providers: Providers) -> None:
        self.worktrees, self.providers = worktrees, providers

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or not tool.category.reads_files:
            return RuleAnswer.allowed()
        worktree = self.worktrees.worker_worktree(hook.agent_id)
        if worktree is None:
            return RuleAnswer.allowed()
        readable = (worktree.folder, *SHARED_FOLDERS, *self.providers.provider(hook.event.program).readable_folders())
        # the folder beside the worktree holds the other workers' worktrees, never readable, even inside a shared folder
        others = Path(worktree.folder).parent
        paths = [Path(normpath(join(worktree.folder, path))) for path in tool.files]
        if all(any(path.is_relative_to(folder) for folder in readable) and not (path.is_relative_to(others) and not path.is_relative_to(worktree.folder)) for path in paths):
            return RuleAnswer.allowed()
        return RuleAnswer.refused(WORKER_READ_REFUSAL.nudge())
