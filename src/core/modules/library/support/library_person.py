from engine.command.context import Context
from core.modules.agents.support.person_check import PersonCheck


class LibraryPerson:
    """The check every command that decides for the team shares: a person gives it, never an agent."""

    @staticmethod
    def require(context: Context, reason: str) -> None:
        PersonCheck.require(context, f"Allow this team action? {reason}", returns_output=True)
