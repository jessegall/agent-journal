from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.plugins.commands.clear_plugin_faults import ClearPluginFaults
from core.modules.plugins.models.plugin import Plugin


class ClearPluginFaultsHandler(Handler[ClearPluginFaults, Plugin]):
    """Sets a plugin's faults in a row back to none and ends its failing."""

    command = ClearPluginFaults

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: ClearPluginFaults, context: Context) -> Plugin:
        return self.repository.save(self.queries.query(Plugin).find(command.plugin_id).changed(fault_count=0, failing=False), context)
