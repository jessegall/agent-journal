"""Builds tests/fixtures/full_project.db.gz, the database of a full project the route timing run measures against, shaped as a journal worked in for weeks: an agent that finished hundreds of the tasks it took in hand, a started plan of many tasks over many phases, sessions long ended, wait checks, the session's subagents and command outputs, a third of them whole runs of the suite, shell calls with what they printed, edits with their texts, and the notices it pinned, most closed. Every row is generated here from a fixed seed and a list of plain words, never copied from a real journal, since the repository is public. Built again, from the checkout's root, when the schema moves far enough that the saved file no longer boots: PYTHONPATH=src python3 -m tests.full_project"""
import gzip
import random
import re
import sqlite3
import subprocess
import sys
import tempfile
import time
from datetime import datetime, timezone
from pathlib import Path

from journal.app import App
from journal.config import Config
from journal.features.voices.voices_options import VoicesOptions
from journal.features.workers.support.worker_runner import WorkerRunner
from journal.features.workers.workers_options import WorkersOptions
from journal.models.agent import Agent
from journal.models.author import Author
from journal.models.check import Check
from journal.models.edit import Edit
from journal.models.command_output import CommandOutput
from journal.models.message import Message
from journal.models.notice import Notice
from journal.models.subagent import Subagent
from journal.models.subagent_state import SubagentState
from journal.models.support.ref import Ref
from journal.models.setting import Setting
from journal.repositories.agents import Agents
from journal.repositories.checks import Checks
from journal.repositories.command_outputs import CommandOutputs
from journal.repositories.edits import Edits
from journal.repositories.environments import Environments
from journal.repositories.messages import Messages
from journal.repositories.notices import Notices
from journal.repositories.scope import PROJECT, Scope
from journal.features.plans.plans_options import PlansOptions
from journal.repositories.setting_rows import SettingRows
from journal.repositories.subagents import Subagents
from journal.repositories.tasks import Tasks
from journal.repositories.workers import Workers
from journal.support.actor import Actor
from journal.support.caller import Caller
from tests.in_process import posted

ROOT = Path(__file__).resolve().parents[1]
FIXTURE = ROOT / "tests" / "fixtures" / "full_project.db.gz"
SEED = 2992
WORDS = ("parser", "header", "footer", "login", "release", "report", "plan", "phase", "query", "index", "page", "list", "row", "table", "link", "worker",
         "branch", "commit", "test", "suite", "shard", "budget", "route", "hook", "entry", "message", "reply", "comment", "doc", "draft", "review", "check",
         "script", "build", "viewer", "panel", "button", "label", "notice", "chart", "count", "cache", "write", "read", "lock", "thread", "queue", "job",
         "timer", "clock", "file", "folder", "path", "name", "title", "brief", "goal", "step", "order", "field", "column", "value", "number", "text")
PLANS, PHASES, PLAN_TASKS, LOOSE_TASKS, FINISHED_TASKS, WORKERS = 30, 3, 8, 400, 150, 40
# plan 1, started last, its first task in the agent's hand
STARTED_PLAN_TASKS, STARTED_PLAN_PHASES = 60, 8
ENDED_SESSIONS, WAIT_CHECKS, BROKEN_WAIT_CHECKS, SUBAGENTS, OUTPUTS = 80, 100, 10, 40, 30
NOTICES, OPEN_NOTICES = 60, 5
# every third command output a run of the whole suite that passed, the rest runs of one test file
SUITE_COMMAND, SUITE_OUTPUT_STEP = "journal suite", 3
# the workers left reported, their work not yet taken in; the rest are merged, so no worker is still out when the project boots, as none is
# in a journal worked in for weeks, and the watch on workers out (workers/jobs/worker_watch.py) never rewrites them while a run measures
IDLE_WORKERS = 5
MESSAGES, TOOL_CALLS, DISPLAYS, COMMENTS, REACTIONS = 4000, 1200, 300, 400, 300
# the user's newest messages, not yet read; the agent read the rest as they came
UNREAD_MESSAGES = 2
DOCS, REPORTS, ABOUT_REPORTS, CHECKS, FACTS, RULES, REMINDERS, QUESTIONS = 80, 60, 20, 25, 40, 30, 30, 20
SPARE_TASKS, SPARE_MESSAGES = 50, 100
# shell calls with what they printed, and edits with the texts before and after, as an agent leaves them over a day
SHELL_CALLS, SHELL_OUTPUT_SENTENCES, EDITS, EDIT_LINES = 100, 30, 100, 40
MAIN = {"X-Journal-Env": "main"}
USER, AGENT = Caller.user("main"), Caller.agent("main", "s1", "claude")


