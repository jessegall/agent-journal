import re

from sync_server.change_log import ChangeLog
from sync_server.db.team_detail_rows import TeamDetailRows
from sync_server.protocol import UNVERSIONED
from sync_server.refusal import Refusal
from sync_server.team_summary import TeamSummary

REPOSITORY = "repository"
VERSION = "version"
MIGRATION = "migration"
VERSION_SHAPE = re.compile(r"\d+\.\d+\.\d+")


class TeamDetails:
    """What the team server knows of the journal it hosts: the first commit of its repository, which a joining checkout must share, the journal version the team is pinned to, which the first copy's journal sets and an admin moves, and the migration the team's rows are at, which the first copy sets: a journal on an older migration may neither push nor pull until it is upgraded."""

    def __init__(self, rows: TeamDetailRows, log: ChangeLog) -> None:
        self.rows, self.log = rows, log

    def record_repository(self, repository: str) -> None:
        self.rows.write(REPOSITORY, repository)

    def record_version(self, version: str) -> None:
        if not VERSION_SHAPE.fullmatch(version):
            raise Refusal(f"{version} is not a journal version such as 4.20.0")
        self.rows.write(VERSION, version)
        self.log.wake()

    def record_migration(self, number: int) -> None:
        self.rows.write(MIGRATION, str(number))

    def require_migration(self, number: int) -> None:
        team = int(self.rows.value(MIGRATION) or UNVERSIONED)
        if number < team:
            raise Refusal(f"this journal is on migration {number} and the team on {team}: upgrade it to version {self.version()} with journal update apply; its changes wait here until then")

    def version(self) -> str:
        return self.rows.value(VERSION)

    def answer(self) -> TeamSummary:
        return TeamSummary(self.rows.value(REPOSITORY), self.log.head() > 0, self.version())
