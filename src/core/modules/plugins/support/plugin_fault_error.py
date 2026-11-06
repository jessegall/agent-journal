from typing import ClassVar

from core.modules.plugins.commands.record_plugin_fault.record_plugin_fault import RecordPluginFault


class PluginFaultError(Exception):
    """A plugin's program ran past its limit, ended with an error code, or printed an answer that is not JSON.
    """

    counts_toward_failing: ClassVar[bool] = True
    is_late: ClassVar[bool] = False

    @property
    def is_server_stop(self) -> bool:
        return False

    def fault_record(self, plugin_id: int, location: str) -> RecordPluginFault:
        return RecordPluginFault(plugin_id, f"{self} {location}", self.counts_toward_failing)
