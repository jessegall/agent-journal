from pathlib import Path

from core.base.driver.diff_count import DiffCount
from suites.coding.modules.workers.support.worktree_git import GIT_LIMIT_SECONDS, WorktreeGit

NEW_FILE_STATUS = "??"


class ShellFileChanges:
    """What a shell command did to a file it names as written, read from git: the lines changed against the last
    commit, all of a new file's lines as added, and nothing for a file the command left as it was."""

    def __init__(self, git: WorktreeGit) -> None:
        self.git = git

    def diff(self, folder: str, path: str) -> DiffCount | None:
        if (Path(folder) / path).is_dir():
            return None
        counts = self.git.git(folder, GIT_LIMIT_SECONDS, "diff", "--numstat", "HEAD", "--", path).stdout.split()
        if len(counts) >= 2 and counts[0].isdigit() and counts[1].isdigit():
            return DiffCount(path, True, int(counts[0]), int(counts[1]))
        if not self.git.git(folder, GIT_LIMIT_SECONDS, "status", "--porcelain", "--", path).stdout.startswith(NEW_FILE_STATUS):
            return None
        return DiffCount(path, False, len((Path(folder) / path).read_text(errors="replace").splitlines()), 0)
