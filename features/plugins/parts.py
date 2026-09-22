import json
import re
import time
from dataclasses import dataclass
from typing import ClassVar

from engine.events import ResourceEvent
from engine.services import DOWN, want
from features.parts import Context, Handler, TextFormatter, ToolInterceptor
from features.plugins.lifecycle import called, clear
from features.plugins.manifest import fill
from features.plugins.payload import refusal
from features.plugins.run import call
from features.plugins.source import CHOSEN, environment, folder, logged
from features.status_bar import commands

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


class ClearRemovedPlugin(Handler):
    def handle(self, context: Context, event: PluginRemoved) -> None:
        rows = context.journal.plugins
        row = rows.load(event.n)
        name = called(row)
        still = any(r.n != event.n and called(r) == name for r in rows._standing())
        if name and not still:
            for service in (row.manifest or {}).get("services") or {}:
                want(context.record.root, f"{name}.{service}", DOWN)
            clear(folder(context.record.root, name))
