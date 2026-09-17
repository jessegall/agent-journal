from __future__ import annotations

from pathlib import Path

import settings as settings_mod
import todo
import tracks
from controller import Controller, Payload, Result
import work
from payloads.environments import MakePayload, RemovePayload, SettingsPayload
from templates import render

MESSAGES = {
    "no_such_skill": "there is no skill {name} on disk here; a skill is added in the project's .claude/skills folder",
    "skill_always_on": "every session is told to load the {name} skill at its start",
    "skill_always_off": "sessions are no longer told to load the {name} skill at their start",
    "nothing_to_change": "send a setting to change: viewer_first, todos_archive_days, reports_archive_days, activity_show, activity_keep. "
                         "Auto mode is the journal's, not this environment's: POST /api/journal/settings",
    "viewer_first_on": "`{env}` is worked from the viewer: the agent keeps terminal messages to a tagged line and answers where the user reads",
    "viewer_first_off": "`{env}` is worked from the terminal again",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


class EnvironmentController(Controller):
    resource = "environment"
    noun = "environment"
    actions = ("index", "settings", "remove", "make")
    numbered = ()
    payloads = {"settings": SettingsPayload, "remove": RemovePayload, "make": MakePayload}

    def index(self, root: Path, p: Payload) -> Result:
        import views
        row = next((e for e in views.environments(root) if e["name"] == p.env), None)
        if row is None:
            return Result("missing", tracks.say("remove_none", name=repr(p.env)))
        import commandlog
        import reports
        return Result("ok", "", {**row, "auto": todo.auto(root), "start": row["current"],
                                 "todos_archive_days": todo.archive_days(root, p.env),
                                 "reports_archive_days": reports.archive_days(root, p.env),
                                 "activity_show": commandlog.setting(root, p.env, commandlog.SHOW),
                                 "activity_keep": commandlog.setting(root, p.env, commandlog.KEEP),
                                 "viewer_first": tracks.viewer_first(root, p.env),
                                 "retention": __import__("retention").table(root, p.env)})

    def settings(self, root: Path, p: SettingsPayload) -> Result:
        import commandlog
        import reports
        said = []
        if p.has("retention"):
            import retention
            wanted = p.retention
            ok, message = retention.set_days(root, p.env, str(wanted.get("resource", "")), wanted.get("archive"), wanted.get("delete"))
            if not ok:
                return Result("refused", message)
            said.append(message)
        if p.has("viewer_first"):
            tracks.set_viewer_first(root, p.env, p.viewer_first)
            said.append(say("viewer_first_on" if p.viewer_first else "viewer_first_off", env=p.env))
        if p.has("todos_archive_days"):
            ok, message = todo.set_archive_days(root, p.env, p.todos_archive_days)
            if not ok:
                return Result("refused", message)
            said.append(message)
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
        if p.has("always_load"):
            import skills
            name = p.always_load.strip()
            if not skills.find(root.parent, name):
                return Result("refused", say("no_such_skill", name=name))
            on = p.always_on if p.has("always_on") else True
            skills.set_always(root, name, on)
            said.append(say("skill_always_on" if on else "skill_always_off", name=name))
        if not said:
            return Result("refused", say("nothing_to_change"))
        return Result("ok", "\n".join(said))

    def make(self, root: Path, p: MakePayload) -> Result:
        """Bring an environment into existence from the viewer. It creates; it moves nobody.

        `journal prepare` creates AND switches, because a person at a terminal who names a new
        environment is about to work in it. A person in a browser is not: no session is theirs to
        move, and moving one behind an agent's back is the thing binding was made explicit to stop.
        """
        import state as state_mod
        name = state_mod.slug(p.name or "")
        if not name:
            return Result("refused", tracks.say("remove_what"))
        if name in tracks._all(root):
            return Result("refused", tracks.say("already_on", name=name))
        with state_mod.locked(root):
            tracks.create(root, name, at=p.at)
        return Result("created", tracks.say("prepared_here", name=name), {"name": name})

    def remove(self, root: Path, p: RemovePayload) -> Result:
        conf, _ = settings_mod.load(root)
        # the browser confirms by typing the name; the terminal by --yes
        yes = p.yes or (bool(p.confirm) and p.confirm == p.env)
        return Result.of(tracks.remove(root, p.env, p.at, p.session, yes=yes, stale_hours=conf["session_stale_hours"]))
