import argparse
import os
import shutil
import subprocess
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from controllers.types import Agents, CONTROLLERS
import features
from engine.record import Record
from engine.transcript import Turn, search as search_transcript
from features.command_tags.reading import visible
from providers import DRIVERS, PROVIDERS
from commands.menu import Choice, choices_of, pick
from resources.base import Refused, SYSTEM
from resources.types import AgentRow
from engine.stored import write_text
from engine import runtime
from engine.wording import plural
from engine.stored import last_lines
from engine.version import version as package_version


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
    live = [p for p in runtime.sessions(root).glob("*/seat.json") if time.time() - p.stat().st_mtime < 10]
    lines.append(f"engine: {len(live)} running — {', '.join(p.parent.name[:8] for p in live) or 'none'}")
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
    from features.clean_slate.slate import put_back
    put_back(record)
    went = gone(root)
    clear(root)
    summary = "the journal is stopped: its viewer, its engine and every service it ran" if went else "the viewer is still answering; see .journal/runtime/viewer.log"
    return "\n".join([summary, *left])


def still_open(record) -> list[str]:
    from controllers.types import Works
    from features import FEATURES
    from features.messages.answering import unanswered
    works = [f"work {w.n} is still open: {w.title} - journal work end {w.n} --how \"<what landed>\", or journal work park \"<why>\" --n {w.n}"
             for w in Works(record, actor=SYSTEM)._standing()]
    messages = [f"message {m.n} was read and never answered: {m.title}" for m in unanswered(FEATURES["messages"].journal.at(record))]
    return works + messages

NO_INTERACTION = "--no-interaction"
LAUNCHED = "launched"
SAVED_CURSOR = "\x1b7"
QUESTION_SCREEN = "\x1b8\x1b[J"


def asked_for(record: Record, worktree: str = "", ask=input, answering=None) -> str:
    answering = sys.stdin.isatty() if answering is None else answering
    if not answering or "--env" in sys.argv or worktree:
        return record.env
    from controllers.types import Environments
    from engine.sessions import Sessions
    from engine.worktree import linked
    names = [r["title"] for r in Environments(record, actor=SYSTEM).summaries() if not r["deleted"] and not r["completed"]]
    if not names:
        return record.env
    sessions = Sessions(record.root)
    worktrees = linked(record.root.parent)
    choices = [Choice(name, tuple(badge for badge, on in (("worktree", name in worktrees), ("agent working", sessions.holder(name))) if on))
               for name in names] + [Choice("A new environment")]
    free = [i for i, name in enumerate(names) if not sessions.holder(name)]
    default = names.index(record.env) if record.env in names and names.index(record.env) in free else (free or [len(names)])[0]
    while True:
        picked = choose("Which environment", [], choices, default, ask)
        if picked is None:
            return record.env
        if picked < len(names):
            holder = sessions.holder(names[picked])
            if not holder:
                return names[picked]
            notes = [f"An agent is working {names[picked]}. Taking it over tells that agent and moves it off."]
            if choose(f"Take over {names[picked]}", notes, ["Yes, take it over", "No, pick another"], 1, ask) == 0:
                sessions.evict(holder, "a new session", names[picked], "taken over at start")
                return names[picked]
        try:
            return Environments(record, actor=SYSTEM).create(ask("    Name: ").strip()).title
        except EOFError:
            return record.env
        except Refused as e:
            print(f"    {e}")
        else:
            print(f"a number from 1 to {len(names) + 1}")


def defaults(_: str) -> str:
    return ""


def choose(heading: str, notes: list[str], choices: list, default: int, ask=input) -> int | None:
    if ask is defaults:
        return default
    if sys.stdout.isatty():
        print(QUESTION_SCREEN, end="")
    if ask is input and sys.stdin.isatty() and sys.stdout.isatty():
        return pick(heading, notes, choices, default)
    print(f"\n  {heading}\n  {'─' * len(heading)}")
    if notes:
        print("", *(f"    {line}" for line in notes), sep="\n")
    print("")
    for i, choice in enumerate(choices_of(choices), 1):
        print(f"    {i}  {choice.label}" + "".join(f"  [{badge}]" for badge in choice.badges) + ("   ← Enter" if i - 1 == default else ""))
    while True:
        try:
            picked = ask("\n  > ").strip() or str(default + 1)
        except EOFError:
            return None
        if picked.isdigit() and 1 <= int(picked) <= len(choices):
            return int(picked) - 1
        print(f"    A number from 1 to {len(choices)}.")


def banner(agent: str, project: Path) -> str:
    width = max(40, shutil.get_terminal_size().columns - 4)
    version = package_version()
    lines = [f"agent-journal {version}", "", f"You're about to start {agent.capitalize()} under the journal,", f"in {project}.", "",
             "A question or two first: move with ↑ ↓ and pick with Enter."]
    rule = "─" * width
    return "\x1b[2J\x1b[H" + "\n".join([f"┌{rule}┐", *(f"│ {line:<{width - 2}} │" for line in lines), f"└{rule}┘", ""]) + SAVED_CURSOR


