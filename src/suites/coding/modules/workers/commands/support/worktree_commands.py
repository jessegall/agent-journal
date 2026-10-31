import os
import subprocess
from collections.abc import Sequence

from core.base.refusal import Refusal

COMMAND_LIMIT_SECONDS = 600


class WorktreeCommands:
    """Runs the user's worktree commands in a new worktree, one per line; the first that fails refuses the order."""

    def run(self, folder: str, branch: str, lines: Sequence[str], libraries: Sequence[str]) -> None:
        variables = {**os.environ, "JOURNAL_WORKTREE": folder, "JOURNAL_BRANCH": branch, "JOURNAL_LIBRARIES": " ".join(libraries)}
        for line in lines:
            try:
                finished = subprocess.run(["sh", "-c", line], cwd=folder, env=variables, capture_output=True, text=True, timeout=COMMAND_LIMIT_SECONDS,
                                          check=False)
            except subprocess.TimeoutExpired as timeout:
                raise Refusal(f"the worktree command {line!r} took longer than {COMMAND_LIMIT_SECONDS} seconds", "make it faster, or change workers.worktree-commands") from timeout
            if finished.returncode != 0:
                raise Refusal(f"the worktree command {line!r} failed with code {finished.returncode}", (finished.stderr or finished.stdout).strip())
