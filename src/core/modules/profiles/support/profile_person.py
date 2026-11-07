from core.base.command.context import Context
from core.modules.agents.support.person_check import PersonCheck


def check_profile_person(context: Context) -> None:
    PersonCheck.require(context, "Change this profile?")