def asked_slate(record: Record, project: Path, agent: str, ask=input, answering=None) -> bool:
    from features import FEATURES
    from features.clean_slate.slate import others, state
    answering = sys.stdin.isatty() if answering is None else answering
    hooks = others(project, agent)
    if not answering or not FEATURES["clean_slate"].enabled(record) or not hooks:
        return False
    last = state(record).get("last", True)
    notes = [f"Hooks that are not the journal's, in {plural(len(hooks), 'file')}:", *(f"  {f.name}" for f in hooks),
             "", "Your skills stay where they are. The hooks are put back when the agent exits or the journal stops."]
    return choose("Set aside the other hooks", notes, ["Yes, set them aside", "No, keep them"], 0 if last else 1, ask) == 0


def asked_prompts(record: Record, agent: str, args: list[str], ask=input, answering=None) -> None:
    from features.permission_prompts.feature import skipped
    answering = sys.stdin.isatty() if answering is None else answering
    driver = DRIVERS.get(agent)
    if not answering or not driver or not driver.SKIP_ARGS or set(driver.SKIP_ARGS) <= set(args):
        return
    notes = [f"{agent.capitalize()} then runs without stopping to ask before each tool call ({' '.join(driver.SKIP_ARGS)}),",
             "so the journal can keep it working. Settings can change this later."]
    picked = choose("Run without permission prompts", notes, ["Yes, skip them", "No, ask me each time"], 0 if skipped(record) else 1, ask)
    if picked is not None:
        record.set_setting("permission_prompts", {**record.setting("permission_prompts", {}), "skip": picked == 0})


def asked_resume(record: Record, agent: str, args: list[str], ask=input, answering=None) -> list[str]:
    from engine.sessions import Sessions
    answering = sys.stdin.isatty() if answering is None else answering
    driver = DRIVERS.get(agent)
    worked = (driver and driver.worktree(args)) or record.env
    earlier = Sessions(record.root).last(worked, agent) if driver else ""
    if not answering or not earlier or driver.resuming(args):
        return args
    last = [arg for arg in record.setting(LAUNCHED, {}).get(agent, []) if arg not in args]
    notes = [f"An earlier {agent.capitalize()} session worked {worked}. Carrying on opens that conversation again,",
             f"started as before{': ' + ' '.join(last) if last else ''}, without asking the other questions."]
    picked = choose("Carry on from the last session", notes, ["Yes, carry on", "No, start a new one"], 0, ask)
    return driver.resumed([*args, *last], earlier) if picked == 0 else args


def supervise(ctx, agent: str) -> str:
    from engine.terminal import carried
    from engine.viewer import start
    from features.clean_slate.slate import put_back, remember, set_aside, slate_of
    from engine.worktree import linked
    from features.auto_update.launch import latest_first
    from engine.stop import clear
    record = ctx["record"]
    project = Path.cwd()
    taken = carried()
    if taken:
        return started(record, project, agent, taken["env"], taken["args"], taken)
    held = latest_first(record)
    if held:
        print(f"journal: carrying on with {package_version()}: {held}")
    quiet = NO_INTERACTION in (ctx["args"] or [])
    args = [arg for arg in ctx["args"] or [] if arg != NO_INTERACTION]
    ask, answering = (defaults, True) if quiet else (input, None)
    if sys.stdin.isatty() and not quiet:
        subprocess.run(["stty", "sane"], stdin=sys.stdin, check=False)
        print(banner(agent, project))
    driver = DRIVERS[agent]
    env = asked_for(record, driver.worktree(args), ask, answering)
    here = Record(record.root, env)
    args = driver.within(args, env) if env in linked(project) else args
    put_back(here)
    clear(record.root)
    try:
        given = args
        args = asked_resume(here, agent, args, ask, answering)
        carrying = driver.resuming(args) and not driver.resuming(given)
        if not carrying:
            asked_prompts(here, agent, args, ask, answering)
        if slate_of(here) if carrying else asked_slate(here, project, agent, ask, answering):
            print(f"journal: {set_aside(here, project, agent)}")
        else:
            remember(here, False)
        here.set_setting(LAUNCHED, {**here.setting(LAUNCHED, {}), agent: driver.unresumed(args)})
        url = start(record.root, project)
        print(f"journal: viewer {url}" if url else "journal: the viewer did not start; see .journal/runtime/viewer.log")
    except BaseException:
        put_back(here)
        raise
    return started(record, project, agent, env, args)


def started(record: Record, project: Path, agent: str, env: str, args: list[str], taken: dict | None = None) -> str:
    from engine.terminal import supervise as hand_over
    hand_over(record.root, project, env, agent, args, taken)
    return ""


def ended(ctx) -> str:
    from features.clean_slate.slate import put_back
    from engine.stop import ask
    from engine.typist import live
    put_back(ctx["record"])
    if not live(ctx["record"].root):
        ask(ctx["record"].root)
    return ""


def healed(ctx) -> str:
    from engine.heal import heal
    return heal(ctx["record"].root)

def services(ctx) -> str:
    from engine.services import DOWN, UP, listed, log_file, want
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
    named = agents._titled(ctx["session"]) if ctx["session"] else None
    row = named if named is not None and named.at else agents.primary()
    if row is None:
        raise Refused("no agent session is running on this environment to note it on")
    agents.update(row.n, **{**row.data, AgentRow.decided: ctx["why"]})
    return f"noted: {ctx['why']} - the checkpoint at {int(row.context)}% is released"
