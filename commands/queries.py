import argparse
import os
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from controllers.types import Agents, CONTROLLERS
import features
from engine.record import Record
from engine.transcript import Turn, search as search_transcript
from features.tags.feature import visible
from providers import PROVIDERS
from resources.base import Refused, SYSTEM
from resources.types import AgentRow
from engine.stored import write_text
from engine import runtime
from engine.stored import last_lines


def transcript(record, session: str):
    if not session:
        return []
    row = Agents(record, actor=SYSTEM).by_session(session)
    provider = PROVIDERS.get(row.provider)
    return provider().transcript(row.transcript) if provider else []

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
    for row in Agents(record, actor=SYSTEM)._every():
        provider = PROVIDERS.get(row.provider)
        path = Path(row.transcript).expanduser() if row.transcript else None
        try:
            path = path.resolve(strict=True) if path else None
        except (OSError, RuntimeError):
            continue
        if not provider or not path or not path.is_file() or path in seen:
            continue
        seen.add(path)
        for turn in provider().transcript(path):
            turns.append((turn.at, row.n, turn.line, SourcedTurn(row.provider, row.title, turn)))
    turns.sort(key=lambda item: item[:3])
    return [item[-1] for item in turns]

def search_text(record, term: str, page: int) -> str:
    want = term.lower()
    transcript_matches = "\n".join(turn_text(hit.turn, f"{hit.provider}:{hit.session}  ")
                                   for hit in search_transcript(environment_transcript(record), term, page))
    file_hits = [f"  file  {r.ref}  {name}" + (f" — {tags}" if tags else "")
                 for type_, controller in CONTROLLERS.items() for r in controller(record)._every()
                 for name, tags in r.files.items() if want in name.lower() or want in str(tags).lower()]
    return "\n".join(part for part in (transcript_matches, "\n".join(file_hits)) if part)

def switched(ctx, on: bool) -> str:
    f = runtime.off_file(ctx["record"].root)
    if on:
        f.unlink(missing_ok=True)
        return "the journal is in force"
    f.parent.mkdir(parents=True, exist_ok=True)
    write_text(f, str(time.time()))
    return "the journal is off: the hooks report nothing and hold nothing until journal enable"

def verify(ctx) -> str:
    from providers import PROVIDERS
    root = ctx["record"].root
    lines = [f"root {root}", f"environment {ctx['record'].env}", "off" if runtime.off(root) else "in force"]
    for name, provider in PROVIDERS.items():
        settings = provider().config(root.parent)
        wired = settings.is_file() and "hook.sh" in settings.read_text()
        lines.append(f"{name}: hooks {'wired' if wired else 'NOT wired'} ({settings})")
    live = [p for p in (root / "runtime").glob("seat-*.json") if time.time() - p.stat().st_mtime < 10]
    lines.append(f"engine: {len(live)} running — {', '.join(p.stem.removeprefix('seat-')[:8] for p in live) or 'none'}")
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
    from engine.speed import measure
    return measure(ctx["record"].root, ctx["record"].env, ctx["runs"], ctx["url"], ctx["out"])

def upgrade_here(ctx) -> str:
    from install import upgrade
    root = ctx["record"].root
    return "\n".join(upgrade(root.parent, root))

def halt(ctx) -> str:
    from engine.stop import ask, clear, gone
    record = ctx["record"]
    root = record.root
    left = still_open(record)
    ask(root)
    went = gone(root)
    clear(root)
    said = "the journal is stopped: its viewer, its engine and every service it ran" if went else "the viewer is still answering; see .journal/runtime/viewer.log"
    return "\n".join([said, *left])


def still_open(record) -> list[str]:
    from controllers.types import Works
    from features.messages.answering import unanswered
    works = [f"work {w.n} is still open: {w.title} - journal work end {w.n} --how \"<what landed>\", or journal work park \"<why>\" --n {w.n}"
             for w in Works(record, actor=SYSTEM)._standing()]
    messages = [f"message {m.n} was read and never answered: {m.title}" for m in unanswered(record)]
    return works + messages

WORKTREE_FLAGS = ("--worktree", "-w")


def asked_for(record: Record, args: list[str], ask=input, answering=None) -> str:
    answering = sys.stdin.isatty() if answering is None else answering
    if not answering or "--env" in sys.argv or any(a in WORKTREE_FLAGS or a.startswith("--worktree=") for a in args):
        return record.env
    from controllers.types import Environments
    from engine.sessions import Sessions
    names = [r["title"] for r in Environments(record, actor=SYSTEM).summaries() if not r["deleted"] and not r["completed"]]
    if not names:
        return record.env
    sessions = Sessions(record.root)
    print("journal: which environment?")
    for i, name in enumerate(names, 1):
        print(f"  {i}. {name}" + ("  (an agent is working here)" if sessions.holder(name) else "") + ("  [Enter]" if name == record.env else ""))
    print(f"  {len(names) + 1}. a new environment")
    while True:
        try:
            picked = ask("> ").strip() or str(names.index(record.env) + 1 if record.env in names else len(names) + 1)
        except EOFError:
            return record.env
        if picked.isdigit() and 1 <= int(picked) <= len(names):
            name = names[int(picked) - 1]
            if not sessions.holder(name):
                return name
            print(f"an agent is working {name}; pick another")
        elif picked == str(len(names) + 1):
            try:
                return Environments(record, actor=SYSTEM).create(ask("name: ").strip()).title
            except EOFError:
                return record.env
            except Refused as e:
                print(e)
        else:
            print(f"a number from 1 to {len(names) + 1}")


def supervise(ctx, agent: str) -> str:
    from engine.terminal import run as run_supervisor
    from engine.viewer import start
    record = ctx["record"]
    env = asked_for(record, ctx["args"] or [])
    url = start(record.root, Path.cwd())
    print(f"journal: viewer {url}" if url else "journal: the viewer did not start; see .journal/runtime/viewer.log")
    return str(run_supervisor(record.root, Path.cwd(), env, agent, ctx["args"] or []))

def services(ctx) -> str:
    from engine.services import DOWN, UP, listed, log_file, want
    root = ctx["record"].root
    what, which = ctx["what"], ctx["which"]
    if what == "up":
        return services_up(root)
    if what == "log":
        return tail(log_file(root, which), ctx["lines"])
    if what in ("start", "stop", "restart"):
        if not which:
            raise Refused(f"say which service to {what}: journal services {what} <plugin>.<service>")
        want(root, which, DOWN if what == "stop" else UP, nonce=time.time() if what == "restart" else 0.0)
        return f"{which} is asked to {'stop' if what == 'stop' else 'run'}"
    if what != "list":
        raise Refused(f"services knows list, up, start, stop, restart and log, not {what!r}")
    lines = [f"{s['id']:<28} {s['state']:<10} {s['url']}{'  ' + s['why'] if s['why'] else ''}" for s in listed(root)]
    return "\n".join(lines) or "no plugin declares a service"

def services_up(root: Path) -> str:
    from engine.services import Manager
    from engine.terminal import lifeline
    alive, keeping = lifeline()
    manager = Manager(root, alive)
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
    run(ctx["record"].root, ctx["port"])
    return ""

def decided(ctx) -> str:
    agents = Agents(ctx["record"], actor=SYSTEM)
    row = agents.by_session(ctx["session"] or "cli")
    agents.update(row.n, **{**row.data, AgentRow.decided: ctx["why"]})
    return f"noted: {ctx['why']}"
