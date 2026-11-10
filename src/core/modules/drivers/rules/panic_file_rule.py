import re

from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event import HookEvent
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.program_lockdown import ProgramLockdown
from core.base.driver.rule_answer import RuleAnswer
from core.base.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from core.modules.drivers.support.access_nudges import PANIC_FILE

PANIC_PATH = re.compile(r"\.journal/panic(?![\w.-])")


class PanicFileRule(DriverRule):
    """An agent may write the panic file only after hooks went through unchecked because the server did not answer
    them, or while its program is stopped at a usage limit; otherwise the file is not an agent's to write, and the
    refusal has no skip."""

    name = "drivers.panic-file"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    overlay_proof = True
    refuses_one_action = "An agent may write the panic file only after hooks went through unchecked because the server did not answer"

    def __init__(self, home: JournalHome, lockdown: ProgramLockdown) -> None:
        self.home, self.lockdown = home, lockdown

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not self.names_panic_file(hook.event) or self.server_unreachable() or self.lockdown.lockdown(hook.event.program).is_active:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(PANIC_FILE.nudge())

    @staticmethod
    def names_panic_file(event: HookEvent) -> bool:
        tool = event.tool
        if tool is None:
            return False
        if tool.shell is not None:
            return any(PANIC_PATH.search(redirect) for redirect in tool.shell.redirects) or any(PANIC_PATH.search(part.text) for part in tool.shell.parts)
        return any(PANIC_PATH.search(str(value)) for value in event.tool_input().values())

    def server_unreachable(self) -> bool:
        log = self.home.bypass_log
        return log.is_file() and bool(FileAccess.shared().read(log, errors="replace").strip())
