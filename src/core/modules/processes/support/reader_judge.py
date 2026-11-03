import re
from itertools import islice

from core.base.driver.command_category import CommandCategory
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.support.colour_codes import ColourCodes
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.reader_judgement import ReaderJudgement
from core.modules.processes.support.reader_run import ReaderRun
from core.modules.processes.support.reader_selection import ReaderSelection

WIDTH_LINE_COUNT = 50
WIDE_SHARE = 10
COUNTED = re.compile(r"\[ *[0-9]+%\]|\b[0-9]+/[0-9]+\b")
FEW_LINES = 5
SAMPLE_OUTPUTS = 5


class ReaderJudge:
    """Judges a reader's required fields and what it finds on kept output."""

    def __init__(self, run: ReaderRun, folder: OutputFolder, parts: ProcessPartQuery) -> None:
        self.run, self.folder, self.parts = run, folder, parts

    def judged(self, reader: Reader, category: CommandCategory) -> ReaderJudgement:
        return ReaderJudgement(self.fields_missing(reader, category), tuple(miss for text in self.samples(reader, category) for miss in self.misses(reader, category, text)))

    def fields_missing(self, reader: Reader, category: CommandCategory) -> tuple[str, ...]:
        wanted = {"--title": reader.title, "--lines or --script": reader.lines_pattern or reader.script, "--summary": reader.summary_pattern}
        if category is CommandCategory.TEST_RUN:
            wanted["--progress"] = reader.progress_pattern
        return tuple(flag for flag, value in wanted.items() if not value)

    def misses(self, reader: Reader, category: CommandCategory, text: str) -> tuple[str, ...]:
        lines = self.run.lines(reader, text, "finished")
        total = len(text.splitlines())
        checks = {"--lines picked none": bool(lines) or total < FEW_LINES,
                 "--lines picked nearly all": total < WIDTH_LINE_COUNT or len(lines) * WIDE_SHARE < total * (WIDE_SHARE - 1),
                 "--summary found nothing": bool(self.run.summary(reader, text))}
        if category is not CommandCategory.CHECK and COUNTED.search(text):
            checks["--progress found nothing"] = self.run.progress(reader, text, -1) >= 0
        return tuple(miss for miss, valid in checks.items() if not valid)

    def samples(self, reader: Reader, category: CommandCategory) -> tuple[str, ...]:
        parts = self.parts.with_kept_output().filter(category=category).newest().all_rows()
        matching = (part for part in parts if ReaderSelection.reads(reader, part))
        return tuple(self.output_text(part.process_id, part.position) for part in islice(matching, SAMPLE_OUTPUTS))

    def output_text(self, process_id: int, position: int) -> str:
        return ColourCodes.removed(self.folder.output(process_id, position) if position else self.folder.all_output(process_id))
