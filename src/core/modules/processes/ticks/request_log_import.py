from itertools import groupby

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from core.modules.processes.commands.record_request_runs.record_request_runs import RecordRequestRuns
from core.modules.processes.support.request_log import RequestLog
from core.modules.processes.support.request_log_entry import RequestLogEntry


class RequestLogImport:
    """Writes the request rows the moved request log holds, one transaction for each environment, keeping in the
    moved log only the environments still to write, so a failed write repeats no row; then moves the log aside for
    the next tick."""

    def __call__(self, container: Container) -> None:
        log = container.get(RequestLog)
        groups = [tuple(logged) for _, logged in groupby(sorted(log.taken(), key=self.environment_id), key=self.environment_id)]
        for index, group in enumerate(groups):
            container.get(Bus).run(RecordRequestRuns(group), Actor.core(), environment_id=group[0].environment_id)
            log.left(tuple(entry for later in groups[index + 1:] for entry in later))
        log.written()

    @staticmethod
    def environment_id(entry: RequestLogEntry) -> int:
        return entry.environment_id
