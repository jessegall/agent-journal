from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.agents.commands.report_unused_launcher.report_unused_launcher import ReportUnusedLauncher
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message

REPORT_TEXT = """Two launchers of this journal ran at once: process {serving} serves the journal, and process {unused} was started beside it.
Process {unused} ran no program and is stopped."""


class ReportUnusedLauncherHandler(Handler[ReportUnusedLauncher, bool]):
    """Saves the chat message that names both launcher processes, unless the chat has it already."""

    command = ReportUnusedLauncher

    def __init__(self, repository: Repository, queries: Queries) -> None:
        self.repository, self.queries = repository, queries

    def handle(self, command: ReportUnusedLauncher, context: Context) -> bool:
        text = REPORT_TEXT.format(serving=command.serving_pid, unused=command.unused_pid)
        if self.queries.query(Message).filter(type=MessageType.JOURNAL, text=text).exists():
            return False
        self.repository.save(Message(creator_id=context.actor.id, type=MessageType.JOURNAL, text=text), context)
        return True
