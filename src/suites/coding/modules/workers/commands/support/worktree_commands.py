import os
import subprocess
from collections.abc import Sequence
from dataclasses import dataclass

from core.base.refusal import Refusal
from suites.coding.modules.workers.models.merge_followup import DONE_STEP, FAILED_STEP, UNCERTAIN_STEP

COMMAND_LIMIT_SECONDS = 600


@dataclass(frozen=True)
class CommandResult:
    """How one command ended: done, failed with a known code, or uncertain because it ran out of time and may have
    done part of its work; for the last two, the reason and what to do."""

    state: str
    reason: str = ""
    suggestion: str = ""


class WorktreeCommands:
    """Runs the commands a setting holds in a folder, one per line; the first that fails refuses the order."""

    def run(self, folder: str, branch: str, lines: Sequence[str], libraries: Sequence[str], setting: str) -> None:
        for line in lines:
            result = self.step(folder, branch, line, libraries, setting)
            if result.state != DONE_STEP:
                raise Refusal(result.reason, result.suggestion)

    def step(self, folder: str, branch: str, line: str, libraries: Sequence[str], setting: str) -> CommandResult:
        variables = {**os.environ, "JOURNAL_WORKTREE": folder, "JOURNAL_BRANCH": branch, "JOURNAL_LIBRARIES": " ".join(libraries)}
        try:
            finished = subprocess.run(["sh", "-c", line], cwd=folder, env=variables, capture_output=True, text=True, timeout=COMMAND_LIMIT_SECONDS, check=False)
        except subprocess.TimeoutExpired:
            return CommandResult(UNCERTAIN_STEP, f"the command {line!r} took longer than {COMMAND_LIMIT_SECONDS} seconds and may have done part of its work",
                                 f"check what it did, then merge again with --reconcile, or change workers.{setting}")
        if finished.returncode != 0:
            return CommandResult(FAILED_STEP, f"the command {line!r} of workers.{setting} failed with code {finished.returncode}", (finished.stderr or finished.stdout).strip())
        return CommandResult(DONE_STEP)
