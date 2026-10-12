import re
import time
from dataclasses import asdict

from controllers.types import CONTROLLERS, Plugins
from events.agents import ClockTicked
from engine.services import DOWN, want
from features.parts import ActionInterceptor, Canceler, Context, Handler, TextFormatter, ToolInterceptor
from declaring.holds import Runs
from engine.wording import fill
from features.plugins.lifecycle import changed_on_disk, clear, reread
from features.plugins.declared import called, declared, named
from features.plugins.environment import placed
from features.plugins.refusing import PluginAsk
from features.plugins.paths import folder, logged, plugin_socket
from features.plugins.payload import refusal
from features.plugins.run import PluginReply, call
from features.plugins.skills import withdrawn
from providers import command_effects
from resources.base import OWNER, PLUGIN, SYSTEM
from declaring.reach import Reach
from events.plugins import PluginCompleted

ALTOGETHER = 5.0
HOOK_WAIT = 0.2


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
    asking = PluginAsk()

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
            if not manifest.waits(hook.event) or manifest.refuse_socket and not plugin_socket(record.root, called(row)).exists():
                self.asking.beside(context, row, payload)
                continue
            started = time.monotonic()
            refused = self.asking.within(context, row, hook.tool.name, payload, min(HOOK_WAIT, left))
            left -= time.monotonic() - started
            if refused:
                return f"{called(row)}: {refused}"
        return ""


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
    def handle(self, context: Context, event: PluginCompleted) -> None:
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
