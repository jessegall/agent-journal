from journal.repositories.outgoing_changes import OutgoingChanges
from journal.support.release import Release
from journal.sync.team_account import TeamAccount
from journal.version import VERSION


class SyncStatus:
    """How this journal's sync with its team server stands, in one line for the viewer's status bar: nothing in no team, the version to install when the team is pinned to a newer one, the fault while it cannot reach the server, else how many changes wait to be sent."""

    def __init__(self, account: TeamAccount, outgoing: OutgoingChanges) -> None:
        self.account, self.outgoing = account, outgoing
        self.fault = "not started"

    def connected(self) -> None:
        self.fault = ""

    def failed(self, fault: str) -> None:
        self.fault = fault

    def upgrade_line(self) -> str:
        team_version = self.account.team_version()
        if not team_version or not Release(team_version).is_newer(Release(VERSION)):
            return ""
        return f"Your team is on version {team_version}: journal update apply installs it"

    def line(self) -> str:
        if not self.account.is_joined():
            return ""
        if self.upgrade_line():
            return self.upgrade_line()
        if self.fault:
            return f"Not connected: {self.fault}"
        waiting = len(self.outgoing.waiting())
        return f"{waiting} changes waiting" if waiting else "In step with the team"
