import threading
import time
from dataclasses import fields
from pathlib import Path

from controllers.types import Agents, Plugins
from engine.services import DOWN, want
from engine.wording import fill
from framework.plugins.declared import called, declared
from framework.plugins.environment import placed
from framework.plugins.fitting import DECIDED, REFRESHING, WORKED_FIRST, in_use_since, offers_fresh, offers_kept, offers_read, offers_stamp, settle
from framework.plugins.lifecycle import clear, reread
from framework.plugins.parts import forgotten
from framework.plugins.paths import folder, logged, plugin_socket
from framework.plugins.payload import refusal
from framework.plugins.refusing import PluginAsk
from framework.plugins.run import PluginReply, call
from framework.plugins.skills import withdrawn
from payload import Dispatch, HookEvent
from resources.base import SYSTEM

ALTOGETHER = 5.0
HOOK_WAIT = 0.2


class PluginsWork:
    """What the plugins feature does beyond rows: clearing what a removed plugin left, reading a linked manifest again, looking for plugins that fit, and asking plugins about a call."""

    asking = PluginAsk()

    def retire_plugin(self, record, n: int) -> None:
        row = Plugins(record, actor=SYSTEM).load(n)
        name = called(row)
        for service in declared(row).services:
            want(record.root, f"{name}.{service.name}", DOWN)
        withdrawn(record.root, name)
        forgotten(record, name)
        clear(folder(record.root, name))

    def reread_manifest(self, record, n: int) -> None:
        plugins = Plugins(record, actor=SYSTEM)
        reread(plugins, plugins.load(n))

    def fitting_wanted(self, record, agent: int) -> bool:
        """Whether the agent has worked long enough, in a project whose offers are stale or undecided."""
        if time.time() - in_use_since(record, Agents(record, actor=SYSTEM).peek(agent)) < WORKED_FIRST:
            return False
        return not (offers_fresh(record.root) and DECIDED.get(Path(record.root)) == offers_stamp(record.root))

    def look_for_fitting(self, record) -> None:
        refreshing = REFRESHING.setdefault(Path(record.root), threading.Lock())
        if not refreshing.acquire(blocking=False):
            return
        threading.Thread(target=settle, args=(record, refreshing, offers_kept if offers_fresh(record.root) else offers_read), name="plugin-fit", daemon=True).start()

    def refuse_call(self, record, session: str, tool: str, file: str, command: str, writes: bool) -> str:
        """Why a plugin refuses the call, asked of each enabled plugin within the time the hook may wait; nothing when none does."""
        left = ALTOGETHER
        named = {"name": tool, "file": file or None, "command": command or None, "writes": writes}
        for row in Plugins(record, actor=SYSTEM).rows.standing():
            manifest = declared(row)
            asking = manifest.refuse
            if not row.enabled or row.completed or not asking or left <= 0:
                continue
            if not writes and not manifest.reads:
                continue
            payload = refusal(record, session, HookEvent.PRE_TOOL_USE, named, called(row), folder(record.root, called(row)))
            if not manifest.waits(HookEvent.PRE_TOOL_USE) or manifest.refuse_socket and not plugin_socket(record.root, called(row)).exists():
                self.asking.beside(record, self.journal, session, tool, row, payload)
                continue
            started = time.monotonic()
            refused = self.asking.within(record, self.journal, session, row, tool, payload, min(HOOK_WAIT, left))
            left -= time.monotonic() - started
            if refused:
                return f"{called(row)}: {refused}"
        return ""

    def cancel_call(self, record, event: str, request) -> str:
        """Why a plugin cancels the moment, asked of each enabled plugin that declared it would; nothing when none does."""
        data = {one.name: getattr(request, one.name) for one in fields(Dispatch)}
        for row in Plugins(record, actor=SYSTEM).rows.standing():
            manifest = declared(row)
            asking = manifest.cancels.get(event)
            if not row.enabled or row.completed or not asking:
                continue
            name, where, env = placed(record, row)
            ok, reply = call(fill(asking, env), where, env, {"event": event, "data": data}, manifest.refuse_budget)
            cancelled = PluginReply.from_json(reply).cancel if ok else ""
            if cancelled:
                logged(record.root, name, f"cancelled {event}: {cancelled}")
                return f"{name}: {cancelled}"
        return ""
