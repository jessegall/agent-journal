from time import monotonic

from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.idle import Idle
from journal.events.agent_listener import AgentListener
from journal.features.plugins.plugin_hearing import PluginHearing
from journal.features.plugins.plugin_words import PluginWords
from journal.support.decision import Decision
from journal.support.deferred import Deferred
from journal.features.floor import Floor
from journal.models.plugin import Plugin
from journal.models.plugin_answer import PluginAnswer
from journal.repositories.settings import Settings

CARRIES = ("tool_starting", "tool_finished", "prompt_submitted", "session_started")
"""The hooks whose answer can carry a line to the agent without holding it, where a plugin's waiting lines are handed over."""
REFUSABLE = ("tool_starting", "idle")
"""The held events a plugin may refuse; at a prompt and a start its refusal is only said, and a stop it holds once a turn, never again after the agent went on because a stop was held."""


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
        waiting = self.hearing.waiting_for(event.session) if event.key in CARRIES else []
        decision = Decision.tell("\n".join(waiting)) if waiting else Decision()
        for plugin in heard:
            if decision.allowed and self.holds(plugin, event):
                decision = decision.merged(self.decided(plugin, event, self.hearing.ask(plugin, event, event.environment_id, deadline - monotonic())))
            else:
                self.deferred.add(lambda plugin=plugin: self.hearing.later(plugin, event, event.environment_id))
        return self.floor.under(event, decision)

    @staticmethod
    def holds(plugin: Plugin, event: AgentEvent) -> bool:
        """It holds what its manifest says; a subagent's event only at a tool."""
        return event.key in plugin.manifest.holds and (not event.subagent or event.key == "tool_starting")

    def decided(self, plugin: Plugin, event: AgentEvent, answer: PluginAnswer) -> Decision:
        if answer.answer == "refuse" and isinstance(event, Idle) and event.held_before:
            self.hearing.unanswered(plugin, event, event.environment_id, answer.reason)
            return Decision()
        if answer.answer == "refuse" and event.key in REFUSABLE:
            self.hearing.said(plugin, event, event.environment_id, "held", answer.reason)
            return Decision.refuse(self.words.said(plugin, answer.reason))
        words = answer.reason if answer.answer == "refuse" else answer.tell
        if not words:
            return Decision()
        self.hearing.said(plugin, event, event.environment_id, "told", words)
        return Decision.tell(self.words.said(plugin, words))
