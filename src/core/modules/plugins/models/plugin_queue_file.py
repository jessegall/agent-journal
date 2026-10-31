from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class PluginQueueFile(Model):
    """A queue file a hook reserved in a plugin's queue, deleted by its listener once the hook has committed."""

    model_name = "plugin_queue_file"
    cli_name = "plugin-queue-file"

    plugin_id: int
    creator_id: int
    name: str
