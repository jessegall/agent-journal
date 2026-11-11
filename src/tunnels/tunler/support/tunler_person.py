from engine.command.context import Context
from engine.command.person_check import PersonCheck


class TunlerPerson:
    """The check every command that changes tunler shares: a person gives it, never an agent."""

    @staticmethod
    def require(context: Context) -> None:
        PersonCheck.require(context, "Change Tunler settings?")
