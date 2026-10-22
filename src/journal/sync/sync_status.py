from journal.repositories.outgoing_changes import OutgoingChanges
from journal.sync.team_account import TeamAccount


class SyncStatus:
    """How this journal's sync with its team server stands, in one line for the viewer's status bar: nothing in no team, the fault while it cannot reach the server, else how many changes wait to be sent."""

    def __init__(self, account: TeamAccount, outgoing: OutgoingChanges) -> None:
        self.account, self.outgoing = account, outgoing
        self.fault = "not started"

    def connected(self) -> None:
        self.fault = ""

    def failed(self, fault: str) -> None:
        self.fault = fault

    def line(self) -> str:
        if not self.account.is_joined():
            return ""
        if self.fault:
            return f"Not connected: {self.fault}"
        waiting = len(self.outgoing.waiting())
        return f"{waiting} changes waiting" if waiting else "In step with the team"
