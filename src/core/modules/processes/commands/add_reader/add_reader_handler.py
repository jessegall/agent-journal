import re
from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.processes.commands.add_reader.add_reader import AddReader
from core.modules.processes.models.enums.reader_type import ReaderType
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_query import ReaderQuery


class AddReaderHandler(Handler[AddReader, Reader]):
    """Saves a new reader, or the reader of that name with the fields the command gives."""

    command = AddReader

    def __init__(self, readers: ReaderQuery, repository: Repository) -> None:
        self.readers, self.repository = readers, repository

    def handle(self, command: AddReader, context: Context) -> Reader:
        self.check_patterns(command)
        existing = self.readers.with_name(command.name).page(1, 1).rows
        if existing:
            return self.repository.save(self.changed(existing[0], command), context)
        if not command.commands or not (command.lines or command.script):
            raise Refusal(f"reader {command.name} needs --commands and --lines or --script", "journal reader add <name> --commands <pattern> --lines <pattern>")
        reader_type = ReaderType.SCRIPT if command.script else ReaderType.PATTERN
        return self.repository.save(Reader(creator_id=context.actor.id, name=command.name, type=reader_type, commands=command.commands, lines_pattern=command.lines,
                                           script=command.script, progress_pattern=command.progress, finished_pattern=command.finished, failed_pattern=command.failed,
                                           summary_pattern=command.summary, topic_pattern=command.topic, title=command.title, subject=command.subject, step_pattern=command.step), context)

    @staticmethod
    def check_patterns(command: AddReader) -> None:
        for flag, pattern in (("lines", command.lines), ("progress", command.progress), ("finished", command.finished), ("failed", command.failed), ("summary", command.summary), ("topic", command.topic), ("step", command.step)):
            try:
                re.compile(pattern)
            except re.error as error:
                raise Refusal(f"reader {command.name} has a --{flag} pattern that does not compile: {error}", "write it as a Python regular expression") from error

    def changed(self, reader: Reader, command: AddReader) -> Reader:
        given = {"commands": command.commands, "lines_pattern": command.lines, "script": command.script, "progress_pattern": command.progress,
                 "finished_pattern": command.finished, "failed_pattern": command.failed, "summary_pattern": command.summary, "topic_pattern": command.topic,
                 "title": command.title, "subject": command.subject, "step_pattern": command.step}
        changed = replace(reader, **{field: value for field, value in given.items() if value})
        if command.script:
            return replace(changed, type=ReaderType.SCRIPT)
        return replace(changed, type=ReaderType.PATTERN) if command.lines else changed
