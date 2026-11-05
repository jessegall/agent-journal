from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.profiles.commands.remove_profile.remove_profile import RemoveProfile
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.profiles.support.profile_person import check_profile_person


class RemoveProfileHandler(Handler[RemoveProfile, str]):
    command = RemoveProfile

    def __init__(self, files: ProfileFiles) -> None:
        self.files = files

    def handle(self, command: RemoveProfile, context: Context) -> str:
        check_profile_person(context)
        self.files.remove(command.name)
        return command.name
