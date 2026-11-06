import json

from core.base.agent_role import AgentRole
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.plugins.support.plugin_answer import OLD_TYPE_KEY
from core.modules.plugins.commands.deliver_file_edit.deliver_file_edit import DeliverFileEdit
from core.modules.plugins.commands.deliver_plugin_event.deliver_plugin_event import DeliverPluginEvent
from core.modules.plugins.support.runnable_plugins import RunnablePlugins

FILE_EDITED = "file_edited"


class DeliverFileEditHandler(Handler[DeliverFileEdit, None]):
    """Delivers a file change to each plugin that hears it for the agent's role."""

    command = DeliverFileEdit

    def __init__(self, runnable: RunnablePlugins, queries: Queries, bus: Bus) -> None:
        self.runnable, self.queries, self.bus = runnable, queries, bus

    def handle(self, command: DeliverFileEdit, context: Context) -> None:
        role = self.queries.query(Agent).find(command.agent_id).role
        data = json.dumps({"path": command.path, "type": "edit", OLD_TYPE_KEY: "edit", "lines": [dict(row) for row in command.lines], "cwd": command.folder})
        for runnable in self.runnable.running():
            manifest = runnable.manifest
            if FILE_EDITED in manifest.event_names and (role == AgentRole.MAIN or manifest.reaches_role(FILE_EDITED, role)):
                self.bus.dispatch(DeliverPluginEvent(runnable.plugin.id, command.agent_id, FILE_EDITED, data), context)
