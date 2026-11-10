from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.view_model import ViewModel
from core.base.driver.command_category import CommandCategory
from engine.time.timestamp import Timestamp
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.enums.queue_section import QueueSection
from core.modules.processes.models.support.views import PROCESS_QUEUE_ROWS_SELECT


@dataclass(frozen=True, kw_only=True)
class ProcessQueueRow(EnvironmentScoped, ViewModel):
    """A command with its queue position, ownership and times for the queue inspector."""

    cli_name = "process"
    view = "process_queue_rows"
    key = "id"
    select = PROCESS_QUEUE_ROWS_SELECT
    shared_rows = True

    id: int
    environment_id: int
    session_agent_id: int
    line: str
    category: CommandCategory
    state: ProcessState
    exit_code: int | None
    created_at: Timestamp
    started_at: Timestamp | None
    ended_at: Timestamp | None
    queued_at: Timestamp | None
    is_queue_run: bool
    slot_assigned: bool
    plugin: str
    is_main: bool
    owner_agent_id: int | None
    task_id: int | None
    section: QueueSection

    @property
    def queue_label(self) -> str:
        return f"plugin {self.plugin}" if self.plugin else self.category.value

    def inspector_json(self, count_main_runs: bool) -> dict[str, object]:
        return {**self.json(), "output_id": self.id, "uses_slot": self.section is QueueSection.RUNNING and
                (self.slot_assigned or (self.is_main and count_main_runs))}
