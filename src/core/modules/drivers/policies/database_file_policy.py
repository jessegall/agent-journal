from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
import re

from engine.driver.part import Part
from engine.enums.command_category import CommandCategory
from core.modules.drivers.agent_messages.database_file_message import DatabaseFileMessage

DATABASE_PATH = re.compile(r"\.journal/version-5\.db(?:-wal|-shm)?(?![\w-])")
READ_ONLY_FLAG = "-readonly"
READING = (CommandCategory.READ, CommandCategory.SEARCH)


class DatabaseFilePolicy(EventPolicy):
    """No agent writes the journal's database file from a shell line: a redirect into it, or a program that is not a
    read naming it, such as sqlite3 without -readonly; the refusal has no skip."""

    key = "drivers.database-file"
    rank = "safety.all"
    is_safety = True
    grant_types = []


    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        shell = event.tool.shell if event.tool is not None else None
        if shell is None:
            return None
        writes = any(DATABASE_PATH.search(redirect) for redirect in shell.redirects) or any(self.writes_database(part) for part in shell.parts)
        return DatabaseFileMessage.declared().agent_message() if writes else None

    @staticmethod
    def writes_database(part: Part) -> bool:
        return DATABASE_PATH.search(part.text) is not None and READ_ONLY_FLAG not in part.arguments and part.classification.category not in READING
