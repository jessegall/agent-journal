import json
from pathlib import Path

from journal.events.agent.agent_event import AgentEvent
from journal.features.plugins.support.plugin_fault import PluginFault
from journal.features.plugins.support.plugin_faults import PluginFaults
from journal.features.plugins.support.plugin_folders import PluginFolders
from journal.features.plugins.support.plugin_relay import PluginRelay
from journal.features.plugins.support.protocol import Protocol
from journal.models.plugin import Plugin
from journal.repositories.environments import Environments

QUEUE = "queue"


class PluginQueue:
    """The folder a plugin writes what it found on its own time into, one file per line out with the environment it is for; drained at every hook, oldest file first, each file deleted once read."""

    def __init__(self, folders: PluginFolders, protocol: Protocol, faults: PluginFaults, relay: PluginRelay, environments: Environments) -> None:
        self.folders, self.protocol, self.faults, self.relay, self.environments = folders, protocol, faults, relay, environments

    def lines(self, plugin: Plugin, event: AgentEvent) -> list[str]:
        context = []
        for file in self.files(plugin):
            text = file.read_text()
            file.unlink()
            try:
                answer, environment_id = self.read(text, event.environment_id)
            except PluginFault as fault:
                self.faults.failed(plugin, event.environment_id, QUEUE, f"{file.name}: {fault}")
                continue
            self.relay.applied(plugin, answer, self.environments.find(environment_id).name, environment_id)
            if answer.answer == "refuse":
                self.relay.unanswered(plugin, event, environment_id, answer.reason)
            elif answer.tell and environment_id == event.environment_id:
                context.append(self.relay.words.said(plugin, answer.tell))
            elif answer.tell:
                self.relay.queued_line(plugin, environment_id, event.key, answer.tell)
        return context

    def files(self, plugin: Plugin) -> list[Path]:
        folder = self.folders.data(plugin) / QUEUE
        return sorted(folder.glob("*.json")) if folder.is_dir() else []

    def read(self, text: str, environment_id: int) -> tuple:
        try:
            data = json.loads(text)
        except json.JSONDecodeError as broken:
            raise PluginFault(f"not JSON: {broken}") from broken
        if not isinstance(data, dict):
            raise PluginFault("not a JSON object")
        name = str(data.pop("env", ""))
        rows = self.environments.matching(name=name) if name else []
        if name and not rows:
            raise PluginFault(f"env {name!r} names no environment")
        return self.protocol.answer_of(json.dumps(data)), rows[0].id if rows else environment_id
