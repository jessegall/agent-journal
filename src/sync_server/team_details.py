from sync_server.change_log import ChangeLog
from sync_server.db.team_detail_rows import TeamDetailRows
from sync_server.team_summary import TeamSummary

REPOSITORY = "repository"


class TeamDetails:
    """What the team server knows of the journal it hosts: the first commit of its repository, which a joining checkout must share."""

    def __init__(self, rows: TeamDetailRows, log: ChangeLog) -> None:
        self.rows, self.log = rows, log

    def record_repository(self, repository: str) -> None:
        self.rows.write(REPOSITORY, repository)

    def answer(self) -> TeamSummary:
        return TeamSummary(self.rows.value(REPOSITORY), self.log.head() > 0)
