from journal.events.agent.agent_event import AgentEvent
from journal.events.event import Event
from journal.features.plugins.plugin_fault import PluginFault
from journal.features.plugins.plugin_faults import PluginFaults
from journal.features.plugins.plugin_runner import PluginRunner
from journal.features.plugins.protocol import Protocol
from journal.models.actor import Actor
from journal.models.entry import Entry
from journal.models.plugin import Plugin
from journal.models.plugin_answer import PluginAnswer
from journal.repositories.agents import Agents
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.repositories.plugins import Plugins

LATER = 10
"""Seconds a plugin has to answer an event it hears after the reply."""
UNANSWERED = "plugin_unanswered"


class PluginHearing:
    """Which plugins hear an event, and one plugin asked about it: the line built where the event happened, and a fault recorded, never raised."""

    def __init__(self, plugins: Plugins, runner: PluginRunner, protocol: Protocol, faults: PluginFaults, environments: Environments, agents: Agents, entries: Entries) -> None:
        self.plugins, self.runner, self.protocol, self.faults = plugins, runner, protocol, faults
        self.environments, self.agents, self.entries = environments, agents, entries

    def heard_by(self, event: Event) -> list[Plugin]:
        """The enabled plugins that hear it, in the order they were installed; never the plugin that wrote the row."""
        return [p for p in self.plugins.enabled() if event.key in p.manifest.get("hears", ()) and getattr(event, "by", None) != Actor.plugin(p.name)]

    def ask(self, plugin: Plugin, event: Event, environment_id: int, within: float) -> PluginAnswer:
        environment = self.environments.find(environment_id).name if environment_id else ""
        try:
            answer = self.runner.ask(plugin, environment, self.protocol.line_of(event, environment, self.state_of(event)), within)
        except (PluginFault, OSError) as fault:
            self.faults.failed(plugin, environment_id, event.key, str(fault))
            return PluginAnswer()
        self.faults.answered(plugin, environment_id)
        return answer

    def later(self, plugin: Plugin, event: Event, environment_id: int) -> None:
        """Heard after the reply: a refusal here comes too late to hold anything and is recorded unanswered."""
        answer = self.ask(plugin, event, environment_id, LATER)
        if answer.answer == "refuse":
            self.entries.save(Entry(environment_id=environment_id, kind=UNANSWERED, actor=Actor.plugin(plugin.name), data={"plugin": plugin.name, "event": event.key, "reason": answer.reason}), Actor.system())

    def state_of(self, event: Event) -> str:
        if not isinstance(event, AgentEvent):
            return ""
        agents = self.agents.where(session=event.session)
        return agents[0].state if agents else ""
