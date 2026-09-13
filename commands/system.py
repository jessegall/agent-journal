from __future__ import annotations

import fmt
import settings as settings_mod
import tracks
from app import answer, now, project, refuse, root, stem
from command import Command, Parsed, number
from templates import render

NOUNS = (("cleanup", "tidy"), ("migrate", "migrations"), ("loop",), ("update",), ("upgrade",),
         ("verify",), ("settings",), ("serve",), ("statusline", "status-line"), ("enable",), ("disable",), ("version",))

TEXT = {
    "cleanup_extra": "cleanup takes no argument (got {word}) — `journal cleanup` for what a check can see, "
                     "`journal cleanup read` for the half only reading finds, "
                     "`journal cleanup keep <finding>` to mark a countable one read",
    "keep_none": "nothing is reported as {mark} here. ",
    "keep_which": "keep which finding? ",
    "keep_can": "What can be kept: {names:, }",
    "keep_nothing": "Nothing countable is being reported — `journal cleanup` shows what is.",
    "mark": "`{mark}`",
    "nothing_pending": "Nothing pending.",
    "loop_outside": "`journal loop` is the session's: run it from inside one",
    "loop_set": "noted: this session has a loop running; the stop queue will not ask for one",
    "loop_unset": "noted: no loop; with auto on, the next stop asks for one",
    "loop_known": "a loop is known to be running in this session",
    "loop_unknown": "no loop is known in this session",
    "loop_status": "{known} — with auto on, one is asked for: the `loop` skill with `{minutes}m journal next`",
    "update_extra": "journal update upgrades the journal. Progress on the open work is:\n"
                    '  journal work update "<what moved>"',
    "enabled": "hooks ENABLED: every hold, gate and reminder is back in force.",
    "rules_block_removed": "the rules injected into CLAUDE.md are taken out; `journal rules inject <n>` puts one back",
    "statusline_offer": "Want the environment, the open work and the web viewer in Claude Code's status bar? "
                        "`journal statusline --install`",
    "statusline_installed": "status line added to {path}; it shows from the next prompt",
    "statusline_taken": "{path} already has a status line; it was left as it is. To use the journal's, set its "
                        'command to: {command}',
    "statusline_command": ".journal/journal.py statusline",
    "disabled": "hooks DISABLED: nothing is held, gated, filed or reminded until "
                "`journal enable` — only run this because the user asked for it, by name.",
    "settings_title": "SETTINGS",
    "settings_no_file": "no file, every default in force",
    "settings_default": "default {value}",
    "settings_changed": "* set in settings.json",
    "settings_queue": "THE STOP QUEUE, IN THE ORDER IT RUNS",
    "settings_footer": 'One subject is raised per stop, lowest number first. `stop_priority` moves '
                       'one: {{"work": 1}} puts open work at the head. `silenced` turns one off by '
                       "name, and is the way to quiet a single subject.",
    "version_title": "AGENT-JOURNAL {version}",
    "version_available": "{version} is available[: {headline}]",
    "version_latest": "This is the latest.",
    "version_unreachable": "Could not reach the repository to check for a newer one.",
}

UPGRADE_ROW = ("journal upgrade", "pull it, tests first, and print what changed")


def here() -> str:
    return tracks.current(root(), stem())


class Cleanup(Command):
    signature = "cleanup {extra*?} {--all}"
    writes = True

    def run(self, p: Parsed) -> int:
        if p.arg("extra"):
            return refuse(render(TEXT["cleanup_extra"], word=repr(p.arg("extra").split()[0])))
        import cleanup
        conf, _ = settings_mod.load(root())
        fmt.say(cleanup.report(root(), here(), bool(p.option("all")), conf["session_stale_hours"]))
        return 0


class CleanupRead(Command):
    signature = "cleanup:read"
    verbs = ("reading",)
    writes = True

    def run(self, p: Parsed) -> int:
        import cleanup
        fmt.say(cleanup.reading(root(), here(), now()))
        return 0


class CleanupKeep(Command):
    signature = "cleanup:keep {mark? : the finding}"
    verbs = ("kept",)
    writes = True

    def run(self, p: Parsed) -> int:
        import cleanup
        mark = p.arg("mark") or ""
        found = [c for c in cleanup.candidates(root(), here()) if c.get("mark")]
        hit = next((c for c in found if c["mark"] == mark), None)
        if hit:
            fmt.say(cleanup.keep(root(), here(), mark, now(), int(str(hit["text"]).split()[0])))
            return 0
        lead = render(TEXT["keep_none"], mark=repr(mark)) if mark else TEXT["keep_which"]
        names = [render(TEXT["mark"], mark=c["mark"]) for c in found]
        return refuse(lead + (render(TEXT["keep_can"], names=names) if names else TEXT["keep_nothing"]))


class Migrate(Command):
    signature = "migrate"
    writes = True

    def run(self, p: Parsed) -> int:
        import migrate
        fmt.say(migrate.report(root()))
        return 0


class MigrateRun(Command):
    signature = "migrate:run"
    verbs = ("now",)
    writes = True

    def run(self, p: Parsed) -> int:
        import migrate
        fmt.say("\n".join(migrate.run(root()) or [TEXT["nothing_pending"]]))
        return 0


def _session() -> str | None:
    session = stem()
    if not session:
        fmt.say(TEXT["loop_outside"], error=True)
    return session


class Loop(Command):
    signature = "loop"
    writes = True

    def run(self, p: Parsed) -> int:
        import state
        session = _session()
        if not session:
            return 1
        known = bool(state.get(root(), "loop_set", False, stem=session))
        conf, _ = settings_mod.load(root())
        fmt.say(render(TEXT["loop_status"], known=TEXT["loop_known"] if known else TEXT["loop_unknown"],
                       minutes=conf["auto_loop_minutes"]))
        return 0


