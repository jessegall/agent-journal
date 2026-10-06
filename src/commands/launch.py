import os
import shutil
import subprocess
import sys
from pathlib import Path

from commands.menu import Choice, choices_of, pick
from engine.record import Record
from engine.version import version as package_version
from engine.wording import plural
from providers import DRIVERS, PROVIDERS
from resources.base import SYSTEM, Refused

NO_INTERACTION = "--no-interaction"
LAUNCHED = "launched"
SAVED_CURSOR = "\x1b7"
QUESTION_SCREEN = "\x1b8\x1b[J"


def asked_for(record: Record, worktree: str = "", ask=input, answering=None) -> str:
    answering = sys.stdin.isatty() if answering is None else answering
    if "--env" in sys.argv or worktree:
        return record.env
    from controllers.types import Environments
    from engine.sessions import Sessions
    from engine.worktree import linked
    names = [r["title"] for r in Environments(record, actor=SYSTEM).rows.summaries() if not r["deleted"] and not r["completed"]]
    if not answering:
        sessions = Sessions(record.root)
        return record.env if not sessions.holder(record.env) else next((name for name in names if not sessions.holder(name)), record.env)
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
    body = "\n".join(f"│ {line:<{width - 2}} │" for line in lines)
    return f"\x1b[2J\x1b[H┌{rule}┐\n{body}\n└{rule}┘\n{SAVED_CURSOR}"


def asked_slate(record: Record, project: Path, agent: str, ask=input, answering=None) -> bool:
    from features import FEATURES
    from features.clean_slate.slate import held, others, put_back_held, state
    answering = sys.stdin.isatty() if answering is None else answering
    hooks, aside = others(project, agent), [Path(m["from"]) for m in held(record, project, agent)]
    if not answering or not FEATURES["clean_slate"].enabled(record) or not (hooks or aside):
        return False
    last = state(record).get("last", True)
    notes = [*(lines_of(f"Hooks that are not the journal's, in {plural(len(hooks), 'file')}:", hooks)),
             *(lines_of(f"Already set aside by another session, in {plural(len(aside), 'file')}:", aside)),
             "Your skills stay where they are. The hooks are put back when the agent exits or the journal stops."]
    choices = ["Yes, set them aside", "No, put them back" if aside else "No, keep them"]
    if choose("Set aside the other hooks", notes, choices, 0 if last else 1, ask) == 0:
        return True
    put_back_held(record, project, agent)
    return False


def lines_of(heading: str, files: list[Path]) -> list[str]:
    return [heading, *(f"  {f}" for f in files), ""] if files else []


def asked_prompts(record: Record, agent: str, args: list[str], ask=input, answering=None) -> None:
    from features.permission_prompts.skipping import set_skipped, skipped
    answering = sys.stdin.isatty() if answering is None else answering
    driver = DRIVERS.get(agent)
    if not answering or not driver or not driver.SKIP_ARGS or set(driver.SKIP_ARGS) <= set(args):
        return
    notes = [f"{agent.capitalize()} then runs without stopping to ask before each tool call ({' '.join(driver.SKIP_ARGS)}),",
             "so the journal can keep it working. Settings can change this later."]
    picked = choose("Run without permission prompts", notes, ["Yes, skip them", "No, ask me each time"], 0 if skipped(record) else 1, ask)
    if picked is not None:
        set_skipped(record, picked == 0)


def asked_history(record: Record, agent: str, conversation: str, ask=input, answering=None) -> None:
    from controllers.types import Agents
    from engine.sessions import Sessions
    from features.agent_sessions.history import history
    answering = sys.stdin.isatty() if answering is None else answering
    provider = PROVIDERS[agent]()
    seen = conversation and (Sessions(record.root).known(conversation) or Agents(record, actor=SYSTEM).rows.by_title(conversation))
    path = provider.conversation_file(conversation) if conversation and not seen else None
    if not answering or not path:
        return
    notes = [f"The journal has never seen conversation {conversation}. Filling it in puts what you and the agent wrote",
             f"into the chat of {record.env}, already read, so the history is there when you carry on."]
    if choose("Fill the journal from this conversation", notes, ["Yes, fill it in", "No, start from here"], 0, ask) == 0:
        print(f"journal: {history(record, provider, path, conversation)} messages brought in from the conversation")


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


def launch(record: Record, agent: str, given: list[str] | None) -> str:
    from agents.terminal import carried
    from engine.viewer import start
    from features.clean_slate.slate import put_back, remember, set_aside, slate_of
    from engine.worktree import linked
    from engine.sessions import Sessions
    from commands.launch_update import latest_first
    from engine.stop import clear
    project = Path.cwd()
    taken = carried()
    if taken:
        return started(record, project, agent, taken["env"], taken["args"], taken)
    held = latest_first(record)
    if held:
        print(f"journal: carrying on with {package_version()}: {held}")
    driver = DRIVERS[agent]
    driver.binary(os.environ.get("PATH", ""))
    quiet = NO_INTERACTION in (given or [])
    args = [arg for arg in given or [] if arg != NO_INTERACTION]
    ask, answering = (defaults, True) if quiet else (input, None)
    if sys.stdin.isatty() and not quiet:
        subprocess.run(["stty", "sane"], stdin=sys.stdin, check=False)
        print(banner(agent, project))
    resumed = driver.conversation(args) or driver.continued(args, project)
    env = (Sessions(record.root).environment(resumed) if resumed else "") or asked_for(record, driver.worktree(args), ask, answering)
    here = Record(record.root, env)
    args = driver.within(args, env) if env in linked(project) or driver.asks_worktree(args) else args
    put_back(here)
    clear(record.root)
    try:
        args = asked_resume(here, agent, args, ask, answering)
        asked_history(here, agent, driver.conversation(args), ask, answering)
        carrying = driver.resuming(args)
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
    from agents.terminal import supervise as hand_over
    hand_over(record.root, project, env, agent, args, taken)
    return ""
