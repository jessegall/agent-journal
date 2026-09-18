from __future__ import annotations

from pathlib import Path

import state
import todo
import work
from controller import Controller, Payload, Result
from payloads.environments import AutoPayload
from payloads.journal import SettingsPayload
from templates import render

MESSAGES = {
    "nothing_to_change": "send a setting to change: auto",
    "auto_wants": "auto mode is enabled or disabled, got {got}",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


class JournalController(Controller):
    resource = "journal"
    noun = "journal"
    scoped = False
    actions = ("index", "settings", "auto")
    numbered = ()
    payloads = {"settings": SettingsPayload, "auto": AutoPayload}

    def index(self, root: Path, p: Payload) -> Result:
        return Result("ok", "", {"auto": todo.auto(root)})

    def auto(self, root: Path, p: AutoPayload) -> Result:
        here = p.env or state.current_track(root)
        want = p.state.lower()
        if not want:
            return Result("ok", "", None, {"on": todo.auto(root)})
        if want not in ("enable", "disable", "on", "off", "true", "false", "yes", "no"):
            return Result("refused", say("auto_wants", got=repr(p.state)))
        on = want in ("enable", "on", "true", "yes")
        meta = {"on": on, "set": True}
        message = todo.set_auto(root, on)
        if on:
            ready = todo.ready(root, here)
            meta.update(working=[w["subject"] for w in work.open_work(root)], waiting=len(todo.open_items(root, here)),
                        next={"n": ready[0]["n"], "title": ready[0]["title"]} if ready else None)
        return Result("ok", message, None, meta)

    def settings(self, root: Path, p: SettingsPayload) -> Result:
        if not p.has("auto"):
            return Result("refused", say("nothing_to_change"))
        return Result("ok", todo.set_auto(root, p.auto), {"auto": todo.auto(root)})
