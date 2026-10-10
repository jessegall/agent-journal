import json
import re
import threading
import time
from dataclasses import asdict, dataclass
from typing import ClassVar

from controllers.types import CONTROLLERS, Plugins
from engine import bus
from engine.events.engine import ClockTicked
from engine.events.resources import ResourceEvent
from engine.services import DOWN, want
from features.parts import ActionInterceptor, Canceler, Context, Handler, TextFormatter, ToolInterceptor
from engine.gates import Runs
from engine.wording import fill
from features.plugins.answer import apply
from features.plugins.lifecycle import changed_on_disk, clear, reread
from features.plugins.declared import called, declared, named
from features.plugins.environment import placed
from features.plugins.paths import folder, logged, plugin_socket
from features.plugins.payload import refusal
from features.plugins.run import PluginReply, asked, call
from features.plugins.skills import withdrawn
from providers import command_effects
from resources.base import OWNER, PLUGIN, SYSTEM
from engine.reach import Reach

ALTOGETHER = 5.0
HOOK_WAIT = 0.2


@dataclass(frozen=True)
class PluginRemoved(ResourceEvent):
    on: ClassVar[str] = "plugin.completed"


KEPT_RULES: dict[str, tuple] = {}


class PluginChatRules(TextFormatter):
    def format(self, context: Context, text: str) -> str:
        result = text
        for find, becomes in self.rules(context) if context.record else []:
            result = re.sub(find, becomes, result)
        return result

    def rules(self, context: Context) -> list:
        memo = context.record.memo
        if memo is not None and "plugin rules" in memo:
            return memo["plugin rules"]
        found = self.kept_rules(context)
        if memo is not None:
            memo["plugin rules"] = found
        return found

    def kept_rules(self, context: Context) -> list:
        plugins = context.journal.get(Plugins)
        stamp = tuple((row["n"], row["stamp"]) for row in plugins.rows.summaries())
        kept = KEPT_RULES.get(str(context.record.home))
        if kept and kept[0] == stamp:
            return kept[1]
        found = [(rule.find, rule.replacement) for row in plugins.rows.standing() if row.enabled for rule in declared(row).chat]
        KEPT_RULES[str(context.record.home)] = (stamp, found)
        return found


class AskPluginsToRefuse(ToolInterceptor):
    reach = Reach.MAIN
    runs = Runs.SYNC
    def intercept(self, context: Context, call_) -> str:
        record, hook = context.record, context.hook
        writes = command_effects.writes(hook)
        left = ALTOGETHER
        for row in context.journal.get(Plugins).rows.standing():
            manifest = declared(row)
            asking = manifest.refuse
            if not row.enabled or row.completed or not asking or left <= 0:
                continue
            if not writes and not manifest.reads:
                continue
            payload = refusal(record, hook, called(row), folder(record.root, called(row)), writes)
            if not manifest.waits(hook.event):
                self._beside(context, row, payload)
                continue
            started = time.monotonic()
            refused = self._within(context, row, hook.tool.name, payload, min(HOOK_WAIT, left))
            left -= time.monotonic() - started
            if refused:
                return f"{called(row)}: {refused}"
        return ""

    def _within(self, context: Context, row, tool: str, payload: dict, wait: float) -> str:
        """A plugin's refusal is waited for as long as the hook may wait; past that the call goes ahead, and what the plugin answers then reaches the agent as a message."""
        record, journal, session = context.record, context.feature.journal, context.hook.session
        name, seconds = called(row), declared(row).refuse_budget
        answered, late, found = threading.Event(), threading.Event(), []

        def ask() -> None:
            refused = self._answer(record, row, tool, payload, seconds)
            found.append(refused)
            answered.set()
            if late.is_set() and refused:
                apply(record, journal, name, session, {"say": f"{refused} (it answered after the call went ahead)"})
        self._apart(name, ask)
        if answered.wait(max(wait, 0.0)):
            return found[0]
        late.set()
        return found[0] if answered.is_set() else ""

    def _beside(self, context: Context, row, payload: dict) -> None:
        """A plugin that declared its hook async never holds the tool call: it is asked on a thread of its own, and what it answers reaches the agent as a message, never as a refusal."""
        record, journal, session, tool = context.record, context.feature.journal, context.hook.session, context.hook.tool.name
        name, seconds = called(row), declared(row).refuse_budget

        def ask() -> None:
            refused = self._answer(record, row, tool, payload, seconds)
            if refused:
                apply(record, journal, name, session, {"say": refused})
        self._apart(name, ask)

    @staticmethod
    def _apart(name: str, job) -> None:
        """Asks a plugin on a thread of its own, or at once when the threads are switched off, as in a test, so none outlives the call that asked it and loads rows in the work of another."""
        if not bus.BACKGROUND:
            job()
            return
        threading.Thread(target=job, name=f"plugin-{name}", daemon=True).start()

    def _answer(self, record, row, tool: str, payload: dict, seconds: float) -> str:
        name = called(row)
        served = declared(row).refuse_socket and asked(plugin_socket(record.root, name), payload, seconds)
        ok, reply = served if served and served[0] else self._spawned(record, row, payload, seconds)
        if ok and reply:
            logged(record.root, name, f"refuse? {tool} {json.dumps(reply, ensure_ascii=False)}")
        return PluginReply.from_json(reply).refuse if ok else ""

    @staticmethod
    def _spawned(record, row, payload: dict, seconds: float) -> tuple:
        _, where, env = placed(record, row)
        return call(fill(declared(row).refuse, env), where, env, payload, seconds)


