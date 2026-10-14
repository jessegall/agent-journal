from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import V3Row, seconds
from journal.models.environment import Environment
from journal.models.worker_state import WorkerState
from journal.repositories.workers import Workers


class WorkersShaper(Shaper):
    """A worker is what version 3 called a helper."""

    type = "helper"

    def __init__(self, workers: Workers) -> None:
        self.workers = workers

    def rows(self, environment: Environment) -> list[V3Row]:
        return [V3Row.of("helper", w, title=w.name, brief=w.brief, completed=seconds(w.updated_at) if w.state != WorkerState.DISPATCHED else 0.0,
                         data={"status": w.state.value, "provider": w.provider, "model": w.model, "worktree": w.worktree, "session": w.session}) for w in self.workers.in_(environment.id)]
