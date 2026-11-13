from core.modules.plugins.support.plugin_nudges import PLUGIN_REFUSAL
from core.modules.drivers.commands.record_agent_notice.record_agent_notice import RecordAgentNotice
import json

from engine.enums.agent_role import AgentRole
from engine.time.clock import Clock
from engine.agent.enums.role_group import RoleGroup
from engine.command.command import Command
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_wildcard import HookWildcard
from engine.driver.rule_answer import RuleAnswer
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.plugins.commands.add_plugin_output.add_plugin_output import AddPluginOutput
from core.modules.plugins.commands.clear_plugin_queue_file.clear_plugin_queue_file import ClearPluginQueueFile
from core.modules.plugins.commands.deliver_plugin_event.deliver_plugin_event import DeliverPluginEvent
from core.modules.plugins.commands.record_plugin_fault.record_plugin_fault import RecordPluginFault
from core.modules.plugins.models.enums.refusable_event import RefusableEvent
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.plugin_queue_file import PluginQueueFile
from core.modules.plugins.support.hook_facts import HookFacts
from core.modules.plugins.support.plugin_event import PluginEvent
from core.modules.plugins.support.plugin_event_entry import CEILING_SETTING
from core.modules.plugins.support.plugin_event_names import PluginEventNames
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_queue import PluginQueue
from core.modules.plugins.support.plugin_run import PluginRun
from core.modules.plugins.support.plugin_run_request import PluginRunRequest
from core.modules.plugins.support.runnable_plugin import RunnablePlugin
from core.modules.plugins.support.runnable_plugins import RunnablePlugins
from engine.enums.event_form import EventForm
from engine.setting.setting_values import SettingValues


class PluginRule(DriverRule):
    """Delivers hooks to enabled plugins according to their declared events and role reach."""

    name = "plugins.plugin-events"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    role_group = RoleGroup.PLUGIN

    def __init__(self, runnable: RunnablePlugins, folders: PluginFolders, runs: PluginRun, setting_values: SettingValues, queries: Queries, clock: Clock) -> None:
        self.runnable, self.folders, self.runs, self.setting_values = runnable, folders, runs, setting_values
        self.queries, self.clock = queries, clock

    def answer(self, hook: AgentHook) -> RuleAnswer:
        lines: list[str] = []
        commands: list[Command[object]] = []
        events = PluginEventNames().events(hook)
        facts = self.runs.hook_facts(hook.agent_id)
        for check in self.runnable.checks():
            commands.extend(check.records(""))
            if check.is_changed:
                lines.append(f"[plugin {check.plugin.name}] switched off: {check.reason}; the user switches it on again once they read the change")
            runnable = check.runnable
            if runnable is None:
                continue
            plugin, manifest = runnable.plugin, runnable.manifest
            if hook.event.accepts_lines:
                self.queued(hook, plugin, lines, commands)
            reached = [event for event in events if event.name in manifest.event_names and self.reaches(hook, manifest, event.name)]
            for event in reached:
                commit = manifest.declared_event(event.name, EventForm.COMMIT)
                if event.name not in manifest.window_names() or commit is not None:
                    commands.append(DeliverPluginEvent(plugin.id, hook.agent_id, commit.key if commit else event.name, json.dumps(dict(event.data)), commit.script if commit else ""))
            for group in self.window_groups(manifest, [event for event in reached if event.name in manifest.window_names()]):
                refusal = self.refusal_text(hook, runnable, group, lines, commands, facts)
                if refusal:
                    notice = PLUGIN_REFUSAL.nudge(plugin=plugin.id)
                    commands.extend(RecordAgentNotice(hook.agent_id, line, self.name) for line in [*lines, refusal])
                    return RuleAnswer(refusal=notice.text, nudges=tuple([notice]), commands=tuple(commands))
        return RuleAnswer.allowed().running(*commands, *(RecordAgentNotice(hook.agent_id, line, self.name) for line in lines))

    # The held events of one hook that one script judges within one limit: the plugin's program runs once for each
    # group.
    def window_groups(self, manifest: PluginManifest, events: list[PluginEvent]) -> list[list[PluginEvent]]:
        groups: dict[tuple[str, int], list[PluginEvent]] = {}
        ceiling = self.setting_values.number(CEILING_SETTING)
        for event in events:
            guard = manifest.declared_event(event.name, EventForm.GUARD)
            groups.setdefault((guard.script if guard else "", manifest.window_ms(event.name, ceiling)), []).append(event)
        return list(groups.values())

    def queued(self, hook: AgentHook, plugin: Plugin, lines: list[str], commands: list[Command[object]]) -> None:
        queue = PluginQueue(self.folders.data(plugin.name))
        reserved = queue.reserved_names()
        committed: set[str] = set(self.queries.query(PluginQueueFile).filter(plugin_id=plugin.id).matching(Among("name", reserved)).pluck("name", str)) if reserved else set()
        read = queue.reserve(hook.event.environment, hook.agent_id, hook.event.firing, committed, self.clock)
        for name, answer in read.answers:
            lines.extend([f"[plugin {plugin.name}] {answer.line}"] if answer.line else [])
            commands.extend([AddPluginOutput(plugin.id, hook.agent_id, answer.output)] if answer.has_output() else [])
            commands.append(ClearPluginQueueFile(plugin.id, name))
        commands.extend(RecordPluginFault(plugin.id, f"its queue file {name} is not JSON") for name in read.unreadable)

    @staticmethod
    def reaches(hook: AgentHook, manifest: PluginManifest, event: str) -> bool:
        return hook.role == AgentRole.MAIN or manifest.reaches_role(event, hook.role)

    def refusal_text(self, hook: AgentHook, runnable: RunnablePlugin, group: list[PluginEvent], lines: list[str], commands: list[Command[object]], facts: HookFacts) -> str:
        plugin, manifest = runnable.plugin, runnable.manifest
        event = group[0]
        guard = manifest.declared_event(event.name, EventForm.GUARD)
        sent = tuple(PluginEvent(declared.key, member.data) if (declared := manifest.declared_event(member.name, EventForm.GUARD)) else member for member in group)
        request = PluginRunRequest(runnable, sent[0], EventForm.GUARD, manifest.window_ms(event.name, self.setting_values.number(CEILING_SETTING)),
                                   f"at {event.name}", hook.event.environment, hook.timestamp, hook.agent_id, guard.script if guard else "", hook_waits=True, facts=facts.value, events=sent)
        outcome = self.runs.run(request)
        if outcome.is_late:
            return ""
        commands.extend(record for record in outcome.records if record not in commands)
        answer = outcome.answer
        if answer is None:
            return ""
        if answer.has_output():
            commands.append(AddPluginOutput(plugin.id, hook.agent_id, answer.output))
        answer_text = answer.reason if answer.is_refusal() else answer.line
        journal_line = hook.event.tool is not None and hook.event.tool.is_journal_line
        refusing = answer.is_refusal() and any(member.name in [refusable.value for refusable in RefusableEvent] for member in group)
        if refusing and not journal_line:
            return f"[plugin {plugin.name}] {answer_text}"
        if answer_text:
            lines.append(f"[plugin {plugin.name}] {answer_text}")
        return ""
