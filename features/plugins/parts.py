import re
import time
from dataclasses import dataclass
from typing import ClassVar

from engine.events import ResourceEvent
from features.parts import Context, Handler, TextFormatter, ToolInterceptor
from features.plugins.lifecycle import called, clear
from features.plugins.manifest import fill
from features.plugins.payload import refusal
from features.plugins.run import call
from features.plugins.source import environment, folder
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
        said = text
        for find, becomes in self.rules(context) if context.record else []:
            said = re.sub(find, becomes, said)
        return said

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
            env = environment(record.root, name, row.manifest, row.token)
            seconds = min(float(row.manifest.get("refuse_seconds") or EACH), LONGEST_EACH, left)
            started = time.monotonic()
            ok, reply = call(fill(asking, env), where, env, refusal(record, hook, name, where, writes), seconds)
            left -= time.monotonic() - started
            if ok and isinstance(reply, dict) and str(reply.get("refuse") or "").strip():
                return f"{name}: {str(reply['refuse']).strip()}"
        return ""


class ClearRemovedPlugin(Handler):
    def handle(self, context: Context, event: PluginRemoved) -> None:
        rows = context.journal.plugins
        name = called(rows.load(event.n))
        still = any(r.n != event.n and called(r) == name for r in rows._standing())
        if name and not still:
            clear(folder(context.record.root, name))
