from typing import ClassVar

from core.modules.plugins.support.plugin_fault_error import PluginFaultError


class PluginLateError(PluginFaultError):
    """A plugin's program ran past its time limit and was stopped."""

    is_late: ClassVar[bool] = True
