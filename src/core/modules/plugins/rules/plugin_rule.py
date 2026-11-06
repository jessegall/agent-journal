from core.modules.plugins.support.plugin_nudges import PLUGIN_LINE, PLUGIN_REFUSAL
import json

from core.base.agent_role import AgentRole
from core.base.role_group import RoleGroup
from core.base.command.command import Command
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.plugins.commands.add_plugin_output.add_plugin_output import AddPluginOutput
from core.modules.plugins.commands.clear_plugin_faults.clear_plugin_faults import ClearPluginFaults
from core.modules.plugins.commands.clear_plugin_queue_file.clear_plugin_queue_file import ClearPluginQueueFile
from core.modules.plugins.commands.deliver_plugin_event.deliver_plugin_event import DeliverPluginEvent
from core.modules.plugins.commands.record_plugin_fault.record_plugin_fault import RecordPluginFault
from core.modules.plugins.commands.switch_off_changed_plugin.switch_off_changed_plugin import SwitchOffChangedPlugin
from core.modules.plugins.models.enums.refusable_event import RefusableEvent
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.plugin_queue_file import PluginQueueFile
from core.modules.plugins.support.hook_facts import HookFacts
from core.modules.plugins.support.plugin_call import PluginCall
from core.modules.plugins.support.plugin_event import PluginEvent
from core.modules.plugins.support.plugin_declared_event import CEILING_SETTING
from core.modules.plugins.support.plugin_event_names import PluginEventNames
from core.modules.plugins.support.plugin_fault_error import PluginFaultError
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_late_error import PluginLateError
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_program import PluginProgram
from core.modules.plugins.support.plugin_queue import PluginQueue
from core.modules.plugins.support.plugin_service_closed_error import PluginServiceClosedError
from core.modules.plugins.support.plugin_settings import PluginSettings
from core.modules.plugins.support.runnable_plugins import RunnablePlugins
from core.base.model.event_form import EventForm
from core.modules.settings.bindings.support.setting_values import SettingValues

UNREADABLE_MANIFEST_FAULT = "its manifest cannot be read"


class PluginRule(DriverRule):
    """Delivers hooks to enabled plugins according to their declared events and role reach."""

    name = "plugins.plugin-events"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    role_group = RoleGroup.PLUGIN

    def __init__(self, runnable: RunnablePlugins, folders: PluginFolders, program: PluginProgram, settings: PluginSettings, setting_values: SettingValues,
                 queries: Queries) -> None:
        self.runnable, self.folders, self.program, self.settings, self.setting_values = runnable, folders, program, settings, setting_values
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        lines: list[str] = []
        commands: list[Command[object]] = []
        events = PluginEventNames().events(hook)
        values: dict[int, dict[str, object]] = {}
        facts = HookFacts(self.program, hook.agent_id)
        commands.extend(RecordPluginFault(plugin.id, UNREADABLE_MANIFEST_FAULT) for plugin in self.runnable.unreadable())
        for runnable in self.runnable.enabled():
            plugin, manifest = runnable.plugin, runnable.manifest
            if manifest.needs_newer_journal:
                continue
            if runnable.is_changed:
                lines.append(f"[plugin {plugin.name}] switched off: its files changed since it was installed; the user switches it on again once they read the change")
                commands.append(SwitchOffChangedPlugin(plugin.id))
                continue
            if hook.event.accepts_lines:
                self.queued(hook, plugin, lines, commands)
            for event in [event for event in events if event.name in manifest.event_names and self.reaches(hook, manifest, event.name)]:
                commit = manifest.declared_event(event.name, EventForm.COMMIT)
                if event.name not in manifest.window_names() or commit is not None:
                    commands.append(DeliverPluginEvent(plugin.id, hook.agent_id, commit.key if commit else event.name, json.dumps(dict(event.data)), commit.script if commit else ""))
                if event.name not in manifest.window_names():
                    continue
                refusal = self.refusal_text(hook, plugin, manifest, event, lines, commands, values, facts)
                if refusal:
                    return RuleAnswer(refusal=refusal, nudges=(*(PLUGIN_LINE.nudge(text=line) for line in lines), PLUGIN_REFUSAL.nudge(text=refusal)), commands=tuple(commands))
        return RuleAnswer(nudges=tuple(PLUGIN_LINE.nudge(text=line) for line in lines), commands=tuple(commands))

    def queued(self, hook: AgentHook, plugin: Plugin, lines: list[str], commands: list[Command[object]]) -> None:
        queue = PluginQueue(self.folders.data(plugin.name))
        committed = {row.name for row in self.queries.query(PluginQueueFile).filter(plugin_id=plugin.id).matching(Among("name", queue.reserved_names())).all_rows()}
        read = queue.reserve(hook.event.environment, hook.agent_id, hook.event.firing, committed)
        for name, answer in read.answers:
            lines.extend([f"[plugin {plugin.name}] {answer.line}"] if answer.line else [])
            commands.extend([AddPluginOutput(plugin.id, hook.agent_id, answer.output)] if answer.has_output() else [])
            commands.append(ClearPluginQueueFile(plugin.id, name))
        commands.extend(RecordPluginFault(plugin.id, f"its queue file {name} is not JSON") for name in read.unreadable)

    @staticmethod
    def reaches(hook: AgentHook, manifest: PluginManifest, event: str) -> bool:
        return hook.role == AgentRole.MAIN or manifest.reaches_role(event, hook.role)

    def refusal_text(self, hook: AgentHook, plugin: Plugin, manifest: PluginManifest, event: PluginEvent, lines: list[str], commands: list[Command[object]],
                     values: dict[int, dict[str, object]], facts: HookFacts) -> str:
        if plugin.id not in values:
            values[plugin.id] = self.settings.values(plugin, manifest)
        guard = manifest.declared_event(event.name, EventForm.GUARD)
        call = PluginCall(manifest, PluginEvent(guard.key, event.data) if guard else event, hook.event.environment, hook.timestamp, values[plugin.id], hook.agent_id, form=EventForm.GUARD, script=guard.script if guard else "", hook_waits=True, facts=facts.value)
        try:
            answer = self.program.run(call, manifest.window_ms(event.name, self.setting_values.number(CEILING_SETTING)))
        except PluginLateError:
            return ""
        except PluginServiceClosedError as closed:
            record = closed.fault_record(plugin.id, f"at {event.name}")
            if plugin.last_fault != record.fault and record not in commands:
                commands.append(record)
            return ""
        except PluginFaultError as fault:
            commands.append(fault.fault_record(plugin.id, f"at {event.name}"))
            return ""
        if plugin.last_fault:
            commands.append(ClearPluginFaults(plugin.id))
        if answer.has_output():
            commands.append(AddPluginOutput(plugin.id, hook.agent_id, answer.output))
        answer_text = answer.reason if answer.is_refusal() else answer.line
        journal_line = hook.event.tool is not None and hook.event.tool.is_journal_line
        refusing = answer.is_refusal() and event.name in [refusable.value for refusable in RefusableEvent]
        if refusing and not journal_line:
            return f"[plugin {plugin.name}] {answer_text}"
        if answer_text:
            lines.append(f"[plugin {plugin.name}] {answer_text}")
        return ""
