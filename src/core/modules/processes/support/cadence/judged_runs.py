from collections import defaultdict
from collections.abc import Sequence
from pathlib import Path

from engine.query.conditions.among import Among
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.queries.process_query import ProcessQuery

PYTHON_PROGRAM = "python"


class JudgedRuns:
    """The runs whose cadence is judged: started by the agent itself, running or in the background, out of the
    queue, from no plugin, and running a command that is no search, read, edit or journal command, or a python
    program. The runs and all their parts are read in two reads."""

    def __init__(self, processes: ProcessQuery, parts: ProcessPartQuery) -> None:
        self.processes, self.parts = processes, parts

    def running(self) -> tuple[tuple[Process, tuple[ProcessPart, ...]], ...]:
        processes = tuple(self.processes.running().all_rows())
        if not processes:
            return ()
        parts: dict[int, list[ProcessPart]] = defaultdict(list)
        for part in self.parts.matching(Among("process_id", [process.id for process in processes])).all_rows():
            parts[part.process_id].append(part)
        return tuple((process, tuple(parts[process.id])) for process in processes if self.is_judged(process, parts[process.id]))

    @staticmethod
    def is_judged(process: Process, parts: Sequence[ProcessPart]) -> bool:
        started = process.started_at is not None and process.queued_at is None
        own = process.creator_id == process.session_agent_id and not process.plugin
        return started and own and any(not part.category.is_short or Path(part.program).name.startswith(PYTHON_PROGRAM) for part in parts)
