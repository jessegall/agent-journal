from journal.events.agent.agent_event import AgentEvent
from journal.events.event import Event
from journal.features.plugins.linked_manifests import LinkedManifests
from journal.features.plugins.plugin_answers import PluginAnswers
from journal.features.plugins.plugin_fault import PluginFault
from journal.features.plugins.plugin_faults import PluginFaults
from journal.features.plugins.plugin_hashes import PluginHashes
from journal.features.plugins.plugin_runner import PluginRunner
from journal.features.plugins.plugin_steps import PluginSteps
from journal.features.plugins.plugin_words import PluginWords
from journal.features.plugins.protocol import Protocol
from journal.models.actor import Actor
from journal.models.entry import Entry
from journal.models.plugin import Plugin
from journal.models.plugin_answer import PluginAnswer
from journal.repositories.agents import Agents
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.repositories.plugins import Plugins
from journal.repositories.scope import Scope
from journal.engine.deferred import Deferred

LATER = 10
"""Seconds a plugin has to answer an event it hears after the reply."""
UNANSWERED = "plugin_unanswered"
WAITING = "plugin_line_waiting"
"""A line a plugin said after the reply, kept until the agent's next hook that can carry it."""
SAID = "plugin_said"
"""The entry a plugin's hold or line to the agent leaves: the event, held or told, and the words."""
CUT = "plugin_cut"
"""The entry a row leaves that no plugin heard because plugin commands led to it more than a step deep."""


class PluginHearing:
    """Which plugins hear an event, and one plugin asked about it: the line built where the event happened, and a fault recorded, never raised."""

    def __init__(self, plugins: Plugins, runner: PluginRunner, protocol: Protocol, faults: PluginFaults, environments: Environments, agents: Agents, entries: Entries, answers: PluginAnswers, steps: PluginSteps, deferred: Deferred, hashes: PluginHashes, linked: LinkedManifests, words: PluginWords, scope: Scope) -> None:
        self.plugins, self.runner, self.protocol, self.faults, self.answers, self.steps = plugins, runner, protocol, faults, answers, steps
        self.environments, self.agents, self.entries, self.deferred, self.hashes, self.linked = environments, agents, entries, deferred, hashes, linked
        self.words, self.scope = words, scope

    def heard_by(self, event: Event, environment_id: int) -> list[Plugin]:
        """The enabled plugins that hear it, in the order they were installed; never the plugin that wrote the row, and none past a step of plugin commands, the cut recorded."""
        heard = [p for p in self.plugins.enabled() if event.key in p.manifest.hears and getattr(event, "by", None) != Actor.plugin(p.name)]
        if heard and self.steps.too_deep():
            self.entries.save(Entry(environment_id=environment_id, kind=CUT, actor=Actor.system(), data={"event": event.key, "by": getattr(event, "by", Actor.system()).stamp, "plugins": [p.name for p in heard]}), Actor.system())
            return []
        return heard

    def ask(self, plugin: Plugin, event: Event, environment_id: int, within: float) -> PluginAnswer:
        if not self.hashes.intact(plugin, environment_id):
            return PluginAnswer()
        self.linked.notice(plugin, environment_id)
        environment = self.environments.find(environment_id).name if environment_id else ""
        try:
            answer = self.runner.ask(plugin, environment, self.protocol.line_of(event, environment, self.state_of(event)), within)
        except (PluginFault, OSError) as fault:
            self.faults.failed(plugin, environment_id, event.key, str(fault))
            return PluginAnswer()
        self.faults.answered(plugin, environment_id)
        if answer.cards or answer.commands:
            self.deferred.add(lambda: self.answers.apply(plugin, answer, environment, environment_id))
        return answer

    def later(self, plugin: Plugin, event: Event, environment_id: int) -> None:
        """Heard after the reply: a refusal here comes too late to hold anything and is recorded unanswered; a line waits for the agent's next hook."""
        answer = self.ask(plugin, event, environment_id, LATER)
        if answer.answer == "refuse":
            self.unanswered(plugin, event, environment_id, answer.reason)
        elif answer.tell:
            self.waiting(plugin, event, environment_id, answer.tell)

    def waiting(self, plugin: Plugin, event: Event, environment_id: int, words: str) -> None:
        """Kept for the agent the event was of, or for a row's the environment's live agent; with no agent, said to nobody and only recorded."""
        session = event.session if isinstance(event, AgentEvent) else self.live_session(environment_id)
        self.entries.save(Entry(environment_id=environment_id, kind=WAITING, actor=Actor.plugin(plugin.name), data={"plugin": plugin.name, "session": session, "event": event.key, "line": self.words.said(plugin, words), "delivered": not session}), Actor.plugin(plugin.name))

    def live_session(self, environment_id: int) -> str:
        with self.scope.of(environment_id):
            agent = self.agents.live()
        return agent.session if agent else ""

    def waiting_for(self, session: str) -> list[str]:
        """The lines plugins left for this agent since its last hook, each handed over once."""
        waiting = [e for e in self.entries.of_kind(WAITING, 200) if e.data.get("session") == session and not e.data.get("delivered")]
        for entry in waiting:
            self.entries.save(entry.with_(data={**entry.data, "delivered": True}), Actor.system())
        return [e.data["line"] for e in reversed(waiting)]

    def said(self, plugin: Plugin, event: Event, environment_id: int, how: str, words: str) -> None:
        self.entries.save(Entry(environment_id=environment_id, kind=SAID, actor=Actor.plugin(plugin.name), data={"plugin": plugin.name, "event": event.key, "how": how, "words": words}), Actor.plugin(plugin.name))

    def unanswered(self, plugin: Plugin, event: Event, environment_id: int, reason: str) -> None:
        self.entries.save(Entry(environment_id=environment_id, kind=UNANSWERED, actor=Actor.plugin(plugin.name), data={"plugin": plugin.name, "event": event.key, "reason": reason}), Actor.system())

    def state_of(self, event: Event) -> str:
        if not isinstance(event, AgentEvent):
            return ""
        agents = self.agents.where(session=event.session)
        return agents[0].state if agents else ""
