from collections.abc import Sequence

from engine.errors.refusal import Refusal
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.support.silent_start_runs import SilentStartRuns


class RunCommandWords:
    """The leading words a mark of a run's command is kept by: the command of its first watched part, else of its
    first part a reader reads; the card and the user's buttons both take them from here."""

    def __init__(self, parts: ProcessPartQuery) -> None:
        self.parts = parts

    def words(self, process: Process) -> str:
        terms = RunCommandWords.part_words(self.parts.run_parts(process.id))
        if not terms:
            raise Refusal(f"output {process.id} runs no command a reader reads", "only a command that prints output is marked")
        return terms

    @staticmethod
    def part_words(parts: Sequence[ProcessPart]) -> str:
        part = next((part for part in parts if part.category.is_watched), None) or next((part for part in parts if part.category.has_reader), None)
        return SilentStartRuns.name(part.text, part.program, part.category) if part is not None else ""
