from engine.driver.nudge import Nudge
from engine.agent_machine.contracts.event_policy import EventPolicy
import re

from engine.driver.hook_event import HookEvent
from engine.driver.program_lockdown import ProgramLockdown
from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from core.modules.drivers.nudges.panic_file_nudge import PanicFileNudge

PANIC_PATH = re.compile(r"\.journal/panic(?![\w.-])")


class PanicFilePolicy(EventPolicy):
    """An agent may write the panic file only after hooks went through unchecked because the server did not
    answer them, or while its program is stopped at a usage limit; otherwise the file is not an agent's to
    write, and the refusal has no skip."""

    key = "drivers.panic-file"
    rank = "safety.all"
    is_safety = True
    grant_types = []


    def __init__(self, home: JournalHome, lockdown: ProgramLockdown) -> None:
        self.home, self.lockdown = home, lockdown

    def refusal(self, event: HookEvent, agent_id: int) -> Nudge | None:
        if not self.is_panic_file_line(event) or self.server_unreachable() or self.lockdown.lockdown(event.program).is_active:
            return None
        return PanicFileNudge.declared().nudge()

    @staticmethod
    def is_panic_file_line(event: HookEvent) -> bool:
        tool = event.tool
        if tool is None:
            return False
        if tool.shell is not None:
            return any(PANIC_PATH.search(redirect) for redirect in tool.shell.redirects) or any(PANIC_PATH.search(part.text) for part in tool.shell.parts)
        return any(PANIC_PATH.search(str(value)) for value in event.tool_input().values())

    def server_unreachable(self) -> bool:
        log = self.home.bypass_log
        return FileAccess.is_file(log) and bool(FileAccess.read(log, errors="replace").strip())
