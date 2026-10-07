import threading
from pathlib import Path

from features.base import Feature
from features.journal import Journal
from features.plugins import services
from features.plugins.commands import ClearLog, Configure, Disable, Enable, Install, Preview, Purge, Raise, Upgrade
from features.plugins.details import PluginsDetails
from features.plugins.host import watch
from features.plugins.fitting import SuggestFittingPlugins
from engine.gates import CANCELABLE
from features.plugins.parts import AskPluginsToCancel, AskPluginsToRefuse, ClearRemovedPlugin, KeepPluginRows, ReadLinkedManifests, PluginChatRules
from features.plugins.routes import get_pages, get_plugin_dashboard, get_plugin_log, get_services, post_plugin_upgrade_preview, post_plugins_preview


class Plugins(Feature):
    details = PluginsDetails

    def register(self, journal: Journal) -> None:
        journal.routes.add(get_plugin_dashboard, get_pages, get_services, post_plugins_preview, post_plugin_upgrade_preview, get_plugin_log)
        for command in (Preview(), Install(), Upgrade(), Enable(), Disable(), Configure(), Raise(), Purge(), ClearLog()):
            journal.commands.add("plugin", command)
        journal.client.formatter(PluginChatRules())
        journal.agent.interceptor(AskPluginsToRefuse())
        for event in CANCELABLE:
            journal.agent.canceler(AskPluginsToCancel(event))
        journal.events.handler(ClearRemovedPlugin())
        journal.events.handler(ReadLinkedManifests())
        journal.events.handler(SuggestFittingPlugins())
        for action in ("delete", "complete"):
            journal.commands.intercept(action, KeepPluginRows())

    def host(self, root: Path) -> None:
        threading.Thread(target=watch, args=(Path(root), self.journal), daemon=True).start()
        threading.Thread(target=services.keep, args=(Path(root), self), daemon=True).start()
