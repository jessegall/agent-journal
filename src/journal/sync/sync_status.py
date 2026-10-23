from journal.repositories.outgoing_changes import OutgoingChanges
from journal.support.release import Release
from journal.sync.team_account import TeamAccount
from journal.version import VERSION


class SyncStatus:
    """How this journal's sync with its team server stands, in one line for the viewer's status bar: nothing in no team, the version to install when the team is pinned to a newer one, the fault while it cannot reach the server, that it is connecting before it first has, else how many changes wait to be sent; and which of those it is, for the Team page's dot."""

    def __init__(self, account: TeamAccount, outgoing: OutgoingChanges) -> None:
        self.account, self.outgoing = account, outgoing
        self.fault = ""
        self.reached = False

    def connected(self) -> None:
        self.fault = ""
        self.reached = True

    def failed(self, fault: str) -> None:
        self.fault = fault

    def upgrade_line(self) -> str:
        team_version = self.account.team_version()
        if not team_version or not Release(team_version).is_newer(Release(VERSION)):
            return ""
        return f"Your team is on version {team_version}: journal update apply installs it"

    def state(self) -> str:
        if self.upgrade_line():
            return "version"
        if self.fault:
            return "not_connected"
        if not self.reached:
            return "connecting"
        return "waiting" if self.waiting() else "in_step"

    def waiting(self) -> int:
        return len(self.outgoing.waiting())

    def line(self) -> str:
        if not self.account.is_joined():
            return ""
        if self.upgrade_line():
            return self.upgrade_line()
        if self.fault:
            return f"Not connected: {self.fault}"
        if not self.reached:
            return "Connecting to the team server"
        waiting = self.waiting()
        if not waiting:
            return "In step with the team"
        return "1 change waiting" if waiting == 1 else f"{waiting} changes waiting"
