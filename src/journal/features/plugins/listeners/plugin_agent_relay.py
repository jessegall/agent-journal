from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.command_starting import CommandStarting
from journal.events.agent.file_edited import FileEdited
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent.stop import Stop
from journal.events.agent_listener import AgentListener
from journal.features.plugins.support.protocol import Protocol
from journal.features.plugins.support.plugin_relay import PluginRelay
from journal.features.plugins.support.plugin_queue import PluginQueue
from journal.features.plugins.support.plugin_text import PluginText
from journal.support.decision import Decision
from journal.support.listener_queue import ListenerQueue
from journal.support.plugin_refusal_exemption import PluginRefusalExemption
from journal.models.plugin import Plugin
from journal.features.plugins.support.plugin_answer import PluginAnswer
from journal.repositories.edits import Edits
from journal.repositories.setting_rows import SettingRows

LINE_EVENT_KEYS = ("tool_starting", "tool_finished", "prompt_submitted", "session_started")
REFUSABLE = ("tool_starting", "command_starting", "file_edited", "idle")


class PluginAgentRelay(AgentListener[AgentEvent]):
    """The plugins that hear an agent event: those that hold it are asked now, in the order they were installed, each inside the window its manifest declares under the ceiling the user set; the rest hear it after the reply, and so does every one once the event is held. It stays a listener on purpose: it is the one funnel through which a plugin's words and holds reach the agent, and what it says is each plugin's, never the journal's conduct."""

    blocking = True
    asked_while_free = True
    asked_last = True

    def __init__(self, relay: PluginRelay, deferred: ListenerQueue, settings: SettingRows, exemption: PluginRefusalExemption, text: PluginText, queue: PluginQueue, edits: Edits) -> None:
        self.relay, self.deferred, self.settings, self.exemption, self.text, self.queue, self.edits = relay, deferred, settings, exemption, text, queue, edits

    def handle(self, event: AgentEvent) -> Decision | None:
        from journal.features.plugins.feature import PluginsFeature
        hearers = self.relay.listeners(event, event.environment_id)
        ceiling_ms = int(self.settings.option(PluginsFeature.PLUGIN_ANSWER_WINDOW))
        waiting = self.relay.waiting_lines(event.session) if Protocol.published_name(event) in LINE_EVENT_KEYS else []
        if Protocol.published_name(event) in LINE_EVENT_KEYS:
            waiting += [line for plugin in self.relay.plugins.enabled() for line in self.queue.lines(plugin, event)]
        decision = Decision.allowed_with("\n".join(waiting)) if waiting else Decision()
        decision = self.request(hearers, event, ceiling_ms, decision)
        for command in self.commands(event):
            decision = self.request(self.relay.listeners(command, event.environment_id), command, ceiling_ms, decision)
        for edited in self.edited(event):
            decision = self.request([p for p in self.relay.listeners(edited, event.environment_id) if p.manifest.has_window(edited.key)], edited, ceiling_ms, decision)
        return self.exemption.applied(event, decision)

    def edited(self, event: AgentEvent) -> list[FileEdited]:
        if not isinstance(event, ToolFinished):
            return []
        return [FileEdited.recorded(edit, event.environment_id) for edit in self.edits.tool_use_edits(event.session, event.tool_use)]

    def request(self, hearers: list[Plugin], event: AgentEvent, ceiling_ms: int, decision: Decision) -> Decision:
        for plugin in hearers:
            if decision.allowed and self.blocks(plugin, event):
                window = plugin.manifest.window_ms(Protocol.published_name(event), ceiling_ms) / 1000
                decision = decision.merged(self.decided(plugin, event, self.relay.ask(plugin, event, event.environment_id, window)))
            else:
                self.deferred.add_bounded(lambda plugin=plugin: self.relay.postponed(plugin, event, event.environment_id), f"{plugin.name} relay {Protocol.published_name(event)}")
        return decision

    @staticmethod
    def commands(event: AgentEvent) -> list[CommandStarting]:
        if not isinstance(event, ToolStarting):
            return []
        parts = [part for part in event.call.parts if not part.is_journal]
        return [CommandStarting(text=part.text, writes=part.writes, files=part.files, position=position, parts=len(parts), tool_use=event.tool_use).placed(event.session, event.environment_id, event.provider, event.context, event.time, event.subagent) for position, part in enumerate(parts, 1)]

    @staticmethod
    def blocks(plugin: Plugin, event: AgentEvent) -> bool:
        return plugin.manifest.has_window(Protocol.published_name(event)) and (not event.subagent or Protocol.published_name(event) in ("tool_starting", "command_starting", "file_edited"))

    def decided(self, plugin: Plugin, event: AgentEvent, answer: PluginAnswer) -> Decision:
        if answer.answer == "refuse" and isinstance(event, Stop) and event.held_before:
            self.relay.unanswered(plugin, event, event.environment_id, answer.reason)
            return Decision()
        if answer.answer == "refuse" and Protocol.published_name(event) in REFUSABLE:
            self.relay.line(plugin, event, event.environment_id, "held", answer.reason)
            return Decision.refuse(self.text.line(plugin, answer.reason))
        text = answer.reason if answer.answer == "refuse" else answer.tell
        if not text:
            return Decision()
        self.relay.line(plugin, event, event.environment_id, "told", text)
        return Decision.allowed_with(self.text.line(plugin, text))
