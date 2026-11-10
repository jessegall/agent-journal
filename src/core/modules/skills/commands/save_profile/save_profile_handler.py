from engine.enums.access import Access
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.command.context import Context
from engine.command.handler import Handler
from engine.profile.agent_profile import AgentProfile
from engine.errors.refusal import Refusal
from core.modules.skills.commands.save_profile.save_profile import SaveProfile
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.profiles.support.profile_person import check_profile_person


class SaveProfileHandler(Handler[SaveProfile, AgentProfile]):
    """Saves a personal profile or its changes to a module's profile."""

    command = SaveProfile

    def __init__(self, files: ProfileFiles, types: HelperTypeBook) -> None:
        self.files, self.types = files, types

    def handle(self, command: SaveProfile, context: Context) -> AgentProfile:
        check_profile_person(context)
        profile = command.profile
        self.files.path(profile.name)
        agent_type = self.types.find(profile.agent_type)
        if profile.agent_type == "main":
            raise Refusal("main cannot be a profile", "choose one of the types in journal profile list")
        if profile.access is Access.WRITING and agent_type.access is not Access.WRITING:
            raise Refusal(f"a {agent_type.label} only reads", "choose a type that writes, or read-only")
        if not profile.description.strip():
            raise Refusal("a profile needs a description", "the agent reads it to decide when to start the profile")
        registered = self.files.registered(profile.name)
        if registered is not None and profile.agent_type != registered.agent_type:
            raise Refusal(f"{profile.name} comes with a module, so its type stays {registered.agent_type}", "make your own profile under another name")
        profile = self.files.checked_type(profile)
        return self.files.save_changes(registered, profile) if registered is not None else self.files.save(profile)
