import threading
from pathlib import Path

from features.base import Feature
from features.journal import Journal
from features.plugins import services
from features.plugins.commands import ClearLog, Configure, Disable, Enable, Install, Preview, Purge, Raise, Upgrade
from features.plugins.details import PluginsDetails
from features.plugins.host import watch
from engine.hooks import CANCELABLE
from features.plugins.parts import AskPluginsToCancel, AskPluginsToRefuse, ClearRemovedPlugin, KeepPluginRows, ReadLinkedManifests, OneRowPerTitle, PluginChatRules


class Plugins(Feature):
    details = PluginsDetails

    def register(self, journal: Journal) -> None:
        for command in (Preview(), Install(), Upgrade(), Enable(), Disable(), Configure(), Raise(), Purge(), ClearLog()):
            journal.commands.add("plugin", command)
        journal.client.formatter(PluginChatRules())
        journal.agent.interceptor(AskPluginsToRefuse())
        for event in CANCELABLE:
            journal.agent.canceler(AskPluginsToCancel(event))
        journal.events.handler(ClearRemovedPlugin())
        journal.events.handler(ReadLinkedManifests())
        for action in ("delete", "complete"):
            journal.commands.intercept(action, KeepPluginRows())
        journal.commands.intercept("create", OneRowPerTitle())

    def host(self, root: Path) -> None:
        threading.Thread(target=watch, args=(Path(root), self.journal), daemon=True).start()
        services.watch(Path(root), self)
