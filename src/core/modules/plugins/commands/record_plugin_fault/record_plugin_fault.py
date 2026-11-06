from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.plugin_fault_error import PluginFaultError


@dataclass(frozen=True)
class RecordPluginFault(Command[Plugin]):
    """Records a fault a plugin's program made: a late run, an error code, or an answer that is not JSON."""

    plugin_id: int
    fault: str
    counts_toward_failing: bool = True

    @classmethod
    def of(cls, plugin_id: int, fault: PluginFaultError, where: str) -> "RecordPluginFault":
        return cls(plugin_id, f"{fault} {where}", fault.counts_toward_failing)
