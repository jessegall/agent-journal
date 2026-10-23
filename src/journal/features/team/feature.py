from journal.engine.nudge import Nudge
from journal.features.feature import Feature
from journal.features.team.support.hosted_option import HOSTED
from journal.features.team.support.team_data import TeamData
from journal.features.team.support.team_data_reader import TeamDataReader
from journal.features.team.team_conduct import TeamConduct
from journal.features.team.commands.team_command import TeamCommand
from journal.features.team.jobs.team_chat_files import TeamChatFiles
from journal.features.team.listeners.colleague_write_guard import ColleagueWriteGuard
from journal.features.team.listeners.environment_owner_record import EnvironmentOwnerRecord


class TeamFeature(Feature[TeamData]):
    HOSTED = HOSTED
    name = "team"
    title = "Team"
    help = "A journal shared with a team through its server: joining it, inviting people, the team's devices and how the sync stands."
    commands = (TeamCommand,)
    listeners = (EnvironmentOwnerRecord, ColleagueWriteGuard)
    options = (HOSTED,)
    jobs = (TeamChatFiles,)
    data = (TeamDataReader,)
    conduct = (TeamConduct,)

    UPGRADE_NEEDED = Nudge(name, "journal_behind_the_team", "this journal is behind its team: {{line}}", "once the team's rows are migrated the team server takes none of its changes until it is upgraded, and they wait here; tell your user once, and go on with the work", repeat_interval=0)
    nudges = (UPGRADE_NEEDED,)
