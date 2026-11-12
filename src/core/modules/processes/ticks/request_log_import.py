from itertools import groupby

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from core.modules.processes.commands.record_request_runs.record_request_runs import RecordRequestRuns
from core.modules.processes.support.request_log import RequestLog
from core.modules.processes.support.request_log_entry import RequestLogEntry


class RequestLogImport:
    """Writes the request rows the moved request log holds, one transaction for each environment, then moves the
    log aside for the next tick."""

    def __call__(self, container: Container) -> None:
        log = container.get(RequestLog)
        entries = sorted(log.taken(), key=self.environment_id)
        for environment_id, logged in groupby(entries, key=self.environment_id):
            container.get(Bus).run(RecordRequestRuns(tuple(logged)), Actor.core(), environment_id=environment_id)
        log.written()

    @staticmethod
    def environment_id(entry: RequestLogEntry) -> int:
        return entry.environment_id
