import re

from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.plugins.support.runnable_plugins import RunnablePlugins
from core.modules.plugins.nudges.plugin_program_off_nudge import PluginProgramOffNudge

PLUGIN_PROGRAM = re.compile(r"(?:^|/)\.journal/plugins/([^/]+)/")


class PluginProgramRule(DriverRule):
    """Refuses a shell line that runs a program from the folder of a plugin that is switched off or no longer
    installed, as its aliases are refused; reading the plugin's files goes on."""

    name = "plugins.plugin-program"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    single_action_refusal = "Refuses a shell line that runs a program from the folder of a plugin that is switched off or no longer"

    def __init__(self, plugins: RunnablePlugins) -> None:
        self.plugins = plugins

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None:
            return RuleAnswer.allowed()
        enabled = {plugin.name for plugin in self.plugins.enabled_rows()}
        for part in shell.parts:
            matched = PLUGIN_PROGRAM.search(part.program)
            if matched is not None and matched.group(1) not in enabled:
                return RuleAnswer.refused(PluginProgramOffNudge.declared().nudge(plugin=matched.group(1)))
        return RuleAnswer.allowed()
