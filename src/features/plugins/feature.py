import threading
from pathlib import Path

from controllers.types import Plugins as PluginRows, Todos
from events.agents import ClockTicked
from expects import WHEN, Answered, Formats, Given, Kept, Refused, Unchanged, Updated
from framework.base import Feature
from providers.payload import BashCall, Dispatch
from resources.base import SYSTEM, USER
from resources.types import AgentRow, Plugin, Todo
from framework.journal import Journal
from features.plugins import services, updates
from features.plugins.commands import ClearLog, Configure, Disable, Enable, Install, Preview, Purge, Raise, Settle, Upgrade
from features.plugins.details import PluginsDetails
from features.plugins.host import watch
from features.plugins.fitting import SuggestFittingPlugins
from engine.gates import CANCELABLE
from features.plugins.parts import AskPluginsToCancel, AskPluginsToRefuse, ClearRemovedPlugin, KeepPluginRows, ReadLinkedManifests, PluginChatRules
from events.plugins import PluginCompleted
from features.plugins.routes import get_pages, get_plugin_dashboard, get_plugin_log, get_services, post_plugin_upgrade_preview, post_plugins_preview


OFF = Plugin(n=1, title="Pulse", data={"enabled": False})
ON = Plugin(n=1, title="Pulse", data={"enabled": True})
NAMED = Plugin(n=7, title="Pulse beat", data={"enabled": True, "manifest": {"name": "pulse", "version": "1.0.0"}})
NOT_A_SOURCE = "'nonsense' is neither a repository URL, an owner/repo, nor a folder on this machine"
OWNED = Todo(n=5, title="Check the pulse", data={"plugin": "pulse", "locked": True})


class Plugins(Feature):
    details = PluginsDetails

    def register(self, journal: Journal) -> None:
        journal.routes.add(get_plugin_dashboard, get_pages, get_services, post_plugins_preview, post_plugin_upgrade_preview, get_plugin_log)
        journal.commands.add("plugin", Preview(), expects=[
            Given((PluginRows, "nonsense")) >> Refused(NOT_A_SOURCE),
        ])
        journal.commands.add("plugin", Install(), expects=[
            Given((PluginRows, "nonsense")) >> Refused(NOT_A_SOURCE),
        ])
        journal.commands.add("plugin", Upgrade(), expects=[
            Given((PluginRows, 99)) >> Refused("no plugin 99"),
        ])
        journal.commands.add("plugin", ClearLog(), expects=[
            Given((PluginRows, 7), rows=[NAMED]) >> Answered("pulse's log is empty"),
        ])
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
        journal.agent.interceptor(AskPluginsToRefuse(), expects=[
            Given(BashCall.from_payload("Bash", {"command": "ls"}, {}), rows=[ON]) >> Kept(),
        ])
        for event in CANCELABLE:
            journal.agent.canceler(AskPluginsToCancel(event), expects=[
            Given(Dispatch("general-purpose", "sonnet", True), rows=[ON]) >> Kept(),
            Given(Dispatch("general-purpose", "sonnet", True)) >> Kept(),
        ])
        journal.events.handler(ClearRemovedPlugin(), expects=[
            Given(PluginCompleted(n=1, type="plugin", action="completed"), rows=[ON]) >> Unchanged(),
        ])
        journal.events.handler(ReadLinkedManifests(), expects=[
            Given(ClockTicked(agent=1), rows=[ON]) >> Unchanged(),
        ])
        journal.events.handler(SuggestFittingPlugins(), expects=[
            Given(ClockTicked(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"started": WHEN}), ON]) >> Unchanged(),
        ])
        for action in ("delete", "complete"):
            journal.commands.intercept(action, KeepPluginRows(), expects=[
                Given((Todos, {"actor": USER}, {"n": 5}), rows=[NAMED, OWNED]) >> Refused("todo 5 belongs to the pulse plugin: it goes when the plugin is removed"),
                Given((Todos, {"actor": SYSTEM}, {"n": 5}), rows=[NAMED, OWNED]) >> Kept(),
                Given((Todos, {"actor": USER}, {"n": 5}), rows=[OWNED]) >> Kept(),
                Given((Todos, {"actor": USER}, {"n": 5}), rows=[NAMED, Todo(n=5, title="Check the pulse")]) >> Kept(),
            ])

    def host(self, root: Path) -> None:
        threading.Thread(target=watch, args=(Path(root), self.journal), daemon=True).start()
        threading.Thread(target=services.keep, args=(Path(root), self), daemon=True).start()
        threading.Thread(target=updates.keep, args=(Path(root),), daemon=True).start()
