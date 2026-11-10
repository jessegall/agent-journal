import json

from engine.change.journal_booting import JournalBooting
from engine.change.logged_event import LoggedEvent
from engine.change.registry_synced import RegistrySynced
from engine.change.upgrade_finished import UpgradeFinished
from engine.change.upgrade_moved import UpgradeMoved
from engine.command.bus import Bus
from engine.listener.commit_listener import CommitListener
from engine.enums.event_form import EventForm
from engine.module.module_actors import ModuleActors
from engine.query.queries import Queries
from engine.registry.registry import Registry
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.plugins.commands.deliver_plugin_event.deliver_plugin_event import DeliverPluginEvent
from core.modules.plugins.support.plugin_payload import PluginPayload
from core.modules.plugins.support.plugin_subscriptions import PluginSubscriptions
from core.modules.plugins.support.plugins_module_name import MODULE_NAME
from core.modules.settings.support.managed_hook_changed import ManagedHookChanged
from core.modules.settings.support.managed_hook_restored import ManagedHookRestored
from core.modules.settings.support.managed_hook_scanned import ManagedHookScanned


class SystemEventDeliveryListener(CommitListener[JournalBooting | RegistrySynced | UpgradeMoved | UpgradeFinished | ManagedHookChanged | ManagedHookScanned | ManagedHookRestored]):
    """Saves plugin deliveries for system and file events."""

    name = "plugins.system-event-delivery"

    def __init__(self, subscriptions: PluginSubscriptions, bus: Bus, actors: ModuleActors, registry: Registry, queries: Queries) -> None:
        self.subscriptions, self.bus, self.actors, self.registry, self.queries = subscriptions, bus, actors, registry, queries

    def handle(self, event: object, logged: LoggedEvent) -> None:
        subscriptions = self.subscriptions.scripts(logged.event, EventForm.COMMIT)
        if not subscriptions:
            return
        key = self.registry.event_key(logged.event)
        data = json.dumps(PluginPayload.logged(logged, self.queries.query(ActorRecord).find(logged.actor_id).type.value, {}, {}))
        for subscription in subscriptions:
            self.bus.run(DeliverPluginEvent(subscription.plugin_id, None, key, data, subscription.script, logged.id, logged.environment_id), self.actors.actor(MODULE_NAME), cause_id=logged.id)
