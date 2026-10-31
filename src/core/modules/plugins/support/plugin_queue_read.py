from dataclasses import dataclass

from core.modules.plugins.support.plugin_answer import PluginAnswer


@dataclass(frozen=True)
class PluginQueueRead:
    """What one hook reserved in a plugin's queue: each answer with the name of its reserved file, and the names of
    the files that were not JSON and were set aside."""

    answers: list[tuple[str, PluginAnswer]]
    unreadable: list[str]
