from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
from core.modules.processes.agent_messages.journal_command_last_message import JournalCommandLastMessage
import re

from engine.driver.part import Part
from core.modules.processes.support.background_commands import JOURNAL

LOOPS = ("until", "while", "for")
QUOTED = re.compile(r'\'[^\']*\'|"(?:\\.|[^"\\])*"')
JOURNAL_COMMAND = re.compile(rf"(^|[;(|&]\s*|\bdo\s+|\buntil\s+|\bwhile\s+|\bthen\s+){JOURNAL}\s+[a-z]")


class JournalChainPolicy(EventPolicy):
    """Refuses a journal command after a command that may run long, such as a test or a build, or inside a
    loop; a word inside quotes is text, never a command."""

    key = "processes.journal-chain"
    rank = "shell.all"

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        shell = event.tool.shell if event.tool is not None else None
        if shell is None or shell.parse_error:
            return None
        has_long_part = False
        for part in shell.parts:
            if self.is_journal_loop(part) or (part.program == JOURNAL and has_long_part):
                return JournalCommandLastMessage.declared().agent_message()
            has_long_part = has_long_part or not part.classification.category.is_short
        return None

    def is_journal_loop(self, part: Part) -> bool:
        return part.program in LOOPS and JOURNAL_COMMAND.search(QUOTED.sub('""', part.text)) is not None
