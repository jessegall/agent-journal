from __future__ import annotations

from pathlib import Path

import settings as settings_mod
import todo
import tracks
from controller import Controller, Payload, Result
import work
from payloads.environments import AutoPayload, RemovePayload, SettingsPayload
from templates import render

MESSAGES = {
    "nothing_to_change": "send a setting to change: auto, reports_archive_days, activity_show, activity_keep",
    "auto_wants": "auto mode is enabled or disabled, got {got}",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


class EnvironmentController(Controller):
    resource = "environment"
    noun = "environment"
    actions = ("index", "settings", "auto", "remove")
    numbered = ()
    payloads = {"settings": SettingsPayload, "auto": AutoPayload, "remove": RemovePayload}

    def index(self, root: Path, p: Payload) -> Result:
        import views
        row = next((e for e in views.environments(root) if e["name"] == p.env), None)
        if row is None:
            return Result("missing", tracks.say("remove_none", name=repr(p.env)))
        import commandlog
        import reports
        return Result("ok", "", {**row, "auto": todo.auto(root, p.env), "start": row["current"],
                                 "reports_archive_days": reports.archive_days(root, p.env),
                                 "activity_show": commandlog.setting(root, p.env, commandlog.SHOW),
                                 "activity_keep": commandlog.setting(root, p.env, commandlog.KEEP)})

    def settings(self, root: Path, p: SettingsPayload) -> Result:
        import commandlog
        import reports
        said = []
        if p.has("auto"):
            said.append(todo.set_auto(root, p.env, p.auto))
        if p.has("reports_archive_days"):
            ok, message = reports.set_archive_days(root, p.env, p.reports_archive_days)
            if not ok:
                return Result("refused", message)
            said.append(message)
        for key in (commandlog.SHOW, commandlog.KEEP):
            if p.has(key):
                ok, message = commandlog.set_setting(root, p.env, key, getattr(p, key))
                if not ok:
                    return Result("refused", message)
                said.append(message)
        if not said:
            return Result("refused", say("nothing_to_change"))
        return Result("ok", "\n".join(said))

    def auto(self, root: Path, p: AutoPayload) -> Result:
        want = p.state.lower()
        if not want:
            return Result("ok", "", None, {"env": p.env, "on": todo.auto(root, p.env)})
        if want not in ("enable", "disable", "on", "off", "true", "false", "yes", "no"):
            return Result("refused", say("auto_wants", got=repr(p.state)))
        on = want in ("enable", "on", "true", "yes")
        meta = {"env": p.env, "on": on, "set": True}
        message = todo.set_auto(root, p.env, on)
        if on:
            ready = todo.ready(root, p.env)
            meta.update(working=[w["subject"] for w in work.open_work(root)], waiting=len(todo.open_items(root, p.env)),
                        next={"n": ready[0]["n"], "title": ready[0]["title"]} if ready else None)
        return Result("ok", message, None, meta)

    def remove(self, root: Path, p: RemovePayload) -> Result:
        conf, _ = settings_mod.load(root)
        # the browser confirms by typing the name; the terminal by --yes
        yes = p.yes or (bool(p.confirm) and p.confirm == p.env)
        return Result.of(tracks.remove(root, p.env, p.at, p.session, yes=yes, stale_hours=conf["session_stale_hours"]))
