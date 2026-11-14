from engine.database.database_busy import DatabaseBusy
import sqlite3
from dataclasses import replace
from itertools import groupby

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.log.error_log import ErrorLog
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.processes.commands.record_request_runs.record_request_runs import RecordRequestRuns
from core.modules.processes.support.request_log import RequestLog
from core.modules.processes.support.request_log_entry import RequestLogEntry



class RequestLogImport:
    """Writes the request rows the moved request log holds, one transaction for each environment,
    keeping in the moved log only the environments still to write, so no row is written twice; an
    environment whose write finds the database busy keeps its rows for the next tick, and one whose
    write fails otherwise is written entry by entry, so only an entry that fails itself is reported
    as an error and let go. Then it moves the log aside for the next tick."""

    def __call__(self, container: Container) -> None:
        log = container.get(RequestLog)
        entries = self.placed(log.claimed(), container.get(AgentRows))
        groups = [tuple(logged) for _, logged in groupby(sorted(entries, key=self.environment_id), key=self.environment_id)]
        kept: list[RequestLogEntry] = []
        for index, group in enumerate(groups):
            kept.extend(self.group_record(container, group))
            log.replace_claimed(tuple(entry for later in groups[index + 1:] for entry in later))
        log.saved(tuple(kept))

    @staticmethod
    def placed(entries: tuple[RequestLogEntry, ...], agents: AgentRows) -> tuple[RequestLogEntry, ...]:
        placed = []
        for entry in entries:
            if entry.environment_id is not None:
                placed.append(entry)
                continue
            agent = agents.session(entry.session)
            if agent is not None:
                placed.append(replace(entry, environment_id=agent.environment_id, agent_id=agent.id))
        return tuple(placed)

    @classmethod
    def group_record(cls, container: Container, group: tuple[RequestLogEntry, ...]) -> tuple[RequestLogEntry, ...]:
        try:
            container.get(Bus).run(RecordRequestRuns(group), Actor.core(), environment_id=group[0].environment_id)
        except sqlite3.OperationalError as failure:
            if not DatabaseBusy.is_busy(failure):
                return cls.single_record(container, group, failure)
            return group
        except Exception as failure:
            return cls.single_record(container, group, failure)
        return ()

    @classmethod
    def single_record(cls, container: Container, group: tuple[RequestLogEntry, ...], failure: Exception) -> tuple[RequestLogEntry, ...]:
        if len(group) > 1:
            return tuple(kept for entry in group for kept in cls.group_record(container, tuple([entry])))
        container.get(ErrorLog).recorded(["request-log", f"environment {group[0].environment_id}"], failure, None)
        return ()

    @staticmethod
    def environment_id(entry: RequestLogEntry) -> int:
        return entry.environment_id or 0
