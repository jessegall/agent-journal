import re

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.modules.agents.support.person_check import PersonCheck
from core.modules.profiles.commands.save_profile.save_profile import SaveProfile
from core.modules.profiles.support.agent_profile import SUBAGENT, WORKER, AgentProfile
from core.modules.profiles.support.profile_files import ProfileFiles

PROFILE_NAME = re.compile(r"[A-Za-z0-9_-]+")


class SaveProfileHandler(Handler[SaveProfile, AgentProfile]):
    """Writes a profile's file for each agent program, once its name, type and description are good."""

    command = SaveProfile

    def __init__(self, files: ProfileFiles) -> None:
        self.files = files

    def handle(self, command: SaveProfile, context: Context) -> AgentProfile:
        PersonCheck.require(context, "only a person saves a profile, since it says what an agent may do")
        profile = command.profile
        if not PROFILE_NAME.fullmatch(profile.name):
            raise Refusal(f"{profile.name} cannot name a profile", "use letters, digits, dashes and underscores")
        if profile.profile_type not in (SUBAGENT, WORKER):
            raise Refusal(f"a profile is a {SUBAGENT} or a {WORKER}, not {profile.profile_type}")
        if not profile.description.strip():
            raise Refusal("a profile needs a description", "the agent reads it to decide when to start the profile")
        return self.files.save(profile)
