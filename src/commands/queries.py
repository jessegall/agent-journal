import argparse
import os
import time
from dataclasses import dataclass
from pathlib import Path
from controllers.types import Agents, CONTROLLERS
import features
from commands.launch import launch
from engine.record import Record
from engine.seats import seats
from engine.transcript import Turn, search as search_transcript
from features.command_tags.reading import visible
from providers import PROVIDERS
from resources.base import Refused, SYSTEM
from resources.types import AgentRow
from engine import runtime
from engine.stored import last_lines


def transcript(record, session: str):
    if not session:
        return []
    row = Agents(record, actor=SYSTEM).by_session(session)
    provider = PROVIDERS.get(row.provider)
    return provider().turns(row.transcript) if provider else []

def turn_text(turn, source: str = "") -> str:
    return f"{source}{turn.line:>6}  {turn.who:<7} {visible(turn.text)}"

def say(turns) -> str:
    return "\n".join(turn_text(turn) for turn in turns)

@dataclass(frozen=True)
class SourcedTurn:
    provider: str
    session: str
    turn: Turn

    @property
    def text(self) -> str:
        return self.turn.text

def environment_transcript(record) -> list[SourcedTurn]:
    seen = set()
    turns = []
    for row in Agents(record, actor=SYSTEM).rows.every():
        provider = PROVIDERS.get(row.provider)
        path = Path(row.transcript).expanduser() if row.transcript else None
        try:
            path = path.resolve(strict=True) if path else None
        except (OSError, RuntimeError):
            continue
        if not provider or not path or not path.is_file() or path in seen:
            continue
        seen.add(path)
        for turn in provider().turns(path):
            turns.append((turn.at, row.n, turn.line, SourcedTurn(row.provider, row.title, turn)))
    turns.sort(key=lambda item: item[:3])
    return [item[-1] for item in turns]

def search_text(record, term: str, page: int) -> str:
    want = term.lower()
    transcript_matches = "\n".join(turn_text(hit.turn, f"{hit.provider}:{hit.session}  ")
                                   for hit in search_transcript(environment_transcript(record), term, page))
    file_hits = [f"  file  {r.ref}  {name}" + (f" — {tags}" if tags else "")
                 for type_, controller in CONTROLLERS.items() for r in controller(record).rows.every()
                 for name, tags in r.files.items() if want in name.lower() or want in str(tags).lower()]
    return "\n".join(part for part in (transcript_matches, "\n".join(file_hits)) if part)

def switched(ctx, on: bool) -> str:
    if on:
        runtime.OFF.lower_flag(ctx["record"].root)
        return "the journal is in force"
    runtime.OFF.raise_flag(ctx["record"].root)
    return "the journal is off: the hooks report nothing and hold nothing until journal enable"

def verify(ctx) -> str:
    root = ctx["record"].root
    lines = [f"root {root}", f"environment {ctx['record'].env}", "off" if runtime.off(root) else "in force"]
    for name, provider in PROVIDERS.items():
        settings = provider().config(root.parent)
        wired = settings.is_file() and "hook.sh" in settings.read_text()
        lines.append(f"{name}: hooks {'wired' if wired else 'NOT wired'} ({settings})")
    live = seats(root, within=10)
    lines.append(f"engine: {len(live)} running — {', '.join(seat.terminal[:8] for seat in live) or 'none'}")
    row = Agents(ctx["record"], actor=ctx["actor"]).by_session(ctx["session"]) if ctx["session"] else None
    if row:
        lines.append(f"this session: {row.status or '?'} after {row.event or '?'}, {row.uses} tool uses")
    return "\n".join(lines)

def settings_text(ctx) -> str:
    record = ctx["record"]
    out = [f"settings on {record.env} ({record.home / 'settings.json'})"]
    for name, f in features.FEATURES.items():
        out.append(f"  features.{name:<14} {'on' if f.enabled(record) else 'off'}   {f.trigger or ''}")
    for key in Record.SETTINGS:
        if key != Record.features and record.setting(key):
            out.append(f"  {key}: {record.setting(key)}")
    out.append("  change one: journal settings are written by the viewer's Settings page, or POST /api/<env>/settings")
    return "\n".join(out)

def help_text(word: str) -> str:
    from commands.parser import parser
    p = parser()
    if not word:
        return p.format_help()
    for action in p._actions:
        if isinstance(action, argparse._SubParsersAction) and word in action.choices:
            return action.choices[word].format_help()
    return f"no command {word!r}"

def speed(ctx) -> str:
    from commands.speed import measure
    return measure(ctx["record"].root, ctx["record"].env, ctx["runs"], ctx["url"], ctx["out"])

