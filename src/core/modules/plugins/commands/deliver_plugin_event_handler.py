from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.plugins.commands.deliver_plugin_event import DeliverPluginEvent
from core.modules.plugins.models.plugin_delivery import PluginDelivery


class DeliverPluginEventHandler(Handler[DeliverPluginEvent, PluginDelivery]):
    """Saves the delivery, which its listener runs once the hook has committed."""

    command = DeliverPluginEvent

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: DeliverPluginEvent, context: Context) -> PluginDelivery:
        return self.repository.save(PluginDelivery(plugin_id=command.plugin_id, environment_id=command.environment_id, creator_id=context.actor.id,
                                                   event=command.event, data=command.data), context)
