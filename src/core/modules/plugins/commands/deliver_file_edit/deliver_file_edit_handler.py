import json

from core.base.agent_role import AgentRole
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.plugins.commands.deliver_file_edit.deliver_file_edit import DeliverFileEdit
from core.modules.plugins.commands.deliver_plugin_event.deliver_plugin_event import DeliverPluginEvent
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest

FILE_EDITED = "file_edited"


class DeliverFileEditHandler(Handler[DeliverFileEdit, None]):
    """Delivers a file change to each plugin that hears it for the agent's role."""

    command = DeliverFileEdit

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, queries: Queries, bus: Bus) -> None:
        self.plugins, self.folders, self.queries, self.bus = plugins, folders, queries, bus

    def handle(self, command: DeliverFileEdit, context: Context) -> None:
        role = self.queries.query(Agent).find(command.agent_id).role
        data = json.dumps({"path": command.path, "type": "edit", "lines": [dict(row) for row in command.lines], "cwd": command.folder})
        for plugin in self.plugins.enabled_ones():
            manifest = PluginManifest.read(self.folders.code(plugin.name))
            if FILE_EDITED in manifest.event_names and (role == AgentRole.MAIN or manifest.reaches_role(FILE_EDITED, role)):
                self.bus.dispatch(DeliverPluginEvent(plugin.id, command.agent_id, FILE_EDITED, data), context)