class LoopSet(Command):
    signature = "loop:set"
    writes = True

    def run(self, p: Parsed) -> int:
        import state
        session = _session()
        if not session:
            return 1
        state.put(root(), "loop_set", True, stem=session)
        fmt.say(TEXT["loop_set"])
        return 0


class LoopUnset(Command):
    signature = "loop:unset"
    verbs = ("off",)
    writes = True

    def run(self, p: Parsed) -> int:
        import state
        session = _session()
        if not session:
            return 1
        state.put(root(), "loop_set", False, stem=session)
        fmt.say(TEXT["loop_unset"])
        return 0


class Upgrade(Command):
    signature = "upgrade {ignored*?} {--from= : a path or git url}"
    writes = True

    def run(self, p: Parsed) -> int:
        import update
        return answer(update.upgrade(root(), p.option("from")))


class Update(Upgrade):
    signature = "update {extra*?} {--from= : a path or git url}"

    def run(self, p: Parsed) -> int:
        if p.arg("extra"):
            return refuse(TEXT["update_extra"])
        return super().run(p)


class Verify(Command):
    signature = "verify"

    def run(self, p: Parsed) -> int:
        import verify
        body, ok = verify.render(root())
        fmt.say(body)
        return 0 if ok else 1


class Settings(Command):
    signature = "settings"

    def run(self, p: Parsed) -> int:
        import hook  # noqa: F401 — its decorators fill the nudge registry
        import nudges
        conf, problems = settings_mod.load(root())
        path = root() / settings_mod.PATH
        changed = [k for k in settings_mod.DEFAULTS if conf[k] != settings_mod.DEFAULTS[k]]
        rows = tuple(
            fmt.Item(title=("* " if k in changed else "  ") + k, text=str(conf[k]),
                     meta=render(TEXT["settings_default"], value=d) if k in changed else "")
            for k, d in settings_mod.DEFAULTS.items()
        )
        queue = fmt.Out(title=TEXT["settings_queue"],
                        items=tuple(fmt.Item(title=name, text=str(n)) for name, n in nudges.priorities(conf)))
        fmt.say(fmt.Out(
            title=TEXT["settings_title"],
            sub=str(path) if path.is_file() else TEXT["settings_no_file"],
            items=rows + (fmt.Item(text=TEXT["settings_changed"]),) * bool(changed) + (queue,),
            footer=render(TEXT["settings_footer"]),
        ))
        for problem in problems:
            fmt.say(problem, error=True)
        return 1 if problems else 0


class Serve(Command):
    signature = "serve {--port=} {--open}"
    casts = {"port": number("--port")}

    def run(self, p: Parsed) -> int:
        import serve
        try:
            serve.run(root(), project(), port=p.option("port") or serve.DEFAULT_PORT,
                      open_browser=bool(p.option("open")))
        except SystemExit as e:
            return e.code if isinstance(e.code, int) else 1
        return 0


class Statusline(Command):
    signature = "statusline {--install}"

    def run(self, p: Parsed) -> int:
        if p.option("install"):
            return self.install()
        import json
        import sys
        import views
        from pathlib import Path
        got = {}
        if not sys.stdin.isatty():
            try:
                got = json.loads(sys.stdin.read() or "{}")
            except ValueError:
                got = {}
        where = got.get("transcript_path") or ""
        print(views.status_line(root(), Path(where).stem if where else stem()))
        return 0

    @staticmethod
    def install() -> int:
        import json
        path = project() / ".claude" / "settings.json"
        data = json.loads(path.read_text()) if path.is_file() else {}
        shown = path.relative_to(project())
        if data.get("statusLine"):
            fmt.say(render(TEXT["statusline_taken"], path=shown, command=TEXT["statusline_command"]))
            return 0
        data["statusLine"] = {"type": "command", "command": TEXT["statusline_command"]}
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(data, indent=2) + "\n")
        fmt.say(render(TEXT["statusline_installed"], path=shown))
        return 0


def has_statusline() -> bool:
    import json
    for f in (project() / ".claude" / "settings.json", project() / ".claude" / "settings.local.json"):
        try:
            if f.is_file() and json.loads(f.read_text()).get("statusLine"):
                return True
        except ValueError:
            continue
    return False


class Enable(Command):
    signature = "enable"
    on = True

    def run(self, p: Parsed) -> int:
        import state
        state.set_hooks_enabled(root(), self.on)
        fmt.say(TEXT["enabled"] if self.on else TEXT["disabled"])
        if not self.on:
            import claude_md
            if claude_md.remove(root()):
                fmt.say(TEXT["rules_block_removed"])
        if self.on and not has_statusline():
            fmt.say(fmt.wrap(TEXT["statusline_offer"]))
        return 0


class Disable(Enable):
    signature = "disable"
    on = False


class Version(Command):
    signature = "version"

    def run(self, p: Parsed) -> int:
        import update
        have = update.current(root())
        got = update.check(root(), force=True)
        fmt.say(fmt.title(render(TEXT["version_title"], version=have)))
        if got.get("version") and update.newer(got["version"], have):
            fmt.say(fmt.wrap(render(TEXT["version_available"], version=got["version"], headline=got.get("headline"))))
            fmt.say(fmt.commands([UPGRADE_ROW]))
        elif got.get("version"):
            fmt.say(fmt.wrap(TEXT["version_latest"]))
        else:
            fmt.say(fmt.wrap(TEXT["version_unreachable"]))
        return 0


COMMANDS = (Cleanup, CleanupRead, CleanupKeep, Migrate, MigrateRun, Loop, LoopSet, LoopUnset,
            Upgrade, Update, Verify, Settings, Serve, Statusline, Enable, Disable, Version)
