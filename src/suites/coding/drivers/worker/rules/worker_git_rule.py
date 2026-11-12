from suites.coding.support.coding_nudges import WORKER_GIT_BAN
from suites.coding.rules.no_git_rule import NoGitRule


class WorkerGitRule(NoGitRule):
    """A worker runs no git: the journal commits, rebases and merges its worktree."""

    name = "workers.no-git"
    refusal = WORKER_GIT_BAN
