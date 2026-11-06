from typing import ClassVar

from core.modules.plugins.support.plugin_fault_error import PluginFaultError


class PluginStoppedError(PluginFaultError):
    """A plugin's script was stopped on purpose. It lets the change through, and it is no fault of the plugin's own."""

    counts_toward_failing: ClassVar[bool] = False

    @classmethod
    def because(cls, reason: str) -> "PluginStoppedError":
        return cls(f"it was stopped when {reason}")
