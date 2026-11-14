from core.modules.messages.listeners.deleted_source_listener import DeletedSourceListener
from suites.coding.modules.workers.models.worker_task_source import WorkerTaskSource


class DeletedWorkerSourceListener(DeletedSourceListener):
    """Keeps deleted request references unavailable in assigned tasks and follow-ups."""

    source_model = WorkerTaskSource
    name = "workers.deleted-source"