def unpacked(root: Path) -> App:
    """The saved full project laid down as the journal under root, and booted."""
    config = Config(root, port=0)
    config.home.mkdir(parents=True, exist_ok=True)
    with gzip.open(FIXTURE, "rb") as packed:
        config.database.write_bytes(packed.read())
    app = App(config)
    app.runtime().start()
    return app


def phrase(words: random.Random, count: int) -> str:
    return " ".join(words.choice(WORDS) for _ in range(count))


def sentence(words: random.Random) -> str:
    return phrase(words, words.randint(6, 30)).capitalize() + "."


def number(text: str, noun: str) -> int:
    return int(re.search(rf"{noun} (\d+)", text)[1])


def booted(root: Path) -> App:
    subprocess.run(["git", "init", "-q", "-b", "main"], cwd=root, check=True, timeout=30)
    (root / ".gitignore").write_text(".journal/\n")
    subprocess.run(["git", "add", ".gitignore"], cwd=root, check=True, timeout=30)
    subprocess.run(["git", "-c", "user.email=fixture@example.com", "-c", "user.name=Fixture", "commit", "-qm", "start"], cwd=root, check=True, timeout=30)
    app = App(Config(root, port=0))
    settings = app.container.get(SettingRows)
    settings.save(Setting(environment_id=PROJECT, key=VoicesOptions.NAME.key, value="Ada"), Actor.system())
    for key in ("skills.session_start", "skills.after_compaction"):
        settings.set(key, [], Actor.user(1))
    settings.set(PlansOptions.TEST_COMMANDS.key, "pytest, journal suite", Actor.user(1))
    app.runtime().start()
    for name in ("main", "spare"):
        app.container.get(Environments).lookup(name)
    return app


def hook(app: App, type_name: str, **body) -> None:
    posted(app, "/hooks/claude", {"hook_event_name": type_name, "session_id": "s1", **body}, MAIN)


def plans(app: App, words: random.Random) -> list[int]:
    plan(app, words, STARTED_PLAN_TASKS, STARTED_PLAN_PHASES)
    app.console().run(["plan", "approve", "1"], USER)
    return [task for _ in range(PLANS) for task in plan(app, words, PLAN_TASKS, PHASES)]


def plan(app: App, words: random.Random, task_count: int, phase_count: int) -> list[int]:
    console = app.console()
    plan = number(console.run(["plan", "create", phrase(words, 4), "--brief", sentence(words)], USER).text, "plan")
    added = [number(console.run(["plan", "add", str(plan), phrase(words, 5), "--brief", sentence(words)], USER).text, "task") for _ in range(task_count)]
    for phase in range(1, phase_count + 1):
        console.run(["plan", "phase", str(plan), phrase(words, 3), "--when", sentence(words)], USER)
        console.run(["plan", "todos", str(plan), str(phase), *(str(task) for task in added[phase - 1::phase_count])], USER)
    return added


def loose_tasks(app: App, words: random.Random) -> list[int]:
    console = app.console()
    tasks = [number(console.run(["task", "create", phrase(words, 5), "--brief", sentence(words)], AGENT).text, "task") for _ in range(LOOSE_TASKS)]
    for task in tasks[:FINISHED_TASKS]:
        for command in (["task", "start", str(task)], ["task", "complete", str(task), "--how", sentence(words)]):
            ran = console.run(command, AGENT)
            assert ran.code == 0, ran.error
    set_aside, waiting, blocked = tasks[FINISHED_TASKS:FINISHED_TASKS + 3]
    for command in (["task", "start", str(set_aside)], ["task", "block", str(set_aside), sentence(words)],
                    ["task", "start", str(waiting)], ["task", "block", str(waiting), sentence(words), "--until", "false"],
                    ["task", "block", str(blocked), sentence(words)]):
        ran = console.run(command, AGENT)
        assert ran.code == 0, ran.error
    return tasks


