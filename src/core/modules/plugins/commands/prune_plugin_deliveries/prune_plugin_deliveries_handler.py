from datetime import timedelta

from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.plugins.commands.prune_plugin_deliveries.prune_plugin_deliveries import PrunePluginDeliveries
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.plugin_delivery import PluginDelivery

PRUNE_REASON = "pruning keeps the newest deliveries of a plugin and removes every older one"

KEPT_DELIVERY_DAYS = 7
KEPT_DELIVERIES = 50


class PrunePluginDeliveriesHandler(Handler[PrunePluginDeliveries, int]):
    """Deletes old plugin deliveries beyond the number kept."""

    command = PrunePluginDeliveries

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: PrunePluginDeliveries, context: Context) -> int:
        cutoff = context.timestamp.value - timedelta(days=KEPT_DELIVERY_DAYS)
        old: list[PluginDelivery] = []
        for plugin in tuple(self.queries.query(Plugin).get()):
            rows = tuple(sorted(self.queries.query(PluginDelivery).filter(plugin_id=plugin.id).every_row(PRUNE_REASON), key=lambda row: row.id, reverse=True))
            old += [row for row in rows[KEPT_DELIVERIES:] if row.creation_timestamp().value < cutoff]
        for row in old:
            self.repository.delete(row, context)
        return len(old)
