from core.modules.messages.listeners.deleted_source_listener import DeletedSourceListener
from suites.coding.modules.workers.models.worker_task_source import WorkerTaskSource


class DeletedWorkerSourceListener(DeletedSourceListener):
    """Keeps deleted request references unavailable in assigned tasks and follow-ups."""

    name = "workers.deleted-source"
    source_model = WorkerTaskSource