def workers(app: App, words: random.Random) -> None:
    console, settings, limits = app.console(), app.container.get(SettingRows), (WorkersOptions.WORKER_LIMIT, WorkersOptions.PROFILE_LIMIT)
    for limit in limits:
        settings.set(limit.key, 0, Actor.user(1))
    for n in range(WORKERS):
        task = number(console.run(["task", "create", f"the job of worker {n + 1}", "--brief", sentence(words)], AGENT).text, "task")
        dispatch = console.run(["worker", "dispatch", f"Worker {n + 1}", "--task", str(task), "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet"], AGENT)
        assert dispatch.code == 0, dispatch.error
    for limit in limits:
        settings.set(limit.key, limit.default, Actor.user(1))
    with app.container.get(Scope).environment(app.container.get(Environments).existing("main").row_id):
        crew, tasks, runner = app.container.get(Workers), app.container.get(Tasks), app.container.get(WorkerRunner)
        for worker in crew.scoped():
            runner.recorded_end(worker, Actor.system())
        app.runtime().deferred.drain()
        for worker in crew.scoped()[IDLE_WORKERS:]:
            holder_tasks = tasks.holder_task_ids(Ref.build(worker))
            tasks.release(Ref.build(worker), Actor.system())
            crew.save(crew.find(worker.row_id).merged(holder_tasks[0] if holder_tasks else 0, time.time()), Actor.system())
    app.runtime().deferred.drain()


def chat(app: App, words: random.Random) -> list[int]:
    messages = app.container.get(Messages)
    with app.container.get(Scope).environment(app.container.get(Environments).existing("main").row_id):
        saved = [messages.save(Message(author=Author.USER, text=sentence(words), read_at=None if n >= MESSAGES - 2 * UNREAD_MESSAGES else datetime.now(timezone.utc)) if n % 2 == 0 else Message(author=Author.AGENT, session="s1", text=sentence(words)), Actor.user(1) if n % 2 == 0 else Actor.agent("s1")) for n in range(MESSAGES)]
    return [message.row_id for message in saved]


def hooks(app: App, words: random.Random) -> None:
    for n in range(TOOL_CALLS):
        call = {"tool_name": "Read", "tool_input": {"file_path": f"src/{words.choice(WORDS)}.py"}, "tool_use_id": f"t-{n}"}
        hook(app, "PreToolUse", **call)
        hook(app, "PostToolUse", **call, tool_response="")
        app.runtime().deferred.drain()
    for n in range(SHELL_CALLS):
        call = {"tool_name": "Bash", "tool_input": {"command": f"grep -rn {words.choice(WORDS)} src"}, "tool_use_id": f"s-{n}"}
        hook(app, "PreToolUse", **call)
        hook(app, "PostToolUse", **call, tool_response={"stdout": "\n".join(sentence(words) for _ in range(SHELL_OUTPUT_SENTENCES)), "stderr": ""})
        app.runtime().deferred.drain()
    for _ in range(DISPLAYS):
        hook(app, "MessageDisplay", message=sentence(words))
    app.runtime().deferred.drain()


def writing(app: App, words: random.Random, plan_tasks: list[int]) -> None:
    for type_name, count in (("docs", DOCS), ("reports", REPORTS)):
        for _ in range(count):
            posted(app, f"/journal/{type_name}", {"title": phrase(words, 4), "abstract": phrase(words, 6), "body": "\n\n".join(sentence(words) for _ in range(12))}, MAIN)
    with tempfile.TemporaryDirectory() as folder:
        body = Path(folder) / "report.md"
        for n in range(ABOUT_REPORTS):
            body.write_text("\n\n".join(sentence(words) for _ in range(8)))
            app.console().run(["report", "create", phrase(words, 4), "--abstract", phrase(words, 6), "--file", str(body), "--about", f"plans:{n % PLANS + 1}", f"tasks:{plan_tasks[n]}"], AGENT)


def memory(app: App, words: random.Random) -> None:
    for _ in range(CHECKS):
        posted(app, "/journal/checks", {"title": phrase(words, 3), "brief": sentence(words), "command": "true"}, MAIN)
    for type_name, count in (("facts", FACTS), ("rules", RULES), ("reminders", REMINDERS), ("questions", QUESTIONS)):
        for _ in range(count):
            posted(app, f"/journal/{type_name}", {"text": sentence(words)}, MAIN)


def remarks(app: App, words: random.Random, tasks: list[int], messages: list[int]) -> None:
    for n in range(COMMENTS):
        posted(app, "/journal/messages", {"on": f"tasks:{tasks[n % len(tasks)]}", "text": sentence(words)}, MAIN)
    for n in range(REACTIONS):
        posted(app, f"/journal/messages/{messages[n * 7 % len(messages)]}/react", {"emoji": words.choice(("👍", "👀", "✅"))}, MAIN)


