from typing import ClassVar

from engine.enums.script_stop import ScriptStop
from core.modules.plugins.errors.plugin_fault_error import PluginFaultError


class PluginStoppedError(PluginFaultError):
    """A plugin's script was stopped on purpose. It lets the change through, and it is no fault of the plugin's own."""

    counts_toward_failing: ClassVar[bool] = False

    def __init__(self, stop: ScriptStop) -> None:
        super().__init__(f"it was stopped when {stop.value}")
        self.stop = stop

    @property
    def is_server_stop(self) -> bool:
        return self.stop is ScriptStop.SERVER