class AskPluginsToCancel(Canceler):
    reach = Reach.MAIN
    def __init__(self, event: str):
        self.event = event

    def cancel(self, context: Context, data) -> str:
        record = context.record
        for row in context.journal.get(Plugins).rows.standing():
            manifest = declared(row)
            asking = manifest.cancels.get(self.event)
            if not row.enabled or row.completed or not asking:
                continue
            name, where, env = placed(record, row)
            ok, reply = call(fill(asking, env), where, env, {"event": self.event, "data": asdict(data)}, manifest.refuse_budget)
            cancelled = PluginReply.from_json(reply).cancel if ok else ""
            if cancelled:
                logged(record.root, name, f"cancelled {self.event}: {cancelled}")
                return f"{name}: {cancelled}"
        return ""


def forgotten(record, name: str) -> None:
    for controller in CONTROLLERS.values():
        rows = controller(record, actor=SYSTEM)
        for row in rows.rows.summaries():
            if row.get(OWNER) == name and controller.resource.type != "plugin":
                rows.force_delete(row["n"])


class ClearRemovedPlugin(Handler):
    def handle(self, context: Context, event: PluginRemoved) -> None:
        rows = context.journal.get(Plugins)
        row = rows.load(event.n)
        name = called(row)
        still = any(r.n != event.n and called(r) == name for r in rows.rows.standing())
        if name and not still:
            for service in declared(row).services:
                want(context.record.root, f"{name}.{service.name}", DOWN)
            withdrawn(context.record.root, name)
            forgotten(context.record, name)
            clear(folder(context.record.root, name))


def installed(record, name: str) -> bool:
    return named(Plugins(record, actor=SYSTEM), name) is not None


class KeepPluginRows(ActionInterceptor):
    def intercept(self, feature_context: Context, controller, n: int = 0, **_) -> None:
        if not n or controller.actor in (SYSTEM, PLUGIN):
            return None
        row = controller.load(n)
        name = row.plugin
        if name and row.data.get("locked") is True and installed(controller.record, name):
            controller._refuse(f"{controller.type} {n} belongs to the {name} plugin: it goes when the plugin is removed")
        return None


class ReadLinkedManifests(Handler):
    def handle(self, context: Context, event: ClockTicked) -> None:
        plugins = Plugins(context.record, actor=SYSTEM)
        for row in plugins.rows.standing():
            if changed_on_disk(plugins, row):
                reread(plugins, row)
