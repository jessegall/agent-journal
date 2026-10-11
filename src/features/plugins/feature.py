import threading
from pathlib import Path

from controllers.types import Plugins as PluginRows
from expects import Answered, Formats, Given, Kept, Refused, Updated
from features.base import Feature
from providers.payload import Dispatch
from resources.types import Plugin
from features.journal import Journal
from features.plugins import services, updates
from features.plugins.commands import ClearLog, Configure, Disable, Enable, Install, Preview, Purge, Raise, Settle, Upgrade
from features.plugins.details import PluginsDetails
from features.plugins.host import watch
from features.plugins.fitting import SuggestFittingPlugins
from engine.gates import CANCELABLE
from features.plugins.parts import AskPluginsToCancel, AskPluginsToRefuse, ClearRemovedPlugin, KeepPluginRows, ReadLinkedManifests, PluginChatRules
from features.plugins.routes import get_pages, get_plugin_dashboard, get_plugin_log, get_services, post_plugin_upgrade_preview, post_plugins_preview


OFF = Plugin(n=1, title="Pulse", data={"enabled": False})
ON = Plugin(n=1, title="Pulse", data={"enabled": True})


class Plugins(Feature):
    details = PluginsDetails

    def register(self, journal: Journal) -> None:
        journal.routes.add(get_plugin_dashboard, get_pages, get_services, post_plugins_preview, post_plugin_upgrade_preview, get_plugin_log)
        for command in (Preview(), Install(), Upgrade(), ClearLog()):
            journal.commands.add("plugin", command)
        journal.commands.add("plugin", Enable(), expects=[
            Given((PluginRows, 1), rows=[OFF]) >> Updated(Plugin(n=1), enabled=True),
            Given((PluginRows, 1), rows=[ON]) >> Updated(Plugin(n=1), enabled=True),
        ])
        journal.commands.add("plugin", Disable(), expects=[
            Given((PluginRows, 1), rows=[ON]) >> Updated(Plugin(n=1), enabled=False),
            Given((PluginRows, 1), rows=[OFF]) >> Updated(Plugin(n=1), enabled=False),
        ])
        journal.commands.add("plugin", Configure(), expects=[
            Given((PluginRows, 1, "color", "red"), rows=[ON]) >> Refused(" has no setting 'color'; it has none"),
        ])
        journal.commands.add("plugin", Raise(), expects=[
            Given((PluginRows, "pulse", "warn", "Something is off"), rows=[ON]) >> Refused("pulse declares no event warn"),
        ])
        journal.commands.add("plugin", Settle(), expects=[
            Given((PluginRows, "pulse", "key-1"), rows=[ON]) >> Answered("0 marks of pulse settled as fixed"),
            Given((PluginRows, "pulse", "key-1", "dismissed"), rows=[ON]) >> Answered("0 marks of pulse settled as dismissed"),
        ])
        journal.commands.add("plugin", Purge(), expects=[
            Given((PluginRows, 1), rows=[ON]) >> Refused("plugin 1 is installed: remove it first"),
        ])
        journal.client.formatter(PluginChatRules(), expects=[
            Formats("plain words", to="plain words"),
        ])
        journal.agent.interceptor(AskPluginsToRefuse())
        for event in CANCELABLE:
            journal.agent.canceler(AskPluginsToCancel(event), expects=[
            Given(Dispatch("general-purpose", "sonnet", True), rows=[ON]) >> Kept(),
            Given(Dispatch("general-purpose", "sonnet", True)) >> Kept(),
        ])
        journal.events.handler(ClearRemovedPlugin())
        journal.events.handler(ReadLinkedManifests())
        journal.events.handler(SuggestFittingPlugins())
        for action in ("delete", "complete"):
            journal.commands.intercept(action, KeepPluginRows())

    def host(self, root: Path) -> None:
        threading.Thread(target=watch, args=(Path(root), self.journal), daemon=True).start()
        threading.Thread(target=services.keep, args=(Path(root), self), daemon=True).start()
        threading.Thread(target=updates.keep, args=(Path(root),), daemon=True).start()