def history(app: App, words: random.Random) -> None:
    main_id, system = app.container.get(Environments).existing("main").row_id, Actor.system()
    with app.container.get(Scope).environment(main_id):
        for n in range(ENDED_SESSIONS):
            app.container.get(Agents).save(Agent(environment_id=main_id, session=f"ended-{n}", provider="claude", state="ended"), system)
        for n in range(WAIT_CHECKS):
            fault = "the command was not found" if n < BROKEN_WAIT_CHECKS else ""
            # a broken wait waits to be run by hand, so no check runs while a run measures
            app.container.get(Checks).save(Check(title=f"the wait for {phrase(words, 4)} ends when this passes", brief=sentence(words), command="true", interval=0 if fault else 60, wait_target=True, last_passed=False if fault else True, last_fault=fault), system)
        for n in range(SUBAGENTS):
            brief = " ".join(sentence(words) for _ in range(12))
            app.container.get(Subagents).save(Subagent(environment_id=main_id, dispatch=f"sub:{n}", dispatcher="s1", task=phrase(words, 5), brief=brief, agent_type="Explore", session=f"agent-{n}", state=SubagentState.FINISHED), system)
        for n in range(EDITS):
            before, after = "\n".join(sentence(words) for _ in range(EDIT_LINES)), "\n".join(sentence(words) for _ in range(EDIT_LINES))
            app.container.get(Edits).save(Edit(environment_id=main_id, session="s1", path=f"src/{words.choice(WORDS)}.py", time=time.time(), added=EDIT_LINES, removed=EDIT_LINES, tool_use=n + 1, old_text=before, new_text=after), system)
        for n in range(OUTPUTS):
            command = SUITE_COMMAND if n % SUITE_OUTPUT_STEP == 0 else f"python3 -m pytest -q tests/test_{words.choice(WORDS)}.py"
            app.container.get(CommandOutputs).save(CommandOutput(environment_id=main_id, chain=f"c-{n}", command=command, session="s1", ended=True, status=0, summary="\n".join(sentence(words) for _ in range(8))), system)


def notices(app: App, words: random.Random) -> None:
    main_id, system = app.container.get(Environments).existing("main").row_id, Actor.system()
    with app.container.get(Scope).environment(main_id):
        for n in range(NOTICES):
            notice = Notice(environment_id=main_id, title=phrase(words, 6), link=f"https://example.com/{words.choice(WORDS)}", label="Open")
            app.container.get(Notices).save(notice if n >= NOTICES - OPEN_NOTICES else notice.closed(datetime.now(timezone.utc)), system)


def started_plan(app: App) -> None:
    started = app.console().run(["plan", "start", "1"], AGENT)
    assert started.code == 0, started.error


def spare(app: App, words: random.Random) -> None:
    spare_env = {"X-Journal-Env": "spare"}
    for _ in range(SPARE_TASKS):
        posted(app, "/journal/tasks", {"title": phrase(words, 4)}, spare_env)
    for _ in range(SPARE_MESSAGES):
        posted(app, "/journal/messages", {"text": sentence(words)}, spare_env)


def saved(app: App) -> None:
    with tempfile.TemporaryDirectory() as folder:
        copy = Path(folder) / "journal.db"
        with sqlite3.connect(app.config.database) as live, sqlite3.connect(copy) as target:
            live.backup(target)
        with sqlite3.connect(copy) as target:
            target.execute("VACUUM")
        FIXTURE.parent.mkdir(parents=True, exist_ok=True)
        with gzip.GzipFile(FIXTURE, "wb", mtime=0) as packed:
            packed.write(copy.read_bytes())


def main() -> int:
    WorkerRunner.start = lambda self, worker, actor: None
    words = random.Random(SEED)
    with tempfile.TemporaryDirectory() as folder:
        app = booted(Path(folder))
        try:
            plan_tasks = plans(app, words)
            hook(app, "SessionStart")
            tasks = plan_tasks + loose_tasks(app, words)
            workers(app, words)
            messages = chat(app, words)
            hooks(app, words)
            writing(app, words, plan_tasks)
            memory(app, words)
            remarks(app, words, tasks, messages)
            history(app, words)
            notices(app, words)
            started_plan(app)
            spare(app, words)
            app.runtime().deferred.drain()
            saved(app)
        finally:
            app.runtime().stop()
    print(f"wrote {FIXTURE.relative_to(ROOT)}, {FIXTURE.stat().st_size // 1024} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
