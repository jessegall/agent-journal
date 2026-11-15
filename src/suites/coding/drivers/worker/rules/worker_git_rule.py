from suites.coding.nudges.worker_git_ban_nudge import WorkerGitBanNudge
from suites.coding.rules.no_git_rule import NoGitRule


class WorkerGitRule(NoGitRule):
    """A worker runs no git: the journal commits, rebases and merges its worktree."""

    name = "workers.no-git"
    refusal = WorkerGitBanNudge.declared()
