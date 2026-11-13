import json
from pathlib import Path

from engine.agent.agent_checkouts import AgentCheckouts
from engine.checkout.checkout_file import CheckoutFile
from engine.enums.event_form import EventForm
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.plugins.support.plugin_answer import OLD_TYPE_KEY
from core.modules.plugins.commands.deliver_file_edit.deliver_file_edit import DeliverFileEdit
from core.modules.plugins.commands.deliver_plugin_event.deliver_plugin_event import DeliverPluginEvent
from core.modules.plugins.support.runnable_plugins import RunnablePlugins

FILE_EDITED = "file_edited"


class DeliverFileEditHandler(Handler[DeliverFileEdit, None]):
    """Delivers a file change to each plugin that hears it for the agent's role."""

    command = DeliverFileEdit

    def __init__(self, runnable: RunnablePlugins, queries: Queries, bus: Bus, checkouts: AgentCheckouts) -> None:
        self.runnable, self.queries, self.bus, self.checkouts = runnable, queries, bus, checkouts

    def handle(self, command: DeliverFileEdit, context: Context) -> None:
        agent = self.queries.query(Agent).find(command.agent_id)
        receivers = [runnable for runnable in self.runnable.running() if FILE_EDITED in runnable.manifest.event_names and (agent.is_main or runnable.manifest.reaches_role(FILE_EDITED, agent.role))]
        if not receivers:
            return
        file_path = Path(command.folder) / command.path
        file = CheckoutFile.located(self.checkouts.file_checkout(command.agent_id, file_path), file_path)
        data = json.dumps({"path": command.path, "type": "edit", OLD_TYPE_KEY: "edit", "lines": [dict(row) for row in command.lines], "cwd": command.folder, "file": file.values()})
        for runnable in receivers:
            manifest = runnable.manifest
            declared_event = manifest.declared_event(FILE_EDITED, EventForm.COMMIT) or manifest.declared_event(FILE_EDITED, EventForm.GUARD)
            self.bus.dispatch(DeliverPluginEvent(runnable.plugin.id, command.agent_id, declared_event.key if declared_event else FILE_EDITED, data, declared_event.script if declared_event else ""), context)
