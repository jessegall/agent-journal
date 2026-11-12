import sqlite3
from itertools import groupby

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.log.error_log import ErrorLog
from core.modules.processes.commands.record_request_runs.record_request_runs import RecordRequestRuns
from core.modules.processes.support.request_log import RequestLog
from core.modules.processes.support.request_log_entry import RequestLogEntry

BUSY_CODES = (sqlite3.SQLITE_BUSY, sqlite3.SQLITE_LOCKED)


class RequestLogImport:
    """Writes the request rows the moved request log holds, one transaction for each environment, keeping in the
    moved log only the environments still to write, so no row is written twice; an environment whose write finds
    the database busy keeps its rows for the next tick, and one whose write fails otherwise is written entry by
    entry, so only an entry that fails itself is reported as an error and let go. Then it moves the log aside for
    the next tick."""

    def __call__(self, container: Container) -> None:
        log = container.get(RequestLog)
        groups = [tuple(logged) for _, logged in groupby(sorted(log.taken(), key=self.environment_id), key=self.environment_id)]
        kept: list[RequestLogEntry] = []
        for index, group in enumerate(groups):
            kept.extend(self.written_group(container, group))
            log.left(tuple(entry for later in groups[index + 1:] for entry in later))
        log.written(tuple(kept))

    @classmethod
    def written_group(cls, container: Container, group: tuple[RequestLogEntry, ...]) -> tuple[RequestLogEntry, ...]:
        try:
            container.get(Bus).run(RecordRequestRuns(group), Actor.core(), environment_id=group[0].environment_id)
        except sqlite3.OperationalError as failure:
            if failure.sqlite_errorcode not in BUSY_CODES:
                return cls.written_alone(container, group, failure)
            return group
        except Exception as failure:
            return cls.written_alone(container, group, failure)
        return ()

    @classmethod
    def written_alone(cls, container: Container, group: tuple[RequestLogEntry, ...], failure: Exception) -> tuple[RequestLogEntry, ...]:
        if len(group) > 1:
            return tuple(kept for entry in group for kept in cls.written_group(container, (entry,)))
        container.get(ErrorLog).recorded(["request-log", f"environment {group[0].environment_id}"], failure, None)
        return ()

    @staticmethod
    def environment_id(entry: RequestLogEntry) -> int:
        return entry.environment_id
