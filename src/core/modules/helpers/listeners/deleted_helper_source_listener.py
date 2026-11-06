from core.modules.drivers.models.helper_job import HelperJob
from core.modules.messages.listeners.deleted_source_listener import DeletedSourceListener


class DeletedHelperSourceListener(DeletedSourceListener):
    """Keeps deleted request references unavailable in all affected helper jobs."""

    name = "helpers.deleted-source"
    source_model = HelperJob
