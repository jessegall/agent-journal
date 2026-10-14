import threading
from pathlib import Path

from controllers.types import Plugins as PluginRows, Todos
from events.agents import ClockTicked
from events.answers import Allowed, Refused as Refusing, Rewritten
from events.asking import AgentDispatching, LongCommandMoving, TextFormatting, ToolCallAsked
from resources.cancels import DISPATCHING
from expects import WHEN, Answered, Dispatches, Given, Kept, Ran, Refused, Updated, answering, nothing
from framework.base import Feature
from payload import BashCall, Dispatch
from resources.base import SYSTEM, USER
from resources.types import AgentRow, Plugin, Todo
from framework.journal import Journal
from framework.plugins import services, updates
from framework.plugins.commands import ClearLog, Configure, Disable, Enable, Install, Preview, Purge, Raise, Settle, Upgrade
from features.plugins.details import PluginsDetails
from framework.plugins.host import watch
from features.plugins.answering import ApplyPluginChatRules, AskPluginsToCancel, AskPluginsToKeepLongCommand, AskPluginsToRefuse
from features.plugins.handlers import ClearRemovedPlugin, ReadLinkedManifests, SuggestFittingPlugins
from features.plugins.listeners import SpotChangedManifests, SpotFittingPlugins, SpotRemovedPlugin
from framework.plugins.parts import KeepPluginRows
from features.plugins.working import PluginsWork
from events.plugins import PluginCompleted, PluginManifestChanged, PluginRemoved, PluginsWorthOffering
from framework.plugins.routes import get_pages, get_plugin_dashboard, get_plugin_log, get_services, post_plugin_upgrade_preview, post_plugins_preview


OFF = Plugin(n=1, title="Pulse", data={"enabled": False})
ON = Plugin(n=1, title="Pulse", data={"enabled": True})
NAMED_ON = Plugin(n=1, title="Pulse named", data={"enabled": True, "manifest": {"name": "pulse", "version": "1.0.0"}})
NAMED = Plugin(n=7, title="Pulse beat", data={"enabled": True, "manifest": {"name": "pulse", "version": "1.0.0"}})
NOT_A_SOURCE = "'nonsense' is neither a repository URL, an owner/repo, nor a folder on this machine"
OWNED = Todo(n=5, title="Check the pulse", data={"plugin": "pulse", "locked": True})
MOVING = LongCommandMoving(session="claude-1", command="npm test", seconds=40)
DISPATCH = AgentDispatching(session="claude-1", kind="general-purpose", model="sonnet", model_supported=True)


class Plugins(PluginsWork, Feature):
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
        journal.events.answer(TextFormatting, ApplyPluginChatRules(), expects=[
            Given(TextFormatting(text="plain words"), rows=[ON]) >> Answered(Rewritten("plain words")),
        ])
        journal.events.answer(ToolCallAsked, AskPluginsToRefuse(), expects=[
            Given(ToolCallAsked(tool="Bash", input="ls", command="ls", session="claude-1"), rows=[ON]) >> Answered(Allowed()),
            Given(ToolCallAsked(tool="Bash", input="ls", command="ls", session="claude-1"), rows=[ON], own_work=answering({("refuse_call", "claude-1", "Bash", "", "ls", False): "pulse: the build is running"}))
                >> Answered(Refusing("pulse: the build is running")),
        ])
        journal.events.answer(AgentDispatching, AskPluginsToCancel(), expects=[
            Given(AgentDispatching(session="claude-1", kind="general-purpose", model="sonnet", model_supported=True), rows=[ON]) >> Answered(Allowed()),
            Given(AgentDispatching(session="claude-1", kind="general-purpose", model="sonnet", model_supported=True)) >> Answered(Allowed()),
            Given(DISPATCH, rows=[ON], own_work=answering({("cancel_call", DISPATCHING, DISPATCH): "pulse: hold the subagents"})) >> Answered(Refusing("pulse: hold the subagents")),
        ])
        journal.events.answer(LongCommandMoving, AskPluginsToKeepLongCommand(), expects=[
            Given(MOVING, rows=[ON]) >> Answered(Allowed()),
            Given(MOVING, rows=[ON], own_work=answering({("cancel_call", "agent.command.long", MOVING): "pulse: a build is running"}))
                >> Answered(Refusing("pulse: a build is running")),
        ])
        journal.events.listen(PluginCompleted, SpotRemovedPlugin(), expects=[
            Given(PluginCompleted(n=1, type="plugin", action="completed"), rows=[NAMED_ON]) >> Dispatches(PluginRemoved(plugin=1)),
            Given(PluginCompleted(n=1, type="plugin", action="completed"), rows=[NAMED_ON, Plugin(n=2, title="Pulse beat", data={"enabled": True, "manifest": {"name": "pulse", "version": "1.0.0"}})])
                >> Dispatches(nothing),
            Given(PluginCompleted(n=1, type="plugin", action="completed"), rows=[Plugin(n=1, title="Unnamed", data={"enabled": True})]) >> Dispatches(nothing),
        ])
        journal.events.handle(PluginRemoved, ClearRemovedPlugin(), expects=[
            Given(PluginRemoved(plugin=1), rows=[NAMED_ON]) >> Ran(("own work", "retire_plugin", 1)),
        ])
        journal.events.listen(ClockTicked, SpotChangedManifests(), expects=[
            Given(ClockTicked(agent=1), rows=[ON]) >> Dispatches(nothing),
        ])
        journal.events.handle(PluginManifestChanged, ReadLinkedManifests(), expects=[
            Given(PluginManifestChanged(plugin=1), rows=[ON]) >> Ran(("own work", "reread_manifest", 1)),
        ])
        journal.events.listen(ClockTicked, SpotFittingPlugins(), expects=[
            Given(ClockTicked(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"started": WHEN}), ON], own_work=answering({("fitting_wanted", 1): True}))
                >> Dispatches(PluginsWorthOffering(agent=1)),
            Given(ClockTicked(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"started": WHEN}), ON], own_work=answering({("fitting_wanted", 1): False})) >> Dispatches(nothing),
        ])
        journal.events.handle(PluginsWorthOffering, SuggestFittingPlugins(), expects=[
            Given(PluginsWorthOffering(agent=1), rows=[AgentRow(n=1, title="claude-1"), ON]) >> Ran(("own work", "look_for_fitting")),
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
