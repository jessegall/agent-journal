from core.base.caller.caller import Caller
from core.base.database.database import Database
from core.base.scope.scopes import Scopes
from engine.errors.read_limit_error import ReadLimitError
from engine.errors.refusal import Refusal

ALLOW_LARGE_READ_FLAG = "--allow-large-read"


class ReadLimitBypass:
    """Lets one command line run with the read limit off when it carries --allow-large-read, which only a
    person or the main agent may pass, and words the refusal of a line that loaded more rows than the limit."""

    def __init__(self, database: Database, scopes: Scopes) -> None:
        self.database, self.scopes = database, scopes

    def applied(self, argv: list[str], caller: Caller) -> list[str]:
        if ALLOW_LARGE_READ_FLAG not in argv:
            return argv
        if not self.may_bypass(caller):
            raise Refusal(f"{ALLOW_LARGE_READ_FLAG} is for the main agent", "report the refused line to your main agent")
        self.database.read_limit_rows = None
        return [word for word in argv if word != ALLOW_LARGE_READ_FLAG]

    def refusal(self, error: ReadLimitError, caller: Caller) -> Refusal:
        reason = f"this line is refused: {error}"
        if self.may_bypass(caller):
            return Refusal(reason, f"fix the read so it filters, pages or counts; to run this one line anyway, repeat it with {ALLOW_LARGE_READ_FLAG}")
        return Refusal(reason, "your main agent is informed; go on with other work")

    def may_bypass(self, caller: Caller) -> bool:
        if not caller.actor.is_agent():
            return True
        owner = self.scopes.owner(caller.read_actor_id, caller.environment_id)
        return owner is not None and owner.is_main
