from engine.change.event_log import EventLog
from engine.model.tables import Tables
from engine.provider.providers import Providers
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.helpers.support.exit_reasons import ExitReasons

LAUNCH_FAILURE_SECONDS = 10
MISSING_ERROR_TEXT = "its program gave no error text"
STARTED_FIELD = "process_started_at"


class WorkerLaunchFailures:
    """Tells a program that ended within seconds of its start from a worker that stopped, and reads the error
    its program wrote. The start of the run is the newest process start the row was given, since the row loses
    it when a tick ends a worker whose process is gone."""

    def __init__(self, reasons: ExitReasons, providers: Providers, log: EventLog, tables: Tables) -> None:
        self.reasons, self.providers, self.log, self.tables = reasons, providers, log, tables

    def has_failed(self, worker: Agent) -> bool:
        started_at = self.run_started_at(worker)
        return started_at is not None and worker.ended_at is not None and started_at.elapsed_seconds(worker.ended_at) < LAUNCH_FAILURE_SECONDS

    def run_started_at(self, worker: Agent) -> Timestamp | None:
        if worker.process_started_at is not None:
            return worker.process_started_at
        events = self.log.row_events(self.tables.table(Agent).name, worker.id)
        starts = [event.data[STARTED_FIELD][1] for event in events if event.data.get(STARTED_FIELD, (None, None))[1]]
        return Timestamp.parsed(str(starts[-1])) if starts else None

    def error_text(self, worker: Agent) -> str:
        terminal = self.reasons.terminal_tail(worker)
        outcome = self.providers.provider(worker.program).helper_outcome(terminal, "")
        last_line = next((line.strip() for line in reversed(terminal.splitlines()) if line.strip()), "")
        return outcome.error or last_line or MISSING_ERROR_TEXT
