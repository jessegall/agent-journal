import shlex

from suites.coding.modules.workers.models.worktree import Worktree


class MergeHookLine:
    """The shell line of a merge hook run as a process: the hook told the checkout, the merged branch and the
    commits before and after the merge, in the one word the line ends with."""

    @staticmethod
    def build(folder: str, worktree: Worktree, hook: str) -> str:
        variables = {"JOURNAL_WORKTREE": folder, "JOURNAL_BRANCH": worktree.base_branch,
                     "JOURNAL_COMMIT_BEFORE": worktree.commit_before_merge, "JOURNAL_COMMIT_AFTER": worktree.commit_after_merge}
        return shlex.join(["env", *(f"{name}={value}" for name, value in variables.items()), "sh", "-c", hook])

    @staticmethod
    def hook(line: str) -> str:
        return shlex.split(line)[-1]
