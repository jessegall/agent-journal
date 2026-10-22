from journal.features.feature import Feature
from journal.features.team.commands.team_command import TeamCommand


class TeamFeature(Feature):
    name = "team"
    title = "Team"
    help = "A journal shared with a team through its server: joining it, inviting people, the team's devices and how the sync stands."
    commands = (TeamCommand,)
