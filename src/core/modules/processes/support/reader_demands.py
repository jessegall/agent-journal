import shlex

from core.modules.processes.commands.support.part_spec import PartSpec
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.queries.conditions.reader_sample_scope import ReaderSampleScope
from core.modules.processes.support.reader_judge import ReaderJudge

ASKING_FLAGS = frozenset(("--help", "-h", "--version", "-V", "--collect-only", "--list-tests", "--list"))


class ReaderDemands:
    """Decides whether one command needs a proper reader."""

    def __init__(self, judge: ReaderJudge, processes: ProcessQuery) -> None:
        self.judge, self.processes = judge, processes

    def needs_reader(self, part: PartSpec) -> bool:
        if not part.category.is_watched or ASKING_FLAGS.intersection(shlex.split(part.command or part.text)):
            return False
        return part.category.is_long_running or self.processes.has_moved_run([part.text])

    def reason(self, part: PartSpec, reader: Reader | None, scope: ReaderSampleScope) -> str:
        if reader is None:
            return f"no reader reads {part.command or part.text}"
        judgement = self.judge.judged_command(reader, part.category, scope)
        return "" if judgement.is_valid else f"reader {reader.name}: {judgement.text}"
