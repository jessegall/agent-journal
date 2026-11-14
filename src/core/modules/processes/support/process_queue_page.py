from dataclasses import dataclass

from engine.row.page import Page
from core.modules.processes.models.process_queue_row import ProcessQueueRow
from core.modules.processes.support.process_queue_json import ProcessQueueJson
from core.modules.processes.support.queue_inspector_json import QueueInspectorJson


@dataclass(frozen=True)
class ProcessQueuePage:
    """One environment's active queue runs, the setting that limits their parallel runs, and the lanes as a person
    reads them."""

    page: Page[ProcessQueueRow]
    inspector: QueueInspectorJson
    lanes: tuple[str, ...] = ()
    execution: dict[str, object] | None = None

    def json(self) -> ProcessQueueJson:
        return {**self.inspector, "page": self.page.number, "size": self.page.size, "total": self.page.total,
                "rows": [row.inspector_json() for row in self.page.rows], "lanes": list(self.lanes), "execution": self.execution or {"lanes": [], "waits": []}}
