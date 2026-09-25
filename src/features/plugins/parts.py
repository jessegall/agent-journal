import json
import re
import time
from dataclasses import asdict, dataclass
from typing import ClassVar

from controllers.types import CONTROLLERS, Plugins
from engine.events import ClockTicked, ResourceEvent
from engine.services import DOWN, want
from features.parts import ActionInterceptor, Canceler, Context, Handler, TextFormatter, ToolInterceptor
from features.plugins.lifecycle import called, changed_on_disk, clear, reread
from features.plugins.declared import declared, settings_of
from features.plugins.manifest import fill
from features.plugins.payload import refusal
from features.plugins.run import PluginReply, asked, call
from features.plugins.skills import withdrawn
from features.plugins.source import environment, folder, logged, plugin_socket
from features.status_bar import commands
from resources.base import OWNER, PLUGIN, SYSTEM

EACH = 1.5
LONGEST_EACH = 3.0
ALTOGETHER = 5.0


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
        plugins = context.journal.plugins
        stamp = tuple((row["n"], row["stamp"]) for row in plugins.summaries())
        kept = KEPT_RULES.get(str(context.record.home))
        if kept and kept[0] == stamp:
            return kept[1]
        found = [(rule.find, rule.replacement) for row in plugins._standing() if row.enabled for rule in declared(row).chat]
        KEPT_RULES[str(context.record.home)] = (stamp, found)
        return found


def placed(record, row) -> tuple:
    name = called(row)
    return name, folder(record.root, name), environment(record.root, name, declared(row), row.token, chosen=settings_of(row).chosen, env=record.env)


class AskPluginsToRefuse(ToolInterceptor):
    def intercept(self, context: Context, call_) -> str:
        record, hook = context.record, context.hook
        writes = commands.writes(hook)
        left = ALTOGETHER
        for row in context.journal.plugins._standing():
            manifest = declared(row)
            asking = manifest.refuse
            if not row.enabled or row.completed or not asking or left <= 0:
                continue
            if not writes and not manifest.reads:
                continue
            name = called(row)
            seconds = min(manifest.refuse_seconds if manifest.refuse_seconds else EACH, LONGEST_EACH, left)
            started = time.monotonic()
            payload = refusal(record, hook, name, folder(record.root, name), writes)
            served = manifest.refuse_socket and asked(plugin_socket(record.root, name), payload, seconds)
            ok, reply = served if served and served[0] else self._spawned(record, row, payload, seconds)
            left -= time.monotonic() - started
            if ok and reply:
                logged(record.root, name, f"refuse? {hook.tool.name} {json.dumps(reply, ensure_ascii=False)}")
            refused = PluginReply.from_json(reply).refuse if ok else ""
            if refused:
                return f"{name}: {refused}"
        return ""

    @staticmethod
    def _spawned(record, row, payload: dict, seconds: float) -> tuple:
        _, where, env = placed(record, row)
        return call(fill(declared(row).refuse, env), where, env, payload, seconds)


class AskPluginsToCancel(Canceler):
    def __init__(self, event: str):
        self.event = event

    def cancel(self, context: Context, data) -> str:
        record = context.record
        for row in context.journal.plugins._standing():
            manifest = declared(row)
            asking = manifest.cancels.get(self.event)
            if not row.enabled or row.completed or not asking:
                continue
            name, where, env = placed(record, row)
            ok, reply = call(fill(asking, env), where, env, {"event": self.event, "data": asdict(data)}, min(manifest.refuse_seconds if manifest.refuse_seconds else EACH, LONGEST_EACH))
            cancelled = PluginReply.from_json(reply).cancel if ok else ""
            if cancelled:
                logged(record.root, name, f"cancelled {self.event}: {cancelled}")
                return f"{name}: {cancelled}"
        return ""


def forgotten(record, name: str) -> None:
    for controller in CONTROLLERS.values():
        rows = controller(record, actor=SYSTEM)
        for row in rows.summaries():
            if row.get(OWNER) == name and controller.resource.type != "plugin":
                rows.force_delete(row["n"])


class ClearRemovedPlugin(Handler):
    def handle(self, context: Context, event: PluginRemoved) -> None:
        rows = context.journal.plugins
        row = rows.load(event.n)
        name = called(row)
        still = any(r.n != event.n and called(r) == name for r in rows._standing())
        if name and not still:
            for service in declared(row).services:
                want(context.record.root, f"{name}.{service.name}", DOWN)
            withdrawn(context.record.root, name)
            forgotten(context.record, name)
            clear(folder(context.record.root, name))


def installed(record, name: str) -> bool:
    return any(called(r) == name for r in Plugins(record, actor=SYSTEM)._standing())


class KeepPluginRows(ActionInterceptor):
    def intercept(self, context: Context, controller, n: int = 0, **_) -> None:
        if not n or controller.actor in (SYSTEM, PLUGIN):
            return None
        row = controller.load(n)
        name = row.plugin
        if name and row.data.get("locked") is True and installed(controller.record, name):
            controller._refuse(f"{controller.type} {n} belongs to the {name} plugin: it goes when the plugin is removed")
        return None


class OneRowPerTitle(ActionInterceptor):
    def intercept(self, context: Context, controller, title: str = "", abstract: str = "", brief: str = "", **data):
        name = data.get(OWNER)
        if not name:
            return None
        found = next((row for row in controller.summaries() if row.get(OWNER) == name and row["title"] == title and not row["deleted"]), None)
        if found is None:
            return None
        return controller.update(found["n"], abstract=abstract or None, brief=brief or None, **data)


class ReadLinkedManifests(Handler):
    def handle(self, context: Context, event: ClockTicked) -> None:
        plugins = Plugins(context.record, actor=SYSTEM)
        for row in plugins._standing():
            if changed_on_disk(plugins, row):
                reread(plugins, row)
