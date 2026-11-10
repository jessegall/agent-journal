from engine.actor.actor import Actor
from core.base.command.bus import Bus
from core.base.container import Container
from core.modules.plugins.commands.prune_plugin_deliveries.prune_plugin_deliveries import PrunePluginDeliveries


class DeliveryPruning:
    """The old plugin deliveries are pruned."""

    def __call__(self, container: Container) -> None:
        container.get(Bus).run(PrunePluginDeliveries(), Actor.core())
