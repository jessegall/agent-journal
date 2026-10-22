from functools import partial

from journal.events.listener import Listener
from journal.events.worker_merge_event import WorkerMergeEvent
from journal.features.plugins.support.plugin_relay import PluginRelay
from journal.features.plugins.support.protocol import Protocol
from journal.repositories.setting_rows import SettingRows
from journal.support.decision import Decision
from journal.support.listener_queue import ListenerQueue


class PluginMergeRelay(Listener[WorkerMergeEvent]):
    """The plugins that hear a worker's merge: one that holds worker_merging is asked before the branch is merged, inside its window, and its refusal holds the merge with its reason; every other one hears it, and worker_merge_landed, after the reply."""

    def __init__(self, relay: PluginRelay, deferred: ListenerQueue, settings: SettingRows) -> None:
        self.relay, self.deferred, self.settings = relay, deferred, settings

    def handle(self, event: WorkerMergeEvent) -> Decision:
        from journal.features.plugins.feature import PluginsFeature
        ceiling_ms = self.settings.integer(PluginsFeature.PLUGIN_ANSWER_WINDOW)
        decision = Decision()
        for plugin in self.relay.listeners(event, event.environment_id):
            key = Protocol.published_name(event)
            if decision.allowed and plugin.manifest.has_window(key):
                answer = self.relay.ask(plugin, event, event.environment_id, plugin.manifest.window_ms(key, ceiling_ms) / 1000)
                decision = decision.merged(Decision.refuse(f"{plugin.name}: {answer.reason}") if answer.answer == "refuse" else Decision())
            else:
                self.deferred.add_bounded(partial(self.relay.postponed, plugin, event, event.environment_id), f"{plugin.name} relay {key}")
        return decision
