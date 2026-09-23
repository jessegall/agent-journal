import json
import re
import time
from dataclasses import dataclass
from typing import ClassVar

from controllers.types import CONTROLLERS, Plugins
from engine.events import ResourceEvent
from engine.services import DOWN, want
from features.parts import ActionInterceptor, Canceler, Context, Handler, TextFormatter, ToolInterceptor
from features.plugins.lifecycle import called, clear
from features.plugins.manifest import fill
from features.plugins.payload import refusal
from features.plugins.run import call
from features.plugins.skills import withdrawn
from features.plugins.source import CHOSEN, environment, folder, logged
from features.status_bar import commands
from resources.base import OWNER, PLUGIN, SYSTEM

EACH = 1.5
LONGEST_EACH = 3.0
ALTOGETHER = 5.0
CHAT_RULES = ("chat rules",)


@dataclass(frozen=True)
class PluginRemoved(ResourceEvent):
    on: ClassVar[str] = "plugin.completed"


class PluginChatRules(TextFormatter):
    def format(self, context: Context, text: str) -> str:
        result = text
        for find, becomes in self.rules(context) if context.record else []:
            result = re.sub(find, becomes, result)
        return result

    def rules(self, context: Context) -> list:
        memo = getattr(context.record, "memo", None)
        if memo is not None and CHAT_RULES in memo:
            return memo[CHAT_RULES]
        found = [(rule["find"], rule["as"]) for row in context.journal.plugins._standing() if row.enabled for rule in (row.manifest or {}).get("chat") or []]
        if memo is not None:
            memo[CHAT_RULES] = found
        return found


class AskPluginsToRefuse(ToolInterceptor):
    def intercept(self, context: Context, call_) -> str:
        record, hook = context.record, context.hook
        writes = commands.writes(hook)
        left = ALTOGETHER
        for row in context.journal.plugins._every():
            asking = (row.manifest or {}).get("refuse")
            if not row.enabled or row.completed or not asking or left <= 0:
                continue
            if not writes and not (row.manifest or {}).get("reads"):
                continue
            name = called(row)
            where = folder(record.root, name)
            env = environment(record.root, name, row.manifest, row.token, chosen=(row.settings or {}).get(CHOSEN))
            seconds = min(float(row.manifest.get("refuse_seconds") or EACH), LONGEST_EACH, left)
            started = time.monotonic()
            ok, reply = call(fill(asking, env), where, env, refusal(record, hook, name, where, writes), seconds)
            left -= time.monotonic() - started
            if ok and reply:
                logged(record.root, name, f"refuse? {hook.tool.name} {json.dumps(reply, ensure_ascii=False)}")
            if ok and isinstance(reply, dict) and str(reply.get("refuse") or "").strip():
                return f"{name}: {str(reply['refuse']).strip()}"
        return ""


class AskPluginsToCancel(Canceler):
    def __init__(self, event: str):
        self.event = event

    def cancel(self, context: Context, data: dict) -> str:
        record = context.record
        for row in context.journal.plugins._every():
            asking = ((row.manifest or {}).get("cancels") or {}).get(self.event)
            if not row.enabled or row.completed or not asking:
                continue
            name = called(row)
            where = folder(record.root, name)
            env = environment(record.root, name, row.manifest, row.token, chosen=(row.settings or {}).get(CHOSEN))
            ok, reply = call(fill(asking, env), where, env, {"event": self.event, "data": data}, min(float(row.manifest.get("refuse_seconds") or EACH), LONGEST_EACH))
            if ok and isinstance(reply, dict) and str(reply.get("cancel") or "").strip():
                logged(record.root, name, f"cancelled {self.event}: {reply['cancel']}")
                return f"{name}: {str(reply['cancel']).strip()}"
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
            for service in (row.manifest or {}).get("services") or {}:
                want(context.record.root, f"{name}.{service}", DOWN)
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
        name = str(row.data.get(OWNER) or "")
        if name and row.data.get("locked") is True and installed(controller.record, name):
            controller._refuse(f"{controller.type} {n} belongs to the {name} plugin: it goes when the plugin is removed")
        return None


class OneRowPerTitle(ActionInterceptor):
    def intercept(self, context: Context, controller, title: str = "", abstract: str = "", brief: str = "", **data):
        name = str(data.get(OWNER) or "")
        if not name:
            return None
        found = next((row for row in controller.summaries() if row.get(OWNER) == name and row["title"] == title and not row["deleted"]), None)
        if found is None:
            return None
        return controller.update(found["n"], abstract=abstract or None, brief=brief or None, **data)
