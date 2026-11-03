from typing import TypedDict
from core.modules.processes.support.process_queue_run_json import ProcessQueueRunJson


class ProcessQueueJson(TypedDict):
    """The queue page and the setting that controls its parallel runs."""

    page: int
    size: int
    total: int
    environment_id: int
    parallel_limit: int
    limit_setting: str
    rows: list[ProcessQueueRunJson]
