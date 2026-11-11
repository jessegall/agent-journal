from collections import defaultdict
from collections.abc import Sequence
from pathlib import Path

from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.queries.process_query import ProcessQuery

PYTHON_PROGRAM = "python"


class JudgedRuns:
    """The runs whose cadence is judged: started by the agent itself, running or in the background, out of the
    queue, from no plugin, of a session that has not ended, and running a command that is no search, read, edit or
    journal command, or a python program. The runs, their agents and all their parts are read in three reads."""

    def __init__(self, processes: ProcessQuery, parts: ProcessPartQuery, queries: Queries) -> None:
        self.processes, self.parts, self.queries = processes, parts, queries

    def running(self) -> tuple[tuple[Process, tuple[ProcessPart, ...]], ...]:
        processes = tuple(self.processes.running().all_rows())
        if not processes:
            return ()
        agents = self.queries.query(Agent).matching(Among("id", sorted({process.session_agent_id for process in processes}))).all_rows()
        ended = {agent.id for agent in agents if agent.ended_at is not None}
        processes = tuple(process for process in processes if process.session_agent_id not in ended)
        parts: dict[int, list[ProcessPart]] = defaultdict(list)
        for part in self.parts.matching(Among("process_id", [process.id for process in processes])).all_rows():
            parts[part.process_id].append(part)
        return tuple((process, tuple(parts[process.id])) for process in processes if self.is_judged(process, parts[process.id]))

    @staticmethod
    def is_judged(process: Process, parts: Sequence[ProcessPart]) -> bool:
        started = process.started_at is not None and process.queued_at is None
        own = process.creator_id == process.session_agent_id and not process.plugin
        return started and own and any(not part.category.is_short or Path(part.program).name.startswith(PYTHON_PROGRAM) for part in parts)
