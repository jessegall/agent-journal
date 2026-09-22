import threading
from pathlib import Path

from features.base import Feature
from features.journal import Journal
from features.plugins import services
from features.plugins.commands import Configure, Disable, Enable, Install, Preview, Purge, Upgrade
from features.plugins.details import PluginsDetails
from features.plugins.host import watch
from features.plugins.parts import AskPluginsToRefuse, ClearRemovedPlugin, PluginChatRules


class Plugins(Feature):
    details = PluginsDetails

    def register(self, journal: Journal) -> None:
        for command in (Preview(), Install(), Upgrade(), Enable(), Disable(), Configure(), Purge()):
            journal.commands.add("plugin", command)
        journal.client.formatter(PluginChatRules())
        journal.agent.interceptor(AskPluginsToRefuse())
        journal.events.handler(ClearRemovedPlugin())

    def host(self, root: Path) -> None:
        threading.Thread(target=watch, args=(Path(root), self.journal), daemon=True).start()
        services.watch(Path(root), self)
