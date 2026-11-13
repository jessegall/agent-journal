from engine.caller.caller import Caller
from engine.helper_type.journal_line import JournalLine


class CallerLineCheck:
    """Refuses a journal line its caller may not run, before the line reads or changes anything. With no module
    checking, every caller runs every line."""

    def allows(self, caller: Caller, line: JournalLine) -> bool:
        return True

    def check(self, caller: Caller, line: JournalLine) -> None:
        return None
