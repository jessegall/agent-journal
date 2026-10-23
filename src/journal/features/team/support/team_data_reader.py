from journal.features.team.support.team_data import TeamData
from journal.models.agent import Agent
from journal.sync.sync_status import SyncStatus


class TeamDataReader:
    """Reads the team feature's part of the feature data for an agent."""

    def __init__(self, status: SyncStatus) -> None:
        self.status = status

    def read(self, agent: Agent) -> TeamData:
        return TeamData(upgrade=self.status.upgrade_line())
