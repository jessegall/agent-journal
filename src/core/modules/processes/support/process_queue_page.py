from collections.abc import Mapping
from dataclasses import dataclass

from core.base.page import Page
from core.modules.processes.models.process import Process
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.support.process_queue_json import ProcessQueueJson


@dataclass(frozen=True)
class ProcessQueuePage:
    """One environment's active queue runs and the setting that limits their parallel runs."""

    page: Page[Process]
    worker_ids: Mapping[int, int]
    environment_id: int
    parallel_limit: int

    def json(self) -> ProcessQueueJson:
        return {"page": self.page.number, "size": self.page.size, "total": self.page.total,
                "environment_id": self.environment_id, "parallel_limit": self.parallel_limit,
                "limit_setting": ProcessSetting.RUN_BATCH_SIZE.key,
                "rows": [{"id": process.id, "agent_id": process.agent_id,
                          "worker_id": self.worker_ids.get(process.id),
                          "category": process.category.value, "line": process.line, "state": process.state.value,
                          "is_queued": process.is_queued, "output_id": process.id}
                         for process in self.page.rows]}
