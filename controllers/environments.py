from __future__ import annotations

from pathlib import Path

import settings as settings_mod
import todo
import tracks
from controller import Controller, Payload, Result
import work
import state
from payloads.environments import AssignPayload, MakePayload, RemovePayload, SettingsPayload
from templates import render

MESSAGES = {
    "no_such_skill": "there is no skill {name} on disk here; a skill is added in the project's .claude/skills folder",
    "skill_always_on": "every session is told to load the {name} skill at its start",
    "skill_always_off": "sessions are no longer told to load the {name} skill at their start",
    "nothing_to_change": "send a setting to change: viewer_first, todos_archive_days, reports_archive_days, activity_show, activity_keep. "
                         "Auto mode is the journal's, not this environment's: POST /api/journal/settings",
    "viewer_first_on": "`{env}` is worked from the viewer: the agent keeps terminal messages to a tagged line and answers where the user reads",
    "viewer_first_off": "`{env}` is worked from the terminal again",
    "assign_which": "{n} session(s) start with that — name one running session by its id",
    "assign_already": "session {sid} is on {name} already",
    "assigned": "session {sid} is on {name} now; it reads this environment from its next tool call",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


#: a session with no process on record still counts as running this long after its last hook event
RECENT_SECONDS = 15 * 60


def _sessions(root: Path) -> list[dict]:
    """Every running session of this project, bound or not, most recently seen first: what the viewer offers to assign."""
    import time
    from controllers.activity import channel_now
    import os
    conf, _ = settings_mod.load(root)
    now = time.time()
    # A SESSION IS RUNNING WHEN ITS PROCESS IS. The hook records Claude Code's pid per session; a
    # one-shot `claude -p` that never sent a SessionEnd would otherwise sit here for a day as a
    # candidate nobody can assign. With no pid on record, recently seen is the best evidence there is.
    pids = state.get(root, "session_pids", {})
    running = set()
    for pid, stem in (pids.items() if isinstance(pids, dict) else ()):
        try:
            os.kill(int(pid), 0)
            running.add(stem)
        except (OSError, ValueError):
            continue
    out = []
    for stem, data in state.runtime_files(root):
        if data.get("ended"):
            continue
        seen = data.get("seen_at") or 0
        if not seen or now - seen > conf["session_stale_hours"] * 3600:
            continue
        if stem not in running and now - seen > RECENT_SECONDS:
            continue
        out.append({"id": stem, "short": stem[:8], "env": tracks.bound(root, stem), "seen": tracks.age_text(now - seen),
                    "age": now - seen, "channel": channel_now(root, stem)})
    out.sort(key=lambda s: s["age"])
    return out


class EnvironmentController(Controller):
    resource = "environment"
    noun = "environment"
    actions = ("index", "settings", "remove", "make", "assign")
    numbered = ()
    payloads = {"settings": SettingsPayload, "remove": RemovePayload, "make": MakePayload, "assign": AssignPayload}

    def assign(self, root: Path, p: AssignPayload) -> Result:
        """Bind a running session to this environment, from the viewer.

        THE USER IS THE ONE PERSON WHO MAY MOVE AN AGENT. Binding was made explicit so no agent moves
        another behind its back; the viewer is the user's hand, and an environment nobody holds is
        exactly the case they need it for. The moved session reads the environment on its next
        hook event, and the switch is on its record like one it made itself.
        """
        conf, _ = settings_mod.load(root)
        want = (p.session or "").strip()
        stems = [stem for stem, _ in state.runtime_files(root) if want and stem.startswith(want)]
        if len(stems) != 1:
            return Result("refused", say("assign_which", n=len(stems)))
        stem = stems[0]
        if tracks.bound(root, stem) == p.env:
            return Result("refused", say("assign_already", sid=stem[:8], name=p.env))
        ok, message = tracks.switch(root, p.env, p.at, stem, exclusive=conf["one_session_per_environment"],
                                    stale_hours=conf["session_stale_hours"])
        if not ok:
            return Result("refused", message)
        return Result("ok", say("assigned", sid=stem[:8], name=p.env), {"session": stem})

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
                                 "retention": __import__("retention").table(root, p.env),
                                 "sessions": _sessions(root)})

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
