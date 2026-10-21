from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.idle import Idle
from journal.events.agent_listener import AgentListener
from journal.features.plugins.support.plugin_relay import PluginRelay
from journal.features.plugins.support.plugin_queue import PluginQueue
from journal.features.plugins.support.plugin_words import PluginWords
from journal.support.decision import Decision
from journal.support.deferred import Deferred
from journal.support.floor import Floor
from journal.models.plugin import Plugin
from journal.features.plugins.support.plugin_answer import PluginAnswer
from journal.repositories.setting_rows import SettingRows

CARRIES = ("tool_starting", "tool_finished", "prompt_submitted", "session_started")
"""The hooks whose answer can carry a line to the agent without holding it, where a plugin's waiting lines are handed over."""
REFUSABLE = ("tool_starting", "idle")
"""The held events a plugin may refuse; at a prompt and a start its refusal is only said, and a stop it holds once a turn, never again after the agent went on because a stop was held."""


class PluginsHearAgents(AgentListener[AgentEvent]):
    """The plugins that hear an agent event: those that hold it are asked now, in the order they were installed, each inside the window its manifest declares under the ceiling the user set; the rest hear it after the reply, and so does every one once the event is held. It stays a listener on purpose: it is the one funnel through which a plugin's words and holds reach the agent, and what it says is each plugin's, never the journal's conduct."""

    blocking = True
    asked_while_free = True

    def __init__(self, relay: PluginRelay, deferred: Deferred, settings: SettingRows, floor: Floor, words: PluginWords, queue: PluginQueue) -> None:
        self.relay, self.deferred, self.settings, self.floor, self.words, self.queue = relay, deferred, settings, floor, words, queue

    def handle(self, event: AgentEvent) -> Decision | None:
        from journal.features.plugins.feature import PluginsFeature
        hearers = self.relay.heard_by(event, event.environment_id)
        ceiling_ms = int(self.settings.option(PluginsFeature.HOLD_WINDOW))
        waiting = self.relay.waiting_for(event.session) if event.key in CARRIES else []
        if event.key in CARRIES:
            waiting += [line for plugin in self.relay.plugins.enabled() for line in self.queue.lines(plugin, event)]
        decision = Decision.allowed_with("\n".join(waiting)) if waiting else Decision()
        for plugin in hearers:
            if decision.allowed and self.holds(plugin, event):
                window = plugin.manifest.window_ms(event.key, ceiling_ms) / 1000
                decision = decision.merged(self.decided(plugin, event, self.relay.ask(plugin, event, event.environment_id, window)))
            else:
                self.deferred.add_unless_behind(lambda plugin=plugin: self.relay.later(plugin, event, event.environment_id), f"{plugin.name} relay {event.key}")
        return self.floor.under(event, decision)

    @staticmethod
    def holds(plugin: Plugin, event: AgentEvent) -> bool:
        return plugin.manifest.has_window(event.key) and (not event.subagent or event.key == "tool_starting")

    def decided(self, plugin: Plugin, event: AgentEvent, answer: PluginAnswer) -> Decision:
        if answer.answer == "refuse" and isinstance(event, Idle) and event.held_before:
            self.relay.unanswered(plugin, event, event.environment_id, answer.reason)
            return Decision()
        if answer.answer == "refuse" and event.key in REFUSABLE:
            self.relay.said(plugin, event, event.environment_id, "held", answer.reason)
            return Decision.refuse(self.words.said(plugin, answer.reason))
        words = answer.reason if answer.answer == "refuse" else answer.tell
        if not words:
            return Decision()
        self.relay.said(plugin, event, event.environment_id, "told", words)
        return Decision.allowed_with(self.words.said(plugin, words))
