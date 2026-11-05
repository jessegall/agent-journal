from dataclasses import dataclass

from core.modules.plugins.models.plugin import Plugin


@dataclass(frozen=True)
class ServiceFault:
    """A fault of a plugin's service: a missed health check or a condition past its limit, with its plugin."""

    plugin: Plugin
    fault: str
