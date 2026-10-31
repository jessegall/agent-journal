from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.plugins.commands.record_plugin_fault import RecordPluginFault
from core.modules.plugins.models.plugin import Plugin

FAILING_COUNT = 5


class RecordPluginFaultHandler(Handler[RecordPluginFault, Plugin]):
    """Counts a plugin's faults in a row and keeps the last one; the fifth marks it failing."""

    command = RecordPluginFault

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RecordPluginFault, context: Context) -> Plugin:
        plugin = self.queries.query(Plugin).find(command.plugin_id)
        count = plugin.fault_count + 1
        return self.repository.save(plugin.changed(last_fault=command.fault, fault_count=count, failing=plugin.failing or count >= FAILING_COUNT), context)
