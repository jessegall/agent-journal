from engine.command.context import Context
from engine.actor.person_check import PersonCheck


def check_profile_person(context: Context) -> None:
    PersonCheck.require(context, "Change this profile?")
