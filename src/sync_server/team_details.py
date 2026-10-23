import re

from sync_server.change_log import ChangeLog
from sync_server.db.team_detail_rows import TeamDetailRows
from sync_server.refusal import Refusal
from sync_server.team_summary import TeamSummary

REPOSITORY = "repository"
VERSION = "version"
VERSION_SHAPE = re.compile(r"\d+\.\d+\.\d+")


class TeamDetails:
    """What the team server knows of the journal it hosts: the first commit of its repository, which a joining checkout must share, and the journal version the team is pinned to, which the first copy's journal sets and an admin moves."""

    def __init__(self, rows: TeamDetailRows, log: ChangeLog) -> None:
        self.rows, self.log = rows, log

    def record_repository(self, repository: str) -> None:
        self.rows.write(REPOSITORY, repository)

    def record_version(self, version: str) -> None:
        if not VERSION_SHAPE.fullmatch(version):
            raise Refusal(f"{version} is not a journal version such as 4.20.0")
        self.rows.write(VERSION, version)
        self.log.wake()

    def version(self) -> str:
        return self.rows.value(VERSION)

    def answer(self) -> TeamSummary:
        return TeamSummary(self.rows.value(REPOSITORY), self.log.head() > 0, self.version())
