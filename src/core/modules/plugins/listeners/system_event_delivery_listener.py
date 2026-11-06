import json

from core.base.change.journal_booting import JournalBooting
from core.base.change.logged_event import LoggedEvent
from core.base.change.registry_synced import RegistrySynced
from core.base.change.upgrade_finished import UpgradeFinished
from core.base.change.upgrade_moved import UpgradeMoved
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.model.event_form import EventForm
from core.base.module.module_actors import ModuleActors
from core.base.registry.registry import Registry
from core.modules.plugins.commands.deliver_plugin_event.deliver_plugin_event import DeliverPluginEvent
from core.modules.plugins.support.plugin_subscriptions import PluginSubscriptions
from core.modules.plugins.support.plugins_module_name import MODULE_NAME
from core.modules.settings.support.managed_hook_changed import ManagedHookChanged
from core.modules.settings.support.managed_hook_restored import ManagedHookRestored
from core.modules.settings.support.managed_hook_scanned import ManagedHookScanned


class SystemEventDeliveryListener(CommitListener[JournalBooting | RegistrySynced | UpgradeMoved | UpgradeFinished | ManagedHookChanged | ManagedHookScanned | ManagedHookRestored]):
    """Saves a delivery for each commit script on a system or file event, which passes no save listener. It has no row,
    so the line holds what the log holds."""

    name = "plugins.system-event-delivery"

    def __init__(self, subscriptions: PluginSubscriptions, bus: Bus, actors: ModuleActors, registry: Registry) -> None:
        self.subscriptions, self.bus, self.actors, self.registry = subscriptions, bus, actors, registry

    def handle(self, event: object, logged: LoggedEvent) -> None:
        key = self.registry.event_key(logged.event)
        data = json.dumps({"form": EventForm.COMMIT.value, "final": True, "log_name": logged.event, "event_id": logged.id, "actor": {"id": logged.actor_id}, "command": logged.command,
                           "cause_id": logged.cause_id, "row": {}, "old_row": {}, "changed": {name: list(values) for name, values in logged.data.items()}})
        for subscription in self.subscriptions.scripts(logged.event, EventForm.COMMIT):
            self.bus.run(DeliverPluginEvent(subscription.plugin_id, None, key, data, subscription.script, logged.id, logged.environment_id), self.actors.actor(MODULE_NAME), cause_id=logged.id)
