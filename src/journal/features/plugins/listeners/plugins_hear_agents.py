from time import monotonic

from journal.events.agent.agent_event import AgentEvent
from journal.features.agent_listener import AgentListener
from journal.features.plugins.plugin_hearing import PluginHearing
from journal.features.plugins.plugin_words import PluginWords
from journal.hooks.decision import Decision
from journal.hooks.deferred import Deferred
from journal.hooks.floor import Floor
from journal.models.plugin import Plugin
from journal.models.plugin_answer import PluginAnswer
from journal.repositories.settings import Settings

REFUSABLE = ("tool_starting", "idle")
"""The held events a plugin may refuse; at a prompt and a start its refusal is only said."""


class PluginsHearAgents(AgentListener[AgentEvent]):
    """The plugins that hear an agent event: those that hold it are asked now, in the order they were installed, within one deadline for them all; the rest hear it after the reply, and so does every one once the event is held."""

    blocking = True
    asked_while_free = True

    def __init__(self, hearing: PluginHearing, deferred: Deferred, settings: Settings, floor: Floor, words: PluginWords) -> None:
        self.hearing, self.deferred, self.settings, self.floor, self.words = hearing, deferred, settings, floor, words

    def handle(self, event: AgentEvent) -> Decision | None:
        from journal.features.plugins.feature import PluginsFeature
        heard = self.hearing.heard_by(event, event.environment_id)
        deadline = monotonic() + float(self.settings.option(PluginsFeature.DEADLINE))
        decision = Decision()
        for plugin in heard:
            if decision.allowed and event.key in plugin.manifest.get("holds", ()):
                decision = decision.merged(self.decided(plugin, event, self.hearing.ask(plugin, event, event.environment_id, deadline - monotonic())))
            else:
                self.deferred.add(lambda plugin=plugin: self.hearing.later(plugin, event, event.environment_id))
        return self.floor.under(event, decision)

    def decided(self, plugin: Plugin, event: AgentEvent, answer: PluginAnswer) -> Decision:
        if answer.answer == "refuse" and event.key in REFUSABLE:
            return Decision.refuse(self.words.said(plugin, answer.reason))
        words = answer.reason if answer.answer == "refuse" else answer.tell
        return Decision.tell(self.words.said(plugin, words)) if words else Decision()