def upgrade_here(ctx) -> str:
    from install import upgrade
    root = ctx["record"].root
    return "\n".join(upgrade(root.parent, root))

def halt(ctx) -> str:
    from engine.stop import ask, clear, ended
    record = ctx["record"]
    root = record.root
    left = still_open(record)
    ask(root)
    from features.clean_slate.slate import put_back
    put_back(record)
    went = ended(root)
    clear(root)
    summary = "the journal is stopped: its viewer, its engine and every service it ran" if went else "the server did not stop, even when told to end; see .journal/runtime/viewer.log"
    return "\n".join([summary, *left])


def still_open(record) -> list[str]:
    from controllers.types import Works
    from features import FEATURES
    from features.messages.answering import unanswered
    works = [f"work {w.n} is still open: {w.title} - journal work end {w.n} --how \"<what landed>\", or journal work park \"<why>\" --n {w.n}"
             for w in Works(record, actor=SYSTEM).rows.standing()]
    messages = [f"message {m.n} was read and never answered: {m.title}" for m in unanswered(FEATURES["messages"].journal.at(record))]
    return works + messages

def attached(ctx) -> str:
    from agents.screen import attach
    return attach(ctx["record"].root, ctx["target"])


def supervise(ctx, agent: str) -> str:
    return launch(ctx["record"], agent, ctx["args"])


def ended(ctx) -> str:
    from engine.sessions import Sessions
    from features.clean_slate.slate import put_back
    from engine.stop import ask
    from engine.typist import live
    put_back(ctx["record"])
    kept_work(Path.cwd())
    root = ctx["record"].root
    if not live(root) and not Sessions(root).running():
        ask(root)
    return ""


def kept_work(cwd: Path) -> None:
    from engine.worktree import checkout, git, keep, main_checkout, repositories
    from providers import workspace_folders
    top = checkout(cwd, workspace_folders())
    if not top:
        return
    for place in [top] if (top / ".git").exists() else repositories(top):
        keep(main_checkout(place), top.name, git(place, "branch", "--show-current").stdout.strip())


def healed(ctx) -> str:
    from engine.heal import heal
    return heal(ctx["record"].root)

def services(ctx) -> str:
    from engine.services import DOWN, UP, listed, log_file, want
    from features.plugins.services import plugin_services
    root = ctx["record"].root
    action, which = ctx["action"], ctx["which"]
    if action == "up":
        return services_up(root)
    if action == "log":
        return tail(log_file(root, which), ctx["lines"])
    if action in ("start", "stop", "restart"):
        if not which:
            raise Refused(f"say which service to {action}: journal services {action} <plugin>.<service>")
        want(root, which, DOWN if action == "stop" else UP, nonce=time.time() if action == "restart" else 0.0)
        return f"{which} is asked to {'stop' if action == 'stop' else 'run'}"
    if action != "list":
        raise Refused(f"services knows list, up, start, stop, restart and log, not {action!r}")
    lines = [f"{s['id']:<28} {s['state']:<10} {s['url']}{'  ' + s['why'] if s['why'] else ''}" for s in listed(root, (plugin_services,))]
    return "\n".join(lines) or "no plugin declares a service"

def services_up(root: Path) -> str:
    from engine.services import Manager
    from features.plugins.services import plugin_services
    from agents.terminal import lifeline
    alive, keeping = lifeline()
    manager = Manager(root, alive, sources=(plugin_services,))
    print("journal: keeping the plugins' services up; Ctrl-C stops them")
    try:
        while True:
            manager.tick()
            time.sleep(1.0)
    except KeyboardInterrupt:
        pass
    finally:
        os.close(keeping)
    return "the services are stopped"

def tail(path: Path, lines: int) -> str:
    return last_lines(path, lines) if path.is_file() else f"nothing is logged in {path}"

def serve_forever(ctx) -> str:
    from serve import run
    from engine.viewer import SERVED_ON, free_from
    run(ctx["record"].root, ctx["port"] or free_from(SERVED_ON))
    return ""

def decided(ctx) -> str:
    agents = Agents(ctx["record"], actor=SYSTEM)
    named = agents.rows.by_title(ctx["session"]) if ctx["session"] else None
    row = named if named is not None and named.at else agents.primary()
    if row is None:
        raise Refused("no agent session is running on this environment to note it on")
    agents.update(row.n, **{**row.data, AgentRow.decided: ctx["why"]})
    return f"noted: {ctx['why']} - the checkpoint at {int(row.context)}% is released"
