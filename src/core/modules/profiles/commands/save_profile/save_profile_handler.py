from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.modules.profiles.commands.save_profile.save_profile import SaveProfile
from core.base.profile.agent_profile import AgentProfile
from core.base.profile.profile_name import PROFILE_NAME
from core.modules.profiles.support.profile_files import SHIPPED_PREFIX, ProfileFiles

class SaveProfileHandler(Handler[SaveProfile, AgentProfile]):
    """Writes a profile's file for each agent program, once its name, type and description are good."""

    command = SaveProfile

    def __init__(self, files: ProfileFiles) -> None:
        self.files = files

    def handle(self, command: SaveProfile, context: Context) -> AgentProfile:
        profile = command.profile
        if not PROFILE_NAME.fullmatch(profile.name):
            raise Refusal(f"{profile.name} cannot name a profile", "use letters, digits, dashes and underscores")
        if profile.name.startswith(SHIPPED_PREFIX):
            raise Refusal(f"a profile starting with {SHIPPED_PREFIX} is reserved for built-in profiles", "choose another name")
        if profile.agent_type not in self.files.profile_types:
            raise Refusal(f"{profile.agent_type} is no agent type: no installed module registers it", "register it on a module")
        if not profile.description.strip():
            raise Refusal("a profile needs a description", "the agent reads it to decide when to start the profile")
        return self.files.save(profile)
