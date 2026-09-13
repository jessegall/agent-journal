from __future__ import annotations

from pathlib import Path

import settings as settings_mod
import todo
import tracks
from controller import Controller, Payload, Result
from payloads.environments import RemovePayload, SettingsPayload
from templates import render

MESSAGES = {
    "nothing_to_change": "send a setting to change: auto",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


class EnvironmentController(Controller):
    resource = "environment"
    noun = "environment"
    actions = ("index", "settings", "remove")
    numbered = ()
    payloads = {"settings": SettingsPayload, "remove": RemovePayload}

    def index(self, root: Path, p: Payload) -> Result:
        import views
        row = next((e for e in views.environments(root) if e["name"] == p.env), None)
        if row is None:
            return Result("missing", tracks.say("remove_none", name=repr(p.env)))
        return Result("ok", "", {**row, "auto": todo.auto(root, p.env), "start": row["current"]})

    def settings(self, root: Path, p: SettingsPayload) -> Result:
        if not p.has("auto"):
            return Result("refused", say("nothing_to_change"))
        return Result("ok", todo.set_auto(root, p.env, p.auto))

    def remove(self, root: Path, p: RemovePayload) -> Result:
        conf, _ = settings_mod.load(root)
        # the browser confirms by typing the name; the terminal by --yes
        yes = p.yes or (bool(p.confirm) and p.confirm == p.env)
        return Result.of(tracks.remove(root, p.env, p.at, p.session, yes=yes, stale_hours=conf["session_stale_hours"]))
