from journal.engine.job import Job
from journal.sync.team_account import TeamAccount
from journal.sync.team_chat_branch import TeamChatBranch


class TeamChatFiles(Job):
    """Every ten seconds on a joined journal, the Team chat's files are pushed from the machine that holds it, or brought into this machine's worktree of it from the holder's last push."""

    interval_seconds = 10.0

    def __init__(self, account: TeamAccount, branch: TeamChatBranch) -> None:
        self.account, self.branch = account, branch

    def tick(self, time: float) -> None:
        if not self.account.is_joined():
            return
        if self.account.is_chat_holder():
            self.branch.push(time)
            return
        self.branch.pull()
