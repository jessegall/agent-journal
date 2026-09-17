from __future__ import annotations

import fmt
import settings as settings_mod
import tracks
from app import answer, now, package, project, refuse, root, stem
from command import Command, Parsed, number
from templates import render

NOUNS = (("cleanup", "tidy"), ("migrate", "migrations"), ("loop",), ("update",), ("upgrade",),
         ("verify",), ("settings",), ("serve",), ("statusline", "status-line"), ("channel",), ("enable",), ("disable",), ("version",))

TEXT = {
    "settings_here": "set on {env}; the project's is {was}",
    "settings_nowhere": "this session is on no environment, so there is nowhere to set it — "
                        "`journal switch \"<name>\"` first, or edit .journal/settings.json for the project",
    "settings_wants_value": "say what {key} should be here: `journal settings {key} <value>`, "
                            "or `journal settings {key} --off` to give it back to the project",
    "serve_already": "a viewer for this project is already up: {url}",
    "claude_viewer_up": "the viewer is up at {url} — the messages, the to-dos and the conversation are there",
    "claude_viewer_already": "the viewer is already up at {url}",
    "serve_detached": "the viewer is up at {url}, in a session of its own — it outlives this one, "
                      "and whatever started it. Its output goes to {log}; stop it with "
                      "`kill $(lsof -t -iTCP:$(echo {url} | sed 's|.*:||') -sTCP:LISTEN)`",
    "serve_no_answer": "the viewer was started but never answered; what it said is in {log}",
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
    "channel_installed": "the journal channel is added to {path}. Start Claude with it so a message you leave wakes an "
                         "idle session:\n  claude --dangerously-load-development-channels server:journal",
    "channel_taken": "{path} already has a server named journal; it was left as it is",
    "channel_usage": "journal channel --install adds the journal's channel server to .mcp.json",
    "claude_added": "the journal channel is added to {path}",
    "claude_missing": "no `claude` command on your PATH; install Claude Code first",
    "claude_would_run": "would run:",
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

UPGRADE_ROW = ("journal upgrade", "pull it and print what changed; no tests are run")


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
    signature = ('settings {key? : a setting to change here} {value*? : its value on this environment} '
                 '{--off : give it back to the project}')
    writes = True
    reads_bare = True

    def run(self, p: Parsed) -> int:
        import tracks
        here = tracks.current(root(), stem())
        if p.arg("key"):
            return self.here(p, here)
        import hook  # noqa: F401 — its decorators fill the nudge registry
        import nudges
        conf, problems = settings_mod.load(root(), here)
        mine = settings_mod.overrides(root(), here) if here else {}
        path = root() / settings_mod.PATH
        changed = [k for k in settings_mod.DEFAULTS if conf[k] != settings_mod.DEFAULTS[k]]
        # A SETTING HAS A SCOPE, and the row says which: the project's value, or this environment's
        # disagreement with it. Without that a reader cannot tell a value everyone shares from one
        # that is theirs alone, which is the only question a scoped setting raises.
        rows = tuple(
            fmt.Item(title=("* " if k in changed else "  ") + k, text=str(conf[k]),
                     meta=render(TEXT["settings_here"], env=here, was=settings_mod.load(root())[0][k]) if k in mine
                     else render(TEXT["settings_default"], value=d) if k in changed else "")
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

    @staticmethod
    def here(p: Parsed, env: str) -> int:
        """`journal settings <key> <value>` changes it on THIS environment only."""
        import json as _json
        if not env:
            return refuse(TEXT["settings_nowhere"])
        key, raw = p.arg("key"), p.arg("value")
        off = bool(p.option("off"))
        value = None
        if not off:
            if raw is None or raw == "":
                return refuse(render(TEXT["settings_wants_value"], key=key))
            try:                       # a number, a bool or a list as the file would hold it
                value = _json.loads(raw)
            except ValueError:
                value = raw
        ok, message = settings_mod.override(root(), env, key, value, off=off)
        fmt.say(message, error=not ok)
        return 0 if ok else 1


class Serve(Command):
    signature = "serve {--port=} {--open} {--detach}"
    casts = {"port": number("--port")}

    def run(self, p: Parsed) -> int:
        import serve
        if p.option("detach"):
            return self.detach(p)
        try:
            serve.run(root(), project(), port=p.option("port"),
                      open_browser=bool(p.option("open")))
        except SystemExit as e:
            return e.code if isinstance(e.code, int) else 1
        return 0

    @staticmethod
    def detach(p: Parsed) -> int:
        already, url, log = start_viewer(p.option("port"))
        if already:
            fmt.say(render(TEXT["serve_already"], url=url))
            return 0
        if not url:
            return refuse(render(TEXT["serve_no_answer"], log=log))
        fmt.say(render(TEXT["serve_detached"], url=url, log=log))
        return 0


def start_viewer(port=None) -> tuple[bool, str, str]:
    """Put a viewer up for this journal if none is: (was one already, its url, where its output goes).

    IN A SESSION OF ITS OWN, so it outlives whatever started it. A VIEWER THAT VANISHES WAS REAPED,
    NOT CLOSED: `serve` runs in the foreground, so an agent that wants one backgrounds it — and then
    it belongs to that task's process group. A harness killing the tree when memory runs short takes
    the viewer with it, and the user sees a window that shut itself for no reason. Reported by a
    user's colleagues, twice in one session. It matters twice over for `journal claude`, which EXECS
    into Claude Code: a child of this process would not survive the call that replaces it.

    ONE FUNNEL, because two things now want a viewer — `serve --detach` and the start of a session.
    """
    import subprocess
    import sys
    import time
    import serve

    log = root() / "runtime" / "viewer.log"
    already = serve.running(root())
    if already:
        return True, already, str(log.relative_to(root().parent))
    log.parent.mkdir(parents=True, exist_ok=True)
    # where the PACKAGE is, not how it was invoked: argv[0] is "-c" when the CLI runs in-process
    args = [sys.executable, str(package() / "journal.py"), "serve"]
    if port:
        args.append(f"--port={port}")
    with log.open("a") as fh:
        # its own session: the launcher's process group is not its own, so killing that tree leaves it
        subprocess.Popen(args, stdout=fh, stderr=fh, stdin=subprocess.DEVNULL,
                         start_new_session=True, cwd=str(project()))
    for _ in range(60):
        time.sleep(0.25)
        url = serve.running(root())
        if url:
            return False, url, str(log.relative_to(root().parent))
    return False, "", str(log.relative_to(root().parent))


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


def install_channel() -> tuple[bool, Path]:
    """Add the journal's channel server to .mcp.json. (added, the path shown); False when one is already there."""
    import json
    path = project() / ".mcp.json"
    data = json.loads(path.read_text()) if path.is_file() else {}
    servers = data.setdefault("mcpServers", {})
    shown = path.relative_to(project())
    if "journal" in servers:
        return False, shown
    servers["journal"] = {"command": "python3", "args": [".journal/channel.py"]}
    path.write_text(json.dumps(data, indent=2) + "\n")
    return True, shown


class Channel(Command):
    signature = "channel {--install}"

    def run(self, p: Parsed) -> int:
        if not p.option("install"):
            fmt.say(TEXT["channel_usage"])
            return 0
        added, shown = install_channel()
        fmt.say(render(TEXT["channel_installed" if added else "channel_taken"], path=shown))
        return 0


class Claude(Command):
    signature = ("claude {prompt*? : what to ask Claude first} {--continue} {--resume= : a session id} "
                 "{--dry-run}")
    passthrough = True

    def run(self, p: Parsed) -> int:
        import os
        import shlex
        import shutil
        import sys
        added, shown = install_channel()
        if added:
            fmt.say(render(TEXT["claude_added"], path=shown))
        command = ["claude", "--dangerously-load-development-channels", "server:journal"]
        if p.option("continue"):
            command.append("--continue")
        if p.option("resume"):
            command += ["--resume", p.option("resume")]
        command += p.passthrough_options()
        if p.arg("prompt"):
            command.append(p.arg("prompt"))
        if p.option("dry-run"):
            fmt.say(TEXT["claude_would_run"])
            # printed as is: a wrapped command cannot be copied
            print(shlex.join(command))
            return 0
        if not shutil.which("claude"):
            fmt.say(TEXT["claude_missing"])
            return 1
        # THE VIEWER COMES UP WITH THE SESSION. It is where the user works — the messages, the
        # to-dos, the thread — and it was a second command they had to know about and remember.
        # Started before the exec and in a session of its own, so it survives being replaced.
        already, url, _ = start_viewer()
        if url:
            fmt.say(render(TEXT["claude_viewer_already"] if already else TEXT["claude_viewer_up"], url=url))
        os.chdir(project())
        # FLUSH BEFORE THE EXEC. `execvp` replaces the process image without running any of
        # Python's teardown, so anything still sitting in the stdout buffer is simply gone —
        # which is why the line saying the channel was installed has never reached a user who
        # was not on a tty, and why the viewer's url would not have either.
        sys.stdout.flush()
        sys.stderr.flush()
        os.execvp("claude", command)


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
            Upgrade, Update, Verify, Settings, Serve, Statusline, Channel, Claude, Enable, Disable, Version)
