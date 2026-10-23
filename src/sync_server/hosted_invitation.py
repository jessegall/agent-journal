import json
import os
import secrets
import time
from pathlib import Path

from sync_server.account import RELAY
from sync_server.hosted_join import HostedJoin
from sync_server.team_server import TeamServer

HOSTED_EMAIL = "hosted-journal@team.server"
HOSTED_NAME = "Hosted journal"
HOSTED_FILE = "hosted.json"
POLL_SECONDS = 2


class HostedInvitation:
    """The invitation the team server's own hosted journal joins with: issued once the team holds a journal, so the hosted journal downloads it and never uploads one of its own, for the relay account the hosted journal accepts it as, made here with a password kept only in the data folder, which may send the writes of whoever signs in to the hosted journal."""

    def __init__(self, data: Path) -> None:
        self.data = data

    def issued(self) -> HostedJoin:
        team = TeamServer(self.data)
        while not team.details.answer().has_rows:
            time.sleep(POLL_SECONDS)
        password = self.password(team)
        code, _ = team.invitations.issue(HOSTED_EMAIL, time.time())
        return HostedJoin(code, HOSTED_NAME, password, team.details.version())

    def password(self, team: TeamServer) -> str:
        password_file = self.data / HOSTED_FILE
        if team.accounts.has_email(HOSTED_EMAIL):
            return json.loads(password_file.read_text())["password"]
        password = secrets.token_urlsafe(24)
        team.accounts.create(HOSTED_EMAIL, HOSTED_NAME, password, RELAY, time.time())
        password_file.write_text(json.dumps({"email": HOSTED_EMAIL, "password": password}))
        os.chmod(password_file, 0o600)
        return password
