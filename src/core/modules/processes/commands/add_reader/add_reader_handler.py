import re
from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.processes.commands.add_reader.add_reader import AddReader
from core.modules.processes.models.enums.reader_type import ReaderType
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.queries.conditions.reader_sample_scope import ReaderSampleScope
from core.modules.processes.support.reader_judge import ReaderJudge
from core.modules.processes.support.reader_judgement import ReaderJudgement
from core.modules.processes.support.reader_writers import ReaderWriters
from core.modules.processes.support.reader_save_refusal import ReaderSaveRefusal


class AddReaderHandler(Handler[AddReader, Reader]):
    """Saves a new reader, or the reader of that name with the fields the command gives."""

    command = AddReader

    def __init__(self, readers: ReaderQuery, repository: Repository, judge: ReaderJudge, writers: ReaderWriters) -> None:
        self.readers, self.repository, self.judge, self.writers = readers, repository, judge, writers

    def handle(self, command: AddReader, context: Context) -> Reader:
        existing = self.readers.with_name(command.name).first()
        if existing is not None:
            return self.checked_save(self.changed(existing, command), command, context)
        reader_type = ReaderType.SCRIPT if command.script else ReaderType.PATTERN
        return self.checked_save(Reader(creator_id=context.actor.id, name=command.name, type=reader_type, commands=command.commands, lines_pattern=command.lines,
                                           script=command.script, progress_pattern=command.progress, finished_pattern=command.finished, failed_pattern=command.failed,
                                           summary_pattern=command.summary, topic_pattern=command.topic, title=command.title, subject=command.subject, step_pattern=command.step,
                                           count_pattern=command.count, count_command=command.count_command), command, context)

    def checked_save(self, reader: Reader, command: AddReader, context: Context) -> Reader:
        request = self.writers.check_save(context.actor, reader)
        try:
            self.check_patterns(command)
            if not reader.commands or not (reader.lines_pattern or reader.script):
                raise Refusal(f"reader {reader.name} needs --commands and --lines or --script", "journal reader add <name> --commands <pattern> --lines <pattern>")
            if request is not None:
                scope = ReaderSampleScope(request.creator_id, request.command)
                judgement = self.judge.judged_command(reader, request.category, scope)
                if not judgement.is_valid:
                    raise Refusal(f"reader {reader.name} missed {'; '.join((*judgement.missing, *judgement.missed))}", "try the patterns on the named output")
                return self.save(reader, judgement, context)
            return self.save(reader, self.judge.tested(reader), context)
        except Refusal as refusal:
            if request is None:
                raise
            raise ReaderSaveRefusal.failed_save(request.id, refusal) from refusal

    def save(self, reader: Reader, judgement: ReaderJudgement, context: Context) -> Reader:
        if judgement.missed:
            raise Refusal(f"reader {reader.name} missed {'; '.join(judgement.missed)}", "try the patterns on the named output")
        return self.repository.save(replace(reader, proved_on=judgement.output_id), context)

    @staticmethod
    def check_patterns(command: AddReader) -> None:
        for flag, pattern in (("lines", command.lines), ("progress", command.progress), ("finished", command.finished), ("failed", command.failed), ("summary", command.summary), ("topic", command.topic), ("step", command.step), ("count", command.count)):
            try:
                re.compile(pattern)
            except re.error as error:
                raise Refusal(f"reader {command.name} has a --{flag} pattern that does not compile: {error}", "write it as a Python regular expression") from error

    def changed(self, reader: Reader, command: AddReader) -> Reader:
        given = {"commands": command.commands, "lines_pattern": command.lines, "script": command.script, "progress_pattern": command.progress,
                 "finished_pattern": command.finished, "failed_pattern": command.failed, "summary_pattern": command.summary, "topic_pattern": command.topic,
                 "title": command.title, "subject": command.subject, "step_pattern": command.step,
                 "count_pattern": command.count, "count_command": command.count_command}
        changed = replace(reader, **{field: value for field, value in given.items() if value})
        if command.script:
            return replace(changed, type=ReaderType.SCRIPT)
        return replace(changed, type=ReaderType.PATTERN) if command.lines else changed
