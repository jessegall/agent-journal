import re
from dataclasses import replace
from itertools import islice
from collections.abc import Sequence

from core.base.driver.command_category import CommandCategory
from core.modules.processes.models.reader import Reader
from core.modules.processes.models.output import Output
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.support.colour_codes import ColourCodes
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.reader_judgement import ReaderJudgement
from core.modules.processes.support.reader_run import ReaderRun
from core.modules.processes.support.reader_selection import ReaderSelection

WIDTH_LINE_COUNT = 50
WIDE_SHARE = 10
COUNTED = re.compile(r"\[ *[0-9]+%\]|\b[0-9]+/[0-9]+\b")
TEST_ABSENCE_PATTERN = re.compile(r"^(?:=+ )?no tests ran\b", re.MULTILINE)
CRASHED_START_PATTERN = re.compile(r"^Traceback \(most recent call last\)|^\w*Error: |^error: could not find .*Cargo\.toml|: command not found$|^\S+ command not found$", re.MULTILINE)
CRASHING_CATEGORIES = (CommandCategory.TEST_RUN, CommandCategory.BUILD)
FEW_LINES = 5
SAMPLE_OUTPUTS = 5
SAMPLE_PARTS = 50


class ReaderJudge:
    """Judges a reader's required fields and what it finds on kept output."""

    def __init__(self, run: ReaderRun, folder: OutputFolder, parts: ProcessPartQuery) -> None:
        self.run, self.folder, self.parts = run, folder, parts

    def judged(self, reader: Reader, category: CommandCategory) -> ReaderJudgement:
        samples = tuple(part for part in self.samples(reader) if part.category is category)
        missing = self.fields_missing(reader, category)
        if category is CommandCategory.TEST_RUN and any(self.has_argument(reader.title, part.text) for part in samples):
            missing = (*missing, "--title must name the tests without command arguments, such as Go tests")
        return replace(self.tested_samples(reader, samples), missing=missing)

    @staticmethod
    def has_argument(title: str, command: str) -> bool:
        title_terms = set(re.findall(r"[\w.-]+", title.lower()))
        arguments = re.findall(r"[\w./-]+", command.lower())[1:]
        if command.startswith("npx ") and arguments and arguments[0] in title_terms:
            arguments = arguments[1:]
        return any(argument in title_terms for argument in arguments if argument not in {"test", "tests", "run", "go"} and not argument.startswith("-"))

    def tested(self, reader: Reader) -> ReaderJudgement:
        return self.tested_samples(reader, self.samples(reader))

    def tested_samples(self, reader: Reader, parts: Sequence[ProcessPart]) -> ReaderJudgement:
        samples = tuple(islice(parts, SAMPLE_OUTPUTS))
        missed = tuple(f"on output {part.process_id}: {', '.join(misses)}" for part in samples
                       if (misses := self.misses(reader, part.category, self.output_text(part.process_id, part.position))))
        output_id = samples[0].process_id if samples and not missed else None
        return ReaderJudgement(missed=missed, output_id=output_id)

    @staticmethod
    def fields_missing(reader: Reader, category: CommandCategory) -> tuple[str, ...]:
        wanted = [("--title", bool(reader.title)), ("--lines or --script", bool(reader.lines_pattern or reader.script)),
                  ("--summary", bool(reader.summary_pattern))]
        if category is CommandCategory.TEST_RUN:
            wanted.extend([("--count", bool(reader.count_pattern)),
                           ("--progress or --step with --count", bool(reader.progress_pattern) or reader.has_counted_steps()),
                           ("--title must name the tests, such as Go tests, without paths, flags or command arguments", ReaderJudge.test_title(reader))])
        return tuple(flag for flag, value in wanted if not value)

    @staticmethod
    def test_title(reader: Reader) -> bool:
        if re.search(r"(?:^|\s)-\S|[/\\]", reader.title):
            return False
        title = reader.title.strip().lower()
        return title.endswith("tests") and not title.startswith(("running ", "ran "))

    def misses(self, reader: Reader, category: CommandCategory, text: str) -> tuple[str, ...]:
        return self.misses_with_lines(reader, category, text, self.run.lines(reader, text, "finished"))

    def misses_read_output(self, reader: Reader, category: CommandCategory, output: Output) -> tuple[str, ...]:
        return self.misses_with_lines(reader, category, self.output_text(output.process_id, output.reader_position), self.folder.reader_lines(output.process_id))

    def misses_with_lines(self, reader: Reader, category: CommandCategory, text: str, lines: Sequence[str]) -> tuple[str, ...]:
        if not text.strip():
            return ()
        count = self.run.count(reader, text, 0)
        if category is CommandCategory.TEST_RUN and count == 0 and TEST_ABSENCE_PATTERN.search(text):
            return ()
        if category in CRASHING_CATEGORIES and count == 0 and CRASHED_START_PATTERN.search(text):
            return ()
        total = len(text.splitlines())
        summary = self.run.summary(reader, text)
        checks = {"--lines picked none": bool(lines) or total < FEW_LINES,
                  "--lines picked nearly all": total < WIDTH_LINE_COUNT or len(lines) * WIDE_SHARE < total * (WIDE_SHARE - 1)}
        if reader.summary_pattern:
            checks["--summary found nothing"] = bool(summary)
        if reader.count_pattern and not reader.count_command:
            checks["--count found nothing"] = count > 0
        numbers = re.findall(r"\d+", summary)
        if count > 0 and numbers:
            checks["--summary exceeds --count"] = int(numbers[0]) <= count
        step_progress = reader.step_pattern and count > 0
        if category is not CommandCategory.CHECK and COUNTED.search(text) and not step_progress:
            checks["--progress found nothing"] = self.run.progress(reader, text, -1) >= 0
        return tuple(miss for miss, valid in checks.items() if not valid)

    def samples(self, reader: Reader) -> tuple[ProcessPart, ...]:
        patterns = tuple(pattern.strip() for pattern in reader.commands.split(","))
        parts = self.parts.kept_samples(patterns, reader.environment_id).page(1, SAMPLE_PARTS).rows
        return tuple(part for part in parts if ReaderSelection.reads(reader, part))

    def output_text(self, process_id: int, position: int) -> str:
        return ColourCodes.removed(self.folder.output(process_id, position) if position else self.folder.all_output(process_id))
