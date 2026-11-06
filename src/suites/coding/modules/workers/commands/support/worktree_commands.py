import os
import subprocess
from collections.abc import Sequence

from core.base.refusal import Refusal

COMMAND_LIMIT_SECONDS = 600


class WorktreeCommands:
    """Runs the commands a setting holds in a folder, one per line; the first that fails refuses the order."""

    def run(self, folder: str, branch: str, lines: Sequence[str], libraries: Sequence[str], setting: str) -> None:
        variables = {**os.environ, "JOURNAL_WORKTREE": folder, "JOURNAL_BRANCH": branch, "JOURNAL_LIBRARIES": " ".join(libraries)}
        for line in lines:
            try:
                finished = subprocess.run(["sh", "-c", line], cwd=folder, env=variables, capture_output=True, text=True, timeout=COMMAND_LIMIT_SECONDS,
                                          check=False)
            except subprocess.TimeoutExpired as timeout:
                raise Refusal(f"the command {line!r} took longer than {COMMAND_LIMIT_SECONDS} seconds", f"make it faster, or change workers.{setting}") from timeout
            if finished.returncode != 0:
                raise Refusal(f"the command {line!r} of workers.{setting} failed with code {finished.returncode}", (finished.stderr or finished.stdout).strip())
