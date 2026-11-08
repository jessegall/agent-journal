import os
import subprocess
from collections.abc import Sequence

from core.base.refusal import Refusal
from suites.coding.modules.workers.models.merge_followup import STEP_FINISHED, FAILED_STEP, UNCERTAIN_STEP
from suites.coding.modules.workers.commands.support.command_result import CommandResult

COMMAND_LIMIT_SECONDS = 600


class WorktreeCommands:
    """Runs the commands a setting holds in a folder, one per line; the first that fails refuses the order."""

    def run(self, folder: str, branch: str, lines: Sequence[str], libraries: Sequence[str], setting: str) -> None:
        for line in lines:
            outcome = self.step(folder, branch, line, libraries, setting)
            if outcome.state != STEP_FINISHED:
                raise Refusal(outcome.reason, outcome.suggestion)

    def step(self, folder: str, branch: str, line: str, libraries: Sequence[str], setting: str) -> CommandResult:
        variables = {**os.environ, "JOURNAL_WORKTREE": folder, "JOURNAL_BRANCH": branch, "JOURNAL_LIBRARIES": " ".join(libraries)}
        try:
            finished = subprocess.run(["sh", "-c", line], cwd=folder, env=variables, capture_output=True, text=True, timeout=COMMAND_LIMIT_SECONDS, check=False)
        except subprocess.TimeoutExpired:
            return CommandResult(UNCERTAIN_STEP, f"the command {line!r} took longer than {COMMAND_LIMIT_SECONDS} seconds and may have done part of its work",
                                 f"check what it did, then merge again with --reconcile, or change workers.{setting}")
        if finished.returncode != 0:
            return CommandResult(FAILED_STEP, f"the command {line!r} of workers.{setting} failed with code {finished.returncode}", (finished.stderr or finished.stdout).strip())
        return CommandResult(STEP_FINISHED)
