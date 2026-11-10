from engine.caller.caller import Caller
from core.base.database.database import Database
from engine.scope.scopes import Scopes
from engine.errors.read_limit_error import ReadLimitError
from engine.errors.refusal import Refusal

ALLOW_LARGE_READ_FLAG = "--allow-large-read"


class ReadLimitBypass:
    """Only an agent's command line is refused for a read over the read limit: any other caller's line
    finishes and the read is reported. The main agent runs one line with the limit off by adding
    --allow-large-read, which a helper may not pass."""

    def __init__(self, database: Database, scopes: Scopes) -> None:
        self.database, self.scopes = database, scopes

    def applied(self, argv: list[str], caller: Caller) -> list[str]:
        if not caller.actor.is_agent() and self.database.collected_large_reads is None:
            self.database.collected_large_reads = []
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
