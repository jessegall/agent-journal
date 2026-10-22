from sync_server.account import ADMIN
from sync_server.refusal import Refusal
from sync_server.team_server import TeamServer


class TeamSetup:
    """A new team server's first state: its admin's account, and a join code for the admin's own journal."""

    def __init__(self, team: TeamServer) -> None:
        self.team = team

    def create(self, name: str, email: str, password: str, password_repeat: str, created_at: float) -> str:
        if password != password_repeat:
            raise Refusal("the two passwords differ: type the same password twice")
        self.team.accounts.create(email, name, password, ADMIN, created_at)
        return self.team.invitations.issue(email, created_at)[0]
