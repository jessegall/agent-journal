from collections import defaultdict
from dataclasses import replace

from engine.command.context import Context
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.processes.models.output import Output
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader import Reader
from core.modules.processes.support.reader_selection import ReaderSelection


class RunningOutputReaders:
    """Puts a reader an agent or a person just saved on each running output that has no reader and whose command
    it reads, so a run that is still going shows its progress at once. The outputs and their parts are read in two
    reads; the run keeps its title."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def attach(self, reader: Reader, context: Context) -> None:
        outputs = tuple(self.queries.query(Output).filter(ended_at=None, reader_id=None).all_rows())
        if not outputs:
            return
        parts: dict[int, list[ProcessPart]] = defaultdict(list)
        for part in self.queries.query(ProcessPart).matching(Among("process_id", [output.process_id for output in outputs])).oldest().all_rows():
            parts[part.process_id].append(part)
        for output in outputs:
            read = next((part for part in parts[output.process_id] if ReaderSelection.reads_command(reader, part.command or part.text, part.category)), None)
            if read is not None:
                self.repository.save(replace(output, reader_id=reader.id, reader_position=read.position, read_offset=0, displayed_offset=0), context)
