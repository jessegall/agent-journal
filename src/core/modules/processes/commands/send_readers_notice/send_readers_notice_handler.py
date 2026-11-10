from engine.command.context import Context
from collections.abc import Sequence
from engine.command.handler import Handler
from engine.driver.command_category import CommandCategory
from engine.query.queries import Queries
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from engine.driver.nudger import Nudger
from core.modules.processes.commands.send_readers_notice.send_readers_notice import SendReadersNotice
from core.modules.processes.models.reader import Reader
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.support.reader_rows import ReaderRows
from core.modules.processes.support.process_nudges import READERS_MISSING_FIELDS
from core.modules.processes.support.reader_judge import ReaderJudge

SOURCE = "processes.readers-at-start"


class SendReadersNoticeHandler(Handler[SendReadersNotice, None]):
    """Counts the readers that lack required fields, which reads each reader and its samples, and tells the main
    agent, without blocking it."""

    command = SendReadersNotice

    def __init__(self, reader_rows: ReaderRows, judge: ReaderJudge, queries: Queries, nudger: Nudger) -> None:
        self.reader_rows, self.judge, self.queries, self.nudger = reader_rows, judge, queries, nudger

    def handle(self, command: SendReadersNotice, context: Context) -> None:
        readers = self.reader_rows.all()
        samples = self.judge.reader_samples(readers)
        count = sum(self.has_missing_fields(reader, samples[reader.id]) for reader in readers)
        if count:
            for agent in MainAgentFinder.rows(self.queries):
                self.nudger.send(agent.id, READERS_MISSING_FIELDS, SOURCE, context, count=count)

    def has_missing_fields(self, reader: Reader, samples: Sequence[ProcessPart]) -> bool:
        categories = {CommandCategory.CHECK, *(part.category for part in samples)}
        return any(self.judge.fields_missing(reader, category) for category in categories)
