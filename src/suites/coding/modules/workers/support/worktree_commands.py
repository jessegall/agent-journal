import os
from pathlib import Path
from collections.abc import Mapping, Sequence

from engine.enums.process_kind import ProcessKind
from engine.errors.refusal import Refusal
from engine.errors.run_time_limit_error import RunTimeLimitError
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor
from suites.coding.modules.workers.models.merge_followup import STEP_FINISHED, FAILED_STEP, UNCERTAIN_STEP
from suites.coding.modules.workers.support.command_result import CommandResult
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_settings import MERGE_HOOKS_NAME

COMMAND_LIMIT_SECONDS = 600


class WorktreeCommands:
    """Runs the commands a setting holds in a folder, one per line, through the one door; the first that fails
    refuses the order."""

    def __init__(self, executor: ProcessExecutor) -> None:
        self.executor = executor

    def run(self, folder: str, branch: str, lines: Sequence[str], libraries: Sequence[str], setting: str) -> None:
        for line in lines:
            outcome = self.step(folder, branch, line, libraries, setting)
            if outcome.state != STEP_FINISHED:
                raise Refusal(outcome.reason, outcome.suggestion)

    def step(self, folder: str, branch: str, line: str, libraries: Sequence[str], setting: str) -> CommandResult:
        return self.executed(folder, line, {**os.environ, "JOURNAL_WORKTREE": folder, "JOURNAL_BRANCH": branch, "JOURNAL_LIBRARIES": " ".join(libraries)}, setting)

    def merge_hook(self, folder: str, worktree: Worktree, line: str) -> CommandResult:
        """Runs one merge hook in the checkout the worker was merged into, told the merged branch and the commits
        before and after the merge."""
        return self.executed(folder, line, {**os.environ, "JOURNAL_WORKTREE": folder, "JOURNAL_BRANCH": worktree.base_branch,
                                            "JOURNAL_COMMIT_BEFORE": worktree.commit_before_merge, "JOURNAL_COMMIT_AFTER": worktree.commit_after_merge}, MERGE_HOOKS_NAME)

    def executed(self, folder: str, line: str, variables: Mapping[str, str], setting: str) -> CommandResult:
        try:
            finished = self.executor.execute(ExecutionRequest(["sh", "-c", line], Path(folder), ProcessKind.SHELL, COMMAND_LIMIT_SECONDS, variables=variables))
        except RunTimeLimitError:
            return CommandResult(UNCERTAIN_STEP, f"the command {line!r} took longer than {COMMAND_LIMIT_SECONDS} seconds and may have done part of its work",
                                 f"check what it did, then merge again with --reconcile, or change workers.{setting}")
        if not finished.succeeded:
            return CommandResult(FAILED_STEP, f"the command {line!r} of workers.{setting} failed with code {finished.exit_code}", (finished.stderr or finished.stdout).strip())
        return CommandResult(STEP_FINISHED)
