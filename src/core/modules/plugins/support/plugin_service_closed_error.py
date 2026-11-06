from typing import ClassVar

from core.modules.plugins.support.plugin_fault_error import PluginFaultError


class PluginServiceClosedError(PluginFaultError):
    """The service that answers a held event in a hook was closed, so the event went through unjudged: a note
    on the plugin's card, and no fault of its program."""

    counts_toward_failing: ClassVar[bool] = False
