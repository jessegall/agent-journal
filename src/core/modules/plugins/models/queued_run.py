from dataclasses import dataclass

from engine.enums.event_form import EventForm
from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from core.modules.plugins.models.enums.queued_run_state import QueuedRunState

ENDED = "ended"


@dataclass(frozen=True, kw_only=True)
class QueuedRun(EnvironmentScoped, Model):
    """A run a plugin queued with journal plugin queue: its plugin and kind, the agent it runs for, the process
    that runs it and how it stands. Its end is the event queued_run.ended, with its exit code, how long it ran
    and whether its timeout stopped it."""

    model_name = "queued_run"
    cli_name = "queued-run"
    event_forms = tuple([EventForm.COMMIT])
    change_names = tuple([ENDED])

    environment_id: int = 0
    creator_id: int
    plugin: str
    kind: str
    session_agent_id: int
    process_id: int
    state: QueuedRunState = QueuedRunState.WAITING
    exit_code: int | None = None
    duration_ms: int = 0
    timed_out: bool = False

    def line(self) -> str:
        if not self.state.is_over:
            return f"run {self.id} of {self.plugin} {self.kind} is {self.state.value}: output {self.process_id}"
        return f"run {self.id} of {self.plugin} {self.kind} {self.state.value} with exit code {self.exit_code} after {self.duration_ms} ms: output {self.process_id}"

    def change_name(self, old_row: Model | None) -> str | None:
        if isinstance(old_row, QueuedRun) and not old_row.state.is_over and self.state.is_over:
            return ENDED
        return None
