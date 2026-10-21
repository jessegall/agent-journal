from journal.events.agent.agent_event import AgentEvent
from journal.events.event import Event
from journal.features.plugins.support.linked_manifests import LinkedManifests
from journal.features.plugins.support.plugin_answers import PluginAnswers
from journal.features.plugins.support.plugin_fault import PluginFault
from journal.features.plugins.support.plugin_faults import PluginFaults
from journal.features.plugins.support.window_missed import WindowMissed
from journal.features.plugins.support.plugin_hashes import PluginHashes
from journal.features.plugins.support.plugin_runner import PluginRunner
from journal.features.plugins.support.plugin_steps import PluginSteps
from journal.features.plugins.support.plugin_words import PluginWords
from journal.features.plugins.support.protocol import Protocol
from journal.support.actor import Actor
from journal.models.entry import Entry
from journal.models.plugin import Plugin
from journal.features.plugins.support.plugin_answer import PluginAnswer
from journal.repositories.agents import Agents
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.repositories.plugins import Plugins
from journal.support.scope import Scope
from journal.support.deferred import Deferred

LATER = 10
UNANSWERED = "plugin_unanswered"
WAITING = "plugin_line_waiting"
SAID = "plugin_said"
CUT = "plugin_cut"


class PluginRelay:
    """Which plugins hear an event, and one plugin asked about it: the line built where the event happened, and a fault recorded, never raised."""

    def __init__(self, plugins: Plugins, runner: PluginRunner, protocol: Protocol, faults: PluginFaults, environments: Environments, agents: Agents, entries: Entries, answers: PluginAnswers, steps: PluginSteps, deferred: Deferred, hashes: PluginHashes, linked: LinkedManifests, words: PluginWords, scope: Scope) -> None:
        self.plugins, self.runner, self.protocol, self.faults, self.answers, self.steps = plugins, runner, protocol, faults, answers, steps
        self.environments, self.agents, self.entries, self.deferred, self.hashes, self.linked = environments, agents, entries, deferred, hashes, linked
        self.words, self.scope = words, scope

    def heard_by(self, event: Event, environment_id: int) -> list[Plugin]:
        hearers = [p for p in self.plugins.enabled() if event.key in p.manifest.hears and getattr(event, "actor", None) != Actor.plugin(p.name)]
        if hearers and self.steps.too_deep():
            self.entries.save(Entry(environment_id=environment_id, kind=CUT, actor=Actor.system(), data={"event": event.key, "by": getattr(event, "actor", Actor.system()).stamp, "plugins": [p.name for p in hearers]}), Actor.system())
            return []
        return hearers

    def ask(self, plugin: Plugin, event: Event, environment_id: int, within: float) -> PluginAnswer:
        if not self.hashes.intact(plugin, environment_id):
            return PluginAnswer()
        self.linked.notice(plugin, environment_id)
        environment = self.environments.find(environment_id).name if environment_id else ""
        try:
            answer = self.runner.ask(plugin, environment, self.protocol.line_of(event, environment, self.state_of(event)), within)
        except WindowMissed as missed:
            self.unanswered(plugin, event, environment_id, str(missed))
            return PluginAnswer()
        except (PluginFault, OSError) as fault:
            self.faults.failed(plugin, environment_id, event.key, str(fault))
            return PluginAnswer()
        self.faults.answered(plugin, environment_id)
        self.applied(plugin, answer, environment, environment_id)
        return answer

    def applied(self, plugin: Plugin, answer: PluginAnswer, environment: str, environment_id: int) -> None:
        if answer.cards or answer.commands:
            self.deferred.add(lambda: self.answers.apply(plugin, answer, environment, environment_id))

    def later(self, plugin: Plugin, event: Event, environment_id: int) -> None:
        answer = self.ask(plugin, event, environment_id, LATER)
        if answer.answer == "refuse":
            self.unanswered(plugin, event, environment_id, answer.reason)
        elif answer.tell:
            self.waiting(plugin, event, environment_id, answer.tell)

    def waiting(self, plugin: Plugin, event: Event, environment_id: int, words: str) -> None:
        session = event.session if isinstance(event, AgentEvent) else self.live_session(environment_id)
        self.entries.save(Entry(environment_id=environment_id, kind=WAITING, actor=Actor.plugin(plugin.name), data={"plugin": plugin.name, "session": session, "event": event.key, "line": self.words.said(plugin, words), "delivered": not session}), Actor.plugin(plugin.name))

    def queued_line(self, plugin: Plugin, environment_id: int, key: str, words: str) -> None:
        session = self.live_session(environment_id)
        self.entries.save(Entry(environment_id=environment_id, kind=WAITING, actor=Actor.plugin(plugin.name), data={"plugin": plugin.name, "session": session, "event": key, "line": self.words.said(plugin, words), "delivered": not session}), Actor.plugin(plugin.name))

    def live_session(self, environment_id: int) -> str:
        with self.scope.of(environment_id):
            agent = self.agents.live()
        return agent.session if agent else ""

    def waiting_for(self, session: str) -> list[str]:
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
