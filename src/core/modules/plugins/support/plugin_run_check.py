from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.plugins.commands.record_plugin_fault.record_plugin_fault import RecordPluginFault
from core.modules.plugins.commands.switch_off_changed_plugin.switch_off_changed_plugin import SwitchOffChangedPlugin
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.runnable_plugin import RunnablePlugin


@dataclass(frozen=True)
class PluginRunCheck:
    """Whether one plugin may run now: its manifest when it may, and otherwise why not and what to record."""

    plugin: Plugin
    runnable: RunnablePlugin | None = None
    reason: str = ""
    is_unreadable: bool = False
    is_changed: bool = False

    def records(self, location: str) -> tuple[Command[object], ...]:
        if self.is_unreadable:
            return tuple([RecordPluginFault(self.plugin.id, f"its manifest cannot be read: {self.reason} {location}".strip())])
        if self.is_changed:
            return tuple([SwitchOffChangedPlugin(self.plugin.id)])
        return ()
