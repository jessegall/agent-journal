from journal.features.workers.worker_reports import WorkerReports
from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import V3Row, seconds
from journal.models.worker_state import WorkerState
from journal.repositories.environments import Environments
from journal.repositories.workers import Workers

STATES = {WorkerState.DISPATCHED: "running", WorkerState.REPORTED: "reported", WorkerState.STOPPED: "stopped"}


class WorkersShaper(Shaper):
    """A worker, shown to the viewer as a helper."""

    type = "helper"

    def __init__(self, workers: Workers, reports: WorkerReports, environments: Environments) -> None:
        self.workers, self.reports, self.environments = workers, reports, environments

    def rows(self) -> list[V3Row]:
        named = {e.id: e.name for e in self.environments.all()}
        return [V3Row.of("helper", w, title=w.name, brief=w.brief, state=STATES[w.state], completed=seconds(w.updated_at) if w.state == WorkerState.STOPPED else 0.0,
                         data={"name": w.name, "status": w.state.value, "provider": w.provider, "model": w.model, "worktree": w.worktree, "session": w.session,
                               "environment": named[w.environment_id], "report": self.reports.last(w)}) for w in self.workers.in_()]
