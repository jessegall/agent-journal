import json

from core.base.agent_role import AgentRole
from core.base.command.command import Command
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.modules.plugins.commands.add_plugin_output import AddPluginOutput
from core.modules.plugins.commands.clear_plugin_faults import ClearPluginFaults
from core.modules.plugins.commands.deliver_plugin_event import DeliverPluginEvent
from core.modules.plugins.commands.record_plugin_fault import RecordPluginFault
from core.modules.plugins.commands.switch_off_changed_plugin import SwitchOffChangedPlugin
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_call import PluginCall
from core.modules.plugins.support.plugin_digest import PluginDigest
from core.modules.plugins.support.plugin_event import PluginEvent
from core.modules.plugins.support.plugin_event_names import PluginEventNames
from core.modules.plugins.support.plugin_fault_error import PluginFaultError
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_late_error import PluginLateError
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_program import PluginProgram
from core.modules.plugins.support.plugin_queue import PluginQueue
from core.modules.plugins.support.plugin_settings import PluginSettings
from core.modules.settings.bindings.support.setting_values import SettingValues

CEILING_SETTING = "journal.core.plugins.hold_window_ms"
REFUSABLE_EVENTS = ("tool_starting", "command_starting", "file_edited", "idle")


class PluginRule(DriverRule):
    """Hands the main agent's hooks to the plugins switched on, as version 4 did: a plugin answers an event it
    holds inside its window, and may refuse it; an event it only hears runs after the reply; the lines in its
    queue reach the agent; and a plugin whose files changed since the person last took them is switched off."""

    name = "plugins.plugin-events"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, program: PluginProgram, settings: PluginSettings, setting_values: SettingValues) -> None:
        self.plugins, self.folders, self.program, self.settings, self.setting_values = plugins, folders, program, settings, setting_values

    def answer(self, hook: AgentHook) -> RuleAnswer:
        lines: list[str] = []
        commands: list[Command[object]] = []
        events = PluginEventNames().events(hook)
        for plugin in self.plugins.enabled_ones():
            if PluginDigest.digest(self.folders.code(plugin.name)) != plugin.files_digest:
                lines.append(f"[plugin {plugin.name}] switched off: its files changed since it was installed; the user switches it on again once they read the change")
                commands.append(SwitchOffChangedPlugin(plugin.id))
                continue
            manifest = PluginManifest.read(self.folders.code(plugin.name))
            if hook.event.accepts_lines:
                for queued in PluginQueue(self.folders.data(plugin.name)).answers(hook.event.environment):
                    lines.extend([f"[plugin {plugin.name}] {queued.line}"] if queued.line else [])
                    commands.extend([AddPluginOutput(plugin.id, hook.environment_id, queued.output)] if queued.has_output() else [])
            for event in [event for event in events if event.name in manifest.event_names]:
                if event.name not in manifest.window_names():
                    commands.append(DeliverPluginEvent(plugin.id, hook.environment_id, event.name, json.dumps(dict(event.data))))
                    continue
                refusal = self.refusal_text(hook, plugin, manifest, event, lines, commands)
                if refusal:
                    return RuleAnswer(refusal=refusal, lines=tuple(lines), commands=tuple(commands))
        return RuleAnswer(lines=tuple(lines), commands=tuple(commands))

    def refusal_text(self, hook: AgentHook, plugin: Plugin, manifest: PluginManifest, event: PluginEvent, lines: list[str], commands: list[Command[object]]) -> str:
        call = PluginCall(manifest, event, hook.event.environment, hook.timestamp, self.settings.values(plugin, manifest))
        try:
            answer = self.program.run(call, manifest.window_ms(event.name, self.setting_values.number(CEILING_SETTING, hook.environment_id)))
        except PluginLateError:
            return ""
        except PluginFaultError as fault:
            commands.append(RecordPluginFault(plugin.id, f"{fault} at {event.name}"))
            return ""
        if plugin.fault_count:
            commands.append(ClearPluginFaults(plugin.id))
        if answer.has_output():
            commands.append(AddPluginOutput(plugin.id, hook.environment_id, answer.output))
        answer_text = answer.reason if answer.is_refusal() else answer.line
        journal_line = hook.event.tool is not None and hook.event.tool.is_journal_line
        if answer.is_refusal() and event.name in REFUSABLE_EVENTS and not journal_line:
            return f"[plugin {plugin.name}] {answer_text}"
        if answer_text:
            lines.append(f"[plugin {plugin.name}] {answer_text}")
        return ""
