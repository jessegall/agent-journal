from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import V3Row, seconds
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.environments import Environments
from journal.repositories.messages import Messages
from journal.repositories.workers import Workers

STATES = {WorkerState.DISPATCHED: "running", WorkerState.REPORTED: "reported", WorkerState.STOPPED: "stopped"}
RECENT = 200


class WorkersShaper(Shaper):
    """A worker is what version 3 called a helper."""

    type = "helper"

    def __init__(self, workers: Workers, messages: Messages, environments: Environments) -> None:
        self.workers, self.messages, self.environments = workers, messages, environments

    def rows(self) -> list[V3Row]:
        said = self.messages.recent(RECENT)
        return [V3Row.of("helper", w, title=w.name, brief=w.brief, state=STATES[w.state], completed=seconds(w.updated_at) if w.state == WorkerState.STOPPED else 0.0,
                         data={"name": w.name, "status": w.state.value, "provider": w.provider, "model": w.model, "worktree": w.worktree, "session": w.session,
                               "environment": self.environments.find(w.environment_id).name, "report": self.report(w, said)}) for w in self.workers.in_()]

    @staticmethod
    def report(worker: Worker, said: list) -> str:
        """What the worker reported last, as filed in the chat; none while it works on a next job."""
        if worker.state == WorkerState.DISPATCHED:
            return ""
        lead = f"{worker.name} reports: "
        return next((m.text[len(lead):] for m in reversed(said) if m.text.startswith(lead)), "")
