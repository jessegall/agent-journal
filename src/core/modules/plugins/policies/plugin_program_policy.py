from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
import re

from core.modules.plugins.support.runnable_plugins import RunnablePlugins
from core.modules.plugins.nudges.plugin_program_off_nudge import PluginProgramOffNudge

PLUGIN_PROGRAM = re.compile(r"(?:^|/)\.journal/plugins/([^/]+)/")


class PluginProgramPolicy(EventPolicy):
    """Refuses a shell line that runs a program from the folder of a plugin that is switched off or no longer
    installed, as its aliases are refused; reading the plugin's files goes on."""

    key = "plugins.plugin-program"
    rank = "plugins.policies"

    def __init__(self, plugins: RunnablePlugins) -> None:
        self.plugins = plugins

    def refusal(self, event: HookEvent, agent_id: int) -> Nudge | None:
        shell = event.tool.shell if event.tool is not None else None
        if shell is None:
            return None
        enabled = {plugin.name for plugin in self.plugins.enabled_rows()}
        for part in shell.parts:
            matched = PLUGIN_PROGRAM.search(part.program)
            if matched is not None and matched.group(1) not in enabled:
                return PluginProgramOffNudge.declared().nudge(plugin=matched.group(1))
        return None
