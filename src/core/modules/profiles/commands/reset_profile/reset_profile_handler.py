from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.profiles.commands.reset_profile.reset_profile import ResetProfile
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.profiles.support.profile_person import check_profile_person


class ResetProfileHandler(Handler[ResetProfile, str]):
    command = ResetProfile

    def __init__(self, files: ProfileFiles) -> None:
        self.files = files

    def handle(self, command: ResetProfile, context: Context) -> str:
        check_profile_person(context)
        self.files.reset(command.name)
        return command.name
