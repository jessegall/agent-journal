from dataclasses import dataclass

from core.modules.plugins.models.plugin import Plugin


@dataclass(frozen=True)
class HealthMiss:
    """A plugin's service that missed its health check and was started again: the plugin and the fault."""

    plugin: Plugin
    fault: str
