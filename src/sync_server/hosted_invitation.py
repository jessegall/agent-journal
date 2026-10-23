import json
import os
import secrets
import time
from pathlib import Path

from sync_server.hosted_join import HostedJoin
from sync_server.team_server import TeamServer

HOSTED_EMAIL = "hosted-journal@team.server"
HOSTED_NAME = "Hosted journal"
HOSTED_FILE = "hosted.json"
POLL_SECONDS = 2


class HostedInvitation:
    """The invitation the team server's own hosted journal joins with: issued once the team holds a journal, so the hosted journal downloads it and never uploads one of its own, for the service account the hosted journal accepts it as, whose password is made here and kept only in the data folder."""

    def __init__(self, data: Path) -> None:
        self.data = data

    def issued(self) -> HostedJoin:
        team = TeamServer(self.data)
        while not team.details.answer().has_rows:
            time.sleep(POLL_SECONDS)
        code, _ = team.invitations.issue(HOSTED_EMAIL, time.time())
        password = secrets.token_urlsafe(24)
        password_file = self.data / HOSTED_FILE
        password_file.write_text(json.dumps({"email": HOSTED_EMAIL, "password": password}))
        os.chmod(password_file, 0o600)
        return HostedJoin(code, HOSTED_NAME, password, team.details.version())
