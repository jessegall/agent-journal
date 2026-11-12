import re
from dataclasses import replace

from engine.errors.refusal import Refusal
from core.modules.processes.models.enums.reader_type import ReaderType
from core.modules.processes.models.reader import Reader
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.support.stock_reader import STOCK_READERS
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.support.reader_candidates import CANDIDATES, BUILD_CANDIDATES
from core.modules.processes.support.reader_draft import ReaderDraft
from core.modules.processes.support.reader_judge import COUNTED, ReaderJudge
from core.modules.processes.support.reader_rows import ReaderRows
from core.modules.processes.support.reader_run import ReaderRun
from core.modules.processes.support.reader_selection import ReaderSelection
from engine.enums.command_category import CommandCategory

NEAREST_LINES = 8


class ReaderDrafting:
    """Tries the saved readers of the command in the order of their layers, then the shipped readers as they are
    stored, those of the command first, then candidate patterns, against a reader request's sample."""

    def __init__(self, readers: ReaderRows, parts: ProcessPartQuery, judge: ReaderJudge, run: ReaderRun) -> None:
        self.readers, self.parts, self.judge, self.run = readers, parts, judge, run

    def draft(self, request: ReaderRequest) -> ReaderDraft:
        if request.sample_process_id is None:
            raise Refusal(f"reader request {request.id} has no sample", "wait for the sample run to print output")
        parts = self.parts.filter(process_id=request.sample_process_id).all_rows()
        part = next((part for part in parts if part.reader_request_id == request.id or part.command == request.command or part.text == request.command), None)
        text = self.judge.output_text(request.sample_process_id, part.position if part else 0)
        stock_readers = tuple(Reader(creator_id=request.creator_id, name=stock.name, type=ReaderType.PATTERN,
                         commands=stock.commands, title=stock.title, lines_pattern=stock.lines, progress_pattern=stock.progress,
                         finished_pattern=stock.finished, failed_pattern=stock.failed, summary_pattern=stock.summary,
                         count_pattern=stock.count, count_command=stock.count_command, step_pattern=stock.step) for stock in STOCK_READERS)
        stored = self.readers.all()
        matching = self.readers.layers().ordered(reader for reader in stored if ReaderSelection.matches(reader.commands, request.command))
        stored_by_name = {reader.name: reader for reader in stored}
        shipped = sorted((stored_by_name.get(reader.name, reader) for reader in stock_readers), key=lambda reader: not ReaderSelection.matches(reader.commands, request.command))
        readers = (*matching, *shipped)
        for reader in readers:
            if not self.judge.fields_missing(reader, request.category) and not self.judge.misses(reader, request.category, text):
                commands = reader.commands.split(",")
                if request.command not in commands:
                    commands.append(request.command)
                return self.result(replace(reader, commands=",".join(commands)), request, text)
        candidates = CANDIDATES.get(request.category, BUILD_CANDIDATES)
        reader = Reader(creator_id=request.creator_id, name=f"{request.command_key}-reader", type=ReaderType.PATTERN,
                        commands=request.command, title=candidates.title)
        for field, patterns in (("lines_pattern", candidates.lines), ("progress_pattern", candidates.progress),
                                ("summary_pattern", candidates.summary), ("count_pattern", candidates.count)):
            for pattern in patterns:
                candidate = reader.changed(**{field: pattern})
                misses = self.judge.misses(candidate, request.category, text)
                flag = "--" + field.removesuffix("_pattern")
                if re.search(pattern, text, re.MULTILINE) and not any(miss.startswith(flag) for miss in misses):
                    reader = candidate
                    break
        return self.result(reader, request, text)

    def result(self, reader: Reader, request: ReaderRequest, text: str) -> ReaderDraft:
        missing = list(self.judge.fields_missing(reader, request.category))
        if self.needs_build_progress(reader, request, text):
            missing.append("--progress")
        missing.extend(self.judge.misses(reader, request.category, text))
        lines = self.run.lines(reader, text, "finished")
        if not lines and "--lines picked none" not in missing:
            missing.append("--lines picked none")
        matches = (f"sample output {request.sample_process_id}", *lines,
                 f"summary: {self.run.summary(reader, text)}", f"count: {self.run.count(reader, text, 0)}",
                 f"progress: {self.run.progress(reader, text, -1)}")
        if missing:
            matches += tuple(f"could not fill {field}" for field in missing) + tuple(text.splitlines()[:NEAREST_LINES])
        return ReaderDraft(reader.name, reader.commands, reader.title, reader.lines_pattern, reader.progress_pattern,
                           reader.summary_pattern, reader.count_pattern, reader.count_command, matches, tuple(missing),
                           reader.script, reader.step_pattern, reader.finished_pattern, reader.failed_pattern, reader.topic_pattern, reader.subject)

    @staticmethod
    def needs_build_progress(reader: Reader, request: ReaderRequest, text: str) -> bool:
        has_progress = bool(reader.progress_pattern or reader.has_counted_steps())
        return request.category is CommandCategory.BUILD and bool(COUNTED.search(text)) and not has_progress
