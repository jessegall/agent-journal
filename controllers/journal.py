from __future__ import annotations

from pathlib import Path

import todo
from controller import Controller, Payload, Result
from payloads.journal import SettingsPayload
from templates import render

MESSAGES = {
    "nothing_to_change": "send a setting to change: auto",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


class JournalController(Controller):
    """The journal's own settings — the ones that belong to the project, not to an environment.

    Auto mode is the first: it was set per environment, and an agent that switched came to a
    halt on the one where the flag was off.
    """
    resource = "journal"
    noun = "journal"
    scoped = False
    actions = ("index", "settings")
    numbered = ()
    payloads = {"settings": SettingsPayload}

    def index(self, root: Path, p: Payload) -> Result:
        return Result("ok", "", {"auto": todo.auto(root)})

    def settings(self, root: Path, p: SettingsPayload) -> Result:
        if not p.has("auto"):
            return Result("refused", say("nothing_to_change"))
        return Result("ok", todo.set_auto(root, p.auto), {"auto": todo.auto(root)})
