from core.modules.processes.support.queue_inspector_json import QueueInspectorJson


class ProcessQueueJson(QueueInspectorJson):
    """The queue page and the setting that controls its parallel runs."""

    page: int
    size: int
    total: int
    rows: list[dict[str, object]]
    lanes: list[str]
    execution: dict[str, object]
