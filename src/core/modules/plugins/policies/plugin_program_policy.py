from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
import re

from core.modules.plugins.support.runnable_plugins import RunnablePlugins
from core.modules.plugins.agent_messages.plugin_program_off_message import PluginProgramOffMessage

PLUGIN_PROGRAM = re.compile(r"(?:^|/)\.journal/plugins/([^/]+)/")


class PluginProgramPolicy(EventPolicy):
    """Refuses a shell line that runs a program from the folder of a plugin that is switched off or no longer
    installed, as its aliases are refused; reading the plugin's files goes on."""

    key = "plugins.plugin-program"
    rank = "plugins.policies"

    def __init__(self, plugins: RunnablePlugins) -> None:
        self.plugins = plugins

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        shell = event.tool.shell if event.tool is not None else None
        if shell is None:
            return None
        enabled = {plugin.name for plugin in self.plugins.enabled_rows()}
        for part in shell.parts:
            matched = PLUGIN_PROGRAM.search(part.program)
            if matched is not None and matched.group(1) not in enabled:
                return PluginProgramOffMessage.declared().agent_message(plugin=matched.group(1))
        return None
