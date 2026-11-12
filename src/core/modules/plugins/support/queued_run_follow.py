from engine.query.conditions.among import Among
from engine.query.conditions.has_value import HasValue
from engine.query.queries import Queries
from engine.subcommand.output import Output
from engine.time.clock import Clock
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import END_POLL_SECONDS, OutputFolder

QUEUED_RUNS_REASON = "every queued run that is still waiting is followed"
STOPPED_EXIT_CODE = 143


class QueuedRunFollow:
    """Keeps the caller of a queued run until it ends: while it waits it says how many runs are ahead of it each
    time that number changes, then prints the run's lines as they come, and answers its exit code."""

    def __init__(self, folder: OutputFolder, queries: Queries, clock: Clock) -> None:
        self.folder, self.queries, self.clock = folder, queries, clock

    def exit_code(self, process_id: int, output: Output) -> int:
        said, offset = -1, 0
        while True:
            process = self.queries.query(Process).find(process_id)
            if process.queued_at is not None and (ahead := self.ahead(process)) != said:
                output.line(f"waiting: {ahead} ahead of you")
                said = ahead
            has_ended = process.ended_at is not None
            page = self.folder.page_after(process_id, offset, has_ended)
            for line in page.lines:
                output.line(line)
            offset = page.last_byte
            if has_ended and offset >= page.total:
                return process.exit_code if process.exit_code is not None else STOPPED_EXIT_CODE
            self.clock.sleep(END_POLL_SECONDS)

    def ahead(self, process: Process) -> int:
        waiting = self.queries.query(Process).matching(Among("state", RUNNING_STATES)).matching(HasValue("queued_at")).every_row(QUEUED_RUNS_REASON)
        return sum((other.priority.rank, other.id) < (process.priority.rank, process.id) for other in waiting)
