from dataclasses import dataclass

from engine.row.page import Page
from core.modules.processes.models.process_queue_row import ProcessQueueRow
from core.modules.processes.support.process_queue_json import ProcessQueueJson
from core.modules.processes.support.queue_inspector_json import QueueInspectorJson


@dataclass(frozen=True)
class ProcessQueuePage:
    """One environment's active queue runs and the setting that limits their parallel runs."""

    page: Page[ProcessQueueRow]
    inspector: QueueInspectorJson

    def json(self) -> ProcessQueueJson:
        return {**self.inspector, "page": self.page.number, "size": self.page.size, "total": self.page.total,
                "rows": [row.inspector_json() for row in self.page.rows]}
