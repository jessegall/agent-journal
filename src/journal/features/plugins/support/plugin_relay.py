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
from journal.features.plugins.support.plugin_text import PluginText
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
from journal.support.listener_queue import ListenerQueue

LATER = 10
UNANSWERED = "plugin_unanswered"
WAITING = "plugin_line_waiting"
PLUGIN_LINE_KIND = "plugin_said"
CUT = "plugin_cut"


class PluginRelay:
    """Which plugins hear an event, and one plugin asked about it: the line built where the event happened, and a fault recorded, never raised."""

    def __init__(self, plugins: Plugins, runner: PluginRunner, protocol: Protocol, faults: PluginFaults, environments: Environments, agents: Agents, entries: Entries, answers: PluginAnswers, steps: PluginSteps, deferred: ListenerQueue, hashes: PluginHashes, linked: LinkedManifests, text: PluginText, scope: Scope) -> None:
        self.plugins, self.runner, self.protocol, self.faults, self.answers, self.steps = plugins, runner, protocol, faults, answers, steps
        self.environments, self.agents, self.entries, self.deferred, self.hashes, self.linked = environments, agents, entries, deferred, hashes, linked
        self.text, self.scope = text, scope

    def listeners(self, event: Event, environment_id: int) -> list[Plugin]:
        hearers = [p for p in self.plugins.enabled() if Protocol.published_name(event) in p.manifest.hears and getattr(event, "actor", None) != Actor.plugin(p.name)]
        if hearers and self.steps.is_nested_deep():
            self.entries.save(Entry(environment_id=environment_id, kind=CUT, actor=Actor.system(), data={"event": Protocol.published_name(event), "by": getattr(event, "actor", Actor.system()).stamp, "plugins": [p.name for p in hearers]}), Actor.system())
            return []
        return hearers

    def ask(self, plugin: Plugin, event: Event, environment_id: int, within: float) -> PluginAnswer:
        if not self.hashes.intact(plugin, environment_id):
            return PluginAnswer()
        self.linked.notice(plugin, environment_id)
        environment = self.environments.find(environment_id).name if environment_id else ""
        try:
            answer = self.runner.ask(plugin, environment, self.protocol.event_line(event, environment, self.agent_state(event)), within)
        except WindowMissed as missed:
            self.unanswered(plugin, event, environment_id, str(missed))
            return PluginAnswer()
        except (PluginFault, OSError) as fault:
            self.faults.failed(plugin, environment_id, Protocol.published_name(event), str(fault))
            return PluginAnswer()
        self.faults.answered(plugin, environment_id)
        self.applied(plugin, answer, environment, environment_id)
        return answer

    def applied(self, plugin: Plugin, answer: PluginAnswer, environment: str, environment_id: int) -> None:
        if answer.cards or answer.commands:
            self.deferred.add(lambda: self.answers.apply(plugin, answer, environment, environment_id))

    def postponed(self, plugin: Plugin, event: Event, environment_id: int) -> None:
        answer = self.ask(plugin, event, environment_id, LATER)
        if answer.answer == "refuse":
            self.unanswered(plugin, event, environment_id, answer.reason)
        elif answer.tell:
            self.waiting(plugin, event, environment_id, answer.tell)

    def waiting(self, plugin: Plugin, event: Event, environment_id: int, text: str) -> None:
        session = event.session if isinstance(event, AgentEvent) else self.current_session(environment_id)
        self.entries.save(Entry(environment_id=environment_id, kind=WAITING, actor=Actor.plugin(plugin.name), data={"plugin": plugin.name, "session": session, "event": Protocol.published_name(event), "line": self.text.line(plugin, text), "delivered": not session}), Actor.plugin(plugin.name))

    def queued_line(self, plugin: Plugin, environment_id: int, key: str, text: str) -> None:
        session = self.current_session(environment_id)
        self.entries.save(Entry(environment_id=environment_id, kind=WAITING, actor=Actor.plugin(plugin.name), data={"plugin": plugin.name, "session": session, "event": key, "line": self.text.line(plugin, text), "delivered": not session}), Actor.plugin(plugin.name))

    def current_session(self, environment_id: int) -> str:
        with self.scope.environment(environment_id):
            agent = self.agents.current()
        return agent.session if agent else ""

    def waiting_lines(self, session: str) -> list[str]:
        waiting = [e for e in self.entries.kind_entries(WAITING, 200) if e.data.get("session") == session and not e.data.get("delivered")]
        for entry in waiting:
            self.entries.save(entry.with_(data={**entry.data, "delivered": True}), Actor.system())
        return [e.data["line"] for e in reversed(waiting)]

    def line(self, plugin: Plugin, event: Event, environment_id: int, how: str, text: str) -> None:
        self.entries.save(Entry(environment_id=environment_id, kind=PLUGIN_LINE_KIND, actor=Actor.plugin(plugin.name), data={"plugin": plugin.name, "event": Protocol.published_name(event), "how": how, "words": text}), Actor.plugin(plugin.name))

    def unanswered(self, plugin: Plugin, event: Event, environment_id: int, reason: str) -> None:
        self.entries.save(Entry(environment_id=environment_id, kind=UNANSWERED, actor=Actor.plugin(plugin.name), data={"plugin": plugin.name, "event": Protocol.published_name(event), "reason": reason}), Actor.system())

    def agent_state(self, event: Event) -> str:
        if not isinstance(event, AgentEvent):
            return ""
        agents = self.agents.matching(session=event.session)
        return agents[0].state if agents else ""
