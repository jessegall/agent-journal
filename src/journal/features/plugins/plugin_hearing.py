from journal.events.agent.agent_event import AgentEvent
from journal.events.event import Event
from journal.features.plugins.linked_manifests import LinkedManifests
from journal.features.plugins.plugin_answers import PluginAnswers
from journal.features.plugins.plugin_fault import PluginFault
from journal.features.plugins.plugin_faults import PluginFaults
from journal.features.plugins.plugin_hashes import PluginHashes
from journal.features.plugins.plugin_runner import PluginRunner
from journal.features.plugins.plugin_steps import PluginSteps
from journal.features.plugins.protocol import Protocol
from journal.models.actor import Actor
from journal.models.entry import Entry
from journal.models.plugin import Plugin
from journal.models.plugin_answer import PluginAnswer
from journal.repositories.agents import Agents
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.repositories.plugins import Plugins
from journal.hooks.deferred import Deferred

LATER = 10
"""Seconds a plugin has to answer an event it hears after the reply."""
UNANSWERED = "plugin_unanswered"
SAID = "plugin_said"
"""The entry a plugin's hold or line to the agent leaves: the event, held or told, and the words."""
CUT = "plugin_cut"
"""The entry a row leaves that no plugin heard because plugin commands led to it more than a step deep."""


class PluginHearing:
    """Which plugins hear an event, and one plugin asked about it: the line built where the event happened, and a fault recorded, never raised."""

    def __init__(self, plugins: Plugins, runner: PluginRunner, protocol: Protocol, faults: PluginFaults, environments: Environments, agents: Agents, entries: Entries, answers: PluginAnswers, steps: PluginSteps, deferred: Deferred, hashes: PluginHashes, linked: LinkedManifests) -> None:
        self.plugins, self.runner, self.protocol, self.faults, self.answers, self.steps = plugins, runner, protocol, faults, answers, steps
        self.environments, self.agents, self.entries, self.deferred, self.hashes, self.linked = environments, agents, entries, deferred, hashes, linked

    def heard_by(self, event: Event, environment_id: int) -> list[Plugin]:
        """The enabled plugins that hear it, in the order they were installed; never the plugin that wrote the row, and none past a step of plugin commands, the cut recorded."""
        heard = [p for p in self.plugins.enabled() if event.key in p.manifest.get("hears", ()) and getattr(event, "by", None) != Actor.plugin(p.name)]
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
        """Heard after the reply: a refusal here comes too late to hold anything and is recorded unanswered."""
        answer = self.ask(plugin, event, environment_id, LATER)
        if answer.answer == "refuse":
            self.unanswered(plugin, event, environment_id, answer.reason)

    def said(self, plugin: Plugin, event: Event, environment_id: int, how: str, words: str) -> None:
        self.entries.save(Entry(environment_id=environment_id, kind=SAID, actor=Actor.plugin(plugin.name), data={"plugin": plugin.name, "event": event.key, "how": how, "words": words}), Actor.plugin(plugin.name))

    def unanswered(self, plugin: Plugin, event: Event, environment_id: int, reason: str) -> None:
        self.entries.save(Entry(environment_id=environment_id, kind=UNANSWERED, actor=Actor.plugin(plugin.name), data={"plugin": plugin.name, "event": event.key, "reason": reason}), Actor.system())

    def state_of(self, event: Event) -> str:
        if not isinstance(event, AgentEvent):
            return ""
        agents = self.agents.where(session=event.session)
        return agents[0].state if agents else ""
