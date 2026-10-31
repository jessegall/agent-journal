import os
import subprocess
from collections.abc import Sequence

from core.base.refusal import Refusal
from suites.coding.modules.workers.models.worktree import Worktree

COMMAND_LIMIT_SECONDS = 600


class WorktreeCommands:
    """Runs the user's worktree commands in a new worktree, one per line; the first that fails refuses the dispatch."""

    def run(self, worktree: Worktree, lines: Sequence[str], libraries: Sequence[str]) -> None:
        variables = {**os.environ, "JOURNAL_WORKTREE": worktree.folder, "JOURNAL_BRANCH": worktree.branch, "JOURNAL_LIBRARIES": " ".join(libraries)}
        for line in lines:
            try:
                finished = subprocess.run(["sh", "-c", line], cwd=worktree.folder, env=variables, capture_output=True, text=True, timeout=COMMAND_LIMIT_SECONDS,
                                          check=False)
            except subprocess.TimeoutExpired as timeout:
                raise Refusal(f"the worktree command {line!r} took longer than {COMMAND_LIMIT_SECONDS} seconds", "make it faster, or change workers.worktree-commands") from timeout
            if finished.returncode != 0:
                raise Refusal(f"the worktree command {line!r} failed with code {finished.returncode}", (finished.stderr or finished.stdout).strip())
