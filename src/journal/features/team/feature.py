from journal.features.feature import Feature
from journal.features.team.commands.team_command import TeamCommand
from journal.features.team.listeners.colleague_write_guard import ColleagueWriteGuard
from journal.features.team.listeners.environment_owner_record import EnvironmentOwnerRecord


class TeamFeature(Feature):
    name = "team"
    title = "Team"
    help = "A journal shared with a team through its server: joining it, inviting people, the team's devices and how the sync stands."
    commands = (TeamCommand,)
    listeners = (EnvironmentOwnerRecord, ColleagueWriteGuard)
