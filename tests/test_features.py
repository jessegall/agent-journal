"""The first features through the real server: the briefing at session start, and the memory hold at a context mark."""
import argparse

import json
import os
import re
import signal
import subprocess
import time as timing
from contextlib import contextmanager
from dataclasses import asdict, replace
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request as HttpRequest, urlopen

import pytest

from shell_verbs import ShellVerbs
from worker_dispatch import dispatched, started_run, tokenless_run
from journal.repositories.workers import Workers

from journal.support.listener_queue import ListenerQueue
from journal.events.listener import Listener
from journal.support.command_shape import CommandShape, SETUP_COMMANDS
from journal.events.announcer import Announcer
from journal.providers.claude import Claude
from journal.providers.support.worker_outcome import WorkerOutcome
from journal.support.tool_call import ToolCall

from journal.app import App
from journal.sync.team_account import TeamAccount
from journal.engine.support.session_agents import SessionAgents
from journal.config import Config
from journal.supervisor_link import SupervisorLink
from journal.features.workers.support.worker_branch import WorkerBranch
from journal.features.workers.support.worker_runner import WorkerRunner
from journal.models.worker_state import WorkerState
from journal.support.actor import Actor
from journal.support.agent_token import AgentToken
from journal.models.plugin import Plugin as PluginRow
from journal.models.support.plugin_manifest import PluginManifest
from journal.repositories.plugins import Plugins as PluginRows
from journal.models.setting import Setting
from journal.support.supervisor_reply import SupervisorReply
from journal.repositories.scope import Scope
from journal.repositories.setting_rows import SettingRows
from journal.support.caller import Caller
from journal.engine.state_machine import StateMachine
from journal.features.sequences.support.run_tracker import RunTracker
from journal.support.release import Release
from journal.features.updates.support.updater import Updater
from journal.features.tasks.states.working import Working
from journal.repositories.subagents import Subagents

from tests.old_columns import old_columns
from tests.user_settings import user_set
from tests.agent_hooks import woken_capture, pinned_clock, silent_tick, tick_at
from tests.in_process import answered, get_answer, posted
from tests.main_journal import main_journal
from journal.features.plugins.plugins_options import PluginsOptions
from journal.features.shell.shell_nudges import ShellNudges
from journal.features.tasks.tasks_nudges import TasksNudges
from journal.features.tasks.tasks_options import TasksOptions
from journal.support.message_thread import MessageThread
from journal.features.briefing.briefing_options import BriefingOptions
from journal.features.messages.messages_nudges import MessagesNudges
from journal.features.workers.fitness_options import FitnessOptions
from journal.features.workers.workers_options import WorkersOptions
from journal.support.time_source import TimeSource
from journal.console.commands.environment_command import MEMORY_LINE
from journal.features.briefing.briefing_nudges import BriefingNudges
from journal.features.etiquette.etiquette_nudges import EtiquetteNudges
from journal.features.faults.faults_nudges import FaultsNudges
from journal.features.sequences.sequences_nudges import SequencesNudges
from journal.features.skills.skills_nudges import SkillsNudges
from journal.features.workers.workers_nudges import WorkersNudges
from tests.nudge_lines import has_nudge, nudge_reached
from journal.features.questions.questions_nudges import QuestionsNudges
from journal.features.voices.voices_nudges import VoicesNudges
from journal.features.dumps.dumps_nudges import DumpsNudges
from journal.features.git.git_nudges import GitNudges
from journal.features.plugins.plugins_nudges import PluginsNudges
from journal.features.secrets.secrets_nudges import SecretsNudges
from journal.support.classification_table import ClassificationTable
from journal.support.command_classifier import CommandClassifier
from journal.support.table_schema import TableSchema
from journal.features.hydration.hydration_nudges import HydrationNudges
from journal.features.usage.usage_nudges import UsageNudges
from journal.features.client_errors.client_errors_nudges import ClientErrorsNudges
from journal.features.reviewing.reviewing_nudges import ReviewingNudges
from journal.features.memory.memory_nudges import MemoryNudges
from journal.features.plans.plans_nudges import PlansNudges
from journal.features.messages.commands.message_command import DUPLICATE_REPLY_LINE

AGENT = Caller.agent("main", "s1", "claude")
USER = Caller.user("main")
# the shipped command table, read once for the tests that decode a tool call by hand
TABLE = ClassificationTable(Config.rooted(Path(__file__).parent), TableSchema())
SHAPES = CommandShape(TABLE)
CLASSIFIER = CommandClassifier(TABLE, SHAPES)
MAIN = 1
"""The id of main, the environment a fresh journal makes at boot: what a test reads directly, it reads there."""
from journal.models.agent import Agent

EVENT_AGENT = Agent(environment_id=1, session="s1", provider="claude")


def agent_row(app: App, session: str = "s1", environment_id: int = 1, provider: str = "claude") -> Agent:
    with app.container.get(Scope).environment(environment_id):
        return app.container.get(SessionAgents).agent(session, environment_id, provider)


def viewer(app, path: str, body: dict | None = None) -> dict:
    """A POST to the journal's API as the viewer sends it, the user's, answered in-process."""
    status, answer = posted(app, f"/journal/{path}", body or {}, {"X-Journal-Env": "main"})
    assert status < 400, answer
    return answer


@pytest.fixture
def app(app: App):
    with app.container.get(Scope).environment(MAIN):
        yield app


@pytest.fixture(scope="module")
def boot():
    return booted


def booted(root: Path, patch: pytest.MonkeyPatch) -> App:
    """A journal started on a free port; no worker process starts, since a dispatched worker would run its provider headless and file what it printed, or that it could not start, beside the test's own report."""
    patch.setattr(Config, "status_home", property(lambda self: root / "status"))
    patch.setattr(WorkerRunner, "start", lambda self, worker, actor: None)
    app = main_journal(Config(root, port=0))
    app.container.get(SettingRows).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.container.get(SettingRows).save(Setting(environment_id=0, key="plugins.hold_window_ms", value=2000), Actor.system())
    app.runtime().start()
    return app


def fifo_line(fifo: Path) -> str:
    """A shell line that waits for one line written to the FIFO, ten seconds at most, so a run cut short never leaves the shell waiting."""
    return f"perl -e 'alarm 10; open P, shift; <P>' '{fifo}'"


def made(output) -> int:
    """The number of the row a command made, or the command's refusal as the failure."""
    assert output.code == 0, output.error
    return int(output.text.split()[1].rstrip(":"))


# a plugin's hold window wide enough for its program to start while the suite's other shards load the machine
PARALLEL_HOLD_WINDOW_MS = 3000


def hook(app, type_name: str, **body):
    """A hook posted as the agent's would be, its deferred work, the edit rows and the cards written after the answer, done before the test reads on, as it is done by the time the agent's next hook comes."""
    answer = posted(app, "/hooks/claude", {"hook_event_name": type_name, "session_id": "s1", **body}, {"X-Journal-Env": "main"})
    app.runtime().deferred.drain()
    return answer


def agent_rows(app) -> list[dict]:
    """The agents' rows read whole, by id, as the viewer reads one with its activity; their list carries their own fields alone."""
    ids = ",".join(str(row["id"]) for row in get_answer(app, "/journal/agents", {"X-Journal-Env": "main"})[1]["rows"])
    return get_answer(app, f"/journal/agents?ids={ids}", {"X-Journal-Env": "main"})[1]["rows"] if ids else []


def context(app, percent: int):
    (app.config.status_home).mkdir(parents=True, exist_ok=True)
    (app.config.status_home / "s1.json").write_text(json.dumps({"context_window": {"used_percentage": percent}}))


def test_a_chat_mark_is_written_with_its_guesses_of_a_test_a_build_or_an_upload(app: App):
    from journal.chat.moment_cards import MomentCards
    from journal.chat.process_cards import ProcessCards
    from journal.chat.process_card_contents import ProcessCardContents
    from journal.support.card_type import CardType
    with app.container.get(Scope).environment(MAIN):
        tests_mark = app.container.get(ProcessCards).show(ProcessCardContents("output", MAIN, "watch:1", "Run the TESTS", {"kind": "card"}, Actor.system(), CardType.COMMANDS, True))
        build_mark = app.container.get(MomentCards).show(MAIN, None, "Build the viewer", "terminal", shows=CardType.COMMANDS)
        upload_mark = app.container.get(MomentCards).show(MAIN, None, "Upload the files", "terminal", shows=CardType.COMMANDS)
    guesses = lambda mark: (mark.data["is_test"], mark.data["is_build"], mark.data["is_upload"])
    assert (guesses(tests_mark), guesses(build_mark), guesses(upload_mark)) == ((True, False, False), (False, True, False), (False, False, True)), "each mark carries what its title says it is, guessed once"


def test_a_running_check_is_force_stopped_by_command_and_by_its_button_and_runs_again(app: App):
    """A check that sleeps is stopped by journal check stop and by the route the viewer's Stop button posts to: its process group is gone within a second, its run is recorded as stopped, neither passed nor failed, and nothing is reported."""
    import threading
    from journal.features.checks.support.check_runner import CheckRunner
    from journal.repositories.checks import Checks
    from journal.support.process_check import ProcessCheck
    checks, runner, console = app.container.get(Checks), app.container.get(CheckRunner), app.console()
    console.run(["check", "create", "Sleeper", "--command", "sleep 30"], USER)

    def started() -> int:
        runner.start(checks.find(1), Actor.system())
        deadline = timing.time() + 5
        while not (progress := checks.find(1).progress) or not progress.process:
            assert timing.time() < deadline, "the run records its process group"
            timing.sleep(0.05)
        return progress.process

    def ended(process: int) -> None:
        deadline = timing.time() + 1
        while ProcessCheck.is_running(process):
            assert timing.time() < deadline, "the command's process is gone within a second"
            timing.sleep(0.02)
        for thread in [thread for thread in threading.enumerate() if thread.name == "check-1"]:
            thread.join(5)
        check = checks.find(1)
        assert (check.last_stopped, check.last_passed, check.progress, check.verdict()) == (True, None, None, "stopped"), "recorded as stopped, and the run's own thread, ending after, records no failure over it"

    process = started()
    assert console.run(["check", "stop", "1"], USER).text.startswith("check 1 stopped")
    ended(process)
    process = started()
    assert posted(app, "/journal/checks/1/stop", {}, {"X-Journal-Env": "main"})[0] == 200
    ended(process)
    assert "is not running" in console.run(["check", "stop", "1"], USER).error
    console.run(["check", "edit", "1", "--command", "true"], USER)
    assert runner.run(checks.find(1), Actor.system()).verdict() == "passed", "free to run again"


def test_a_worker_runs_the_dispatching_agents_own_program(app: App, monkeypatch):
    from journal.features.workers.support.worker_runner import WorkerRunner
    from journal.models.agent import Agent
    from journal.repositories.agents import Agents
    from journal.repositories.workers import Workers
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, actor: None)
    app.container.get(Agents).save(Agent(environment_id=1, session="c1", provider="codex", state="idle"), Actor.system())
    console = app.console()
    dispatched(console, ["Ada Lovelace", "write storage.py", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "gpt-5"], Caller.agent("main", "c1", "codex"))
    dispatched(console, ["Mr. Babbage", "write cli.py", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet"], USER)
    workers = app.container.get(Workers)
    assert workers.find(1).provider == "codex" and workers.find(2).provider == "claude", "a Codex agent's worker runs Codex, so its model names fit"
    assert "`journal worker wait 1 2` waits for a report" in console.run(["worker", "list"], Caller.agent("main", "c1", "codex")).text, "a list of workers out points at the wait"


def test_a_providers_worker_command_session_and_outcome_are_read_from_what_it_was_given_and_printed():
    from journal.providers.claude import Claude
    from journal.providers.codex import Codex
    assert Claude().worker_command("now the lexer", "fast", "sess-1", "sess-1")[-2:] == ["--resume", "sess-1"]
    assert Claude().worker_command("a new job", "fast", "", "sess-new")[-2:] == ["--session-id", "sess-new"], "a new run is started in the session its row already names"
    assert Claude().worker_session("") != Claude().worker_session("") and Claude().worker_session("sess-1") == "sess-1" and Codex().worker_session("") == "", "Claude's session is chosen at dispatch, Codex's comes with its first hook"
    assert Claude().worker_outcome('{"result": "lexer done", "session_id": "sess-2"}', "") == WorkerOutcome("lexer done", "sess-2")
    assert Claude().worker_outcome('{"result": "out of credit", "session_id": "sess-2", "is_error": true}', "").error == "out of credit"
    assert Claude().worker_outcome("plain words", "") == WorkerOutcome("plain words")
    assert Codex().worker_command("x", "m", "c-9", "c-9")[:5] == ["codex", "exec", "resume", "c-9", "--json"] and Codex().worker_command("x", "m", "", "")[:3] == ["codex", "exec", "--json"]
    runs = Path(__file__).with_name("hook_bodies") / "worker_output"
    amber, resumed, failed = ((runs / f"codex_0.163.0_{name}.jsonl").read_text() for name in ("amber", "resume", "badmodel"))
    assert Codex().worker_outcome(amber, "") == WorkerOutcome("amber", "01a15edb-4273-7181-98d3-f0fa7996d6e7") and Codex().worker_outcome(resumed, "").session == "01a15edb-4273-7181-98d3-f0fa7996d6e7", "a real run's session is its thread.started event's, its report the last answer, and a resume keeps the thread"
    ended = Codex().worker_outcome(failed, "it broke")
    assert ended.report == "it broke" and ended.error == "The 'no-such-model-9' model is not supported when using Codex with a ChatGPT account.", "a run that exits 0 with a failed turn is failed by it, its message read out of the error"


def test_a_codex_workers_turns_are_read_from_its_rollout_into_its_chat(app: App, monkeypatch, tmp_path):
    """A Codex worker's conversation is the thread it printed; its rollout, found by that thread, is read into its own chat as a Claude worker's transcript is."""
    from datetime import date
    from journal.features.workers.support.worker_chat import WorkerChat
    from journal.support.agent_role import AgentRole
    from journal.models.worker import Worker
    from journal.repositories.messages import Messages
    from journal.repositories.workers import Workers
    monkeypatch.setenv("HOME", str(tmp_path / "home"))
    monkeypatch.delenv("CLAUDE_CONFIG_DIR", raising=False)
    session = "01a15a25-535e-7cc2-993e-d38deedb6b41"
    rollout = tmp_path / "home" / ".codex" / "sessions" / date.today().strftime("%Y/%m/%d") / f"rollout-2026-10-22T10-00-00-{session}.jsonl"
    rollout.parent.mkdir(parents=True)
    line_text = {"type": "response_item", "payload": {"type": "message", "role": "assistant", "content": [{"type": "output_text", "text": "Storage is written."}]}}
    rollout.write_text(json.dumps({"type": "session_meta", "payload": {"cwd": str(app.config.root)}}) + "\n" + json.dumps(line_text) + "\n")
    with app.container.get(Scope).environment(1):
        worker = app.container.get(Workers).save(Worker(environment_id=1, name="Ada Lovelace", brief="write storage.py", provider="codex", resume=session), Actor.system())
        app.container.get(WorkerChat).read(worker)
        chat = [m.text for m in app.container.get(Messages).all() if m.thread == MessageThread.WORKER and m.session == session]
    assert chat == ["Storage is written."]


def test_a_running_workers_session_is_looked_up_once_and_kept_on_its_row(app: App, monkeypatch, tmp_path):
    from datetime import date
    from journal.models.agent import Agent
    from journal.models.worker import Worker
    from journal.repositories.agents import Agents
    from journal.repositories.workers import Workers
    monkeypatch.setenv("HOME", str(tmp_path / "home"))
    monkeypatch.delenv("CLAUDE_CONFIG_DIR", raising=False)
    app.container.get(Agents).save(Agent(environment_id=1, session="c1", provider="codex", state="idle"), Actor.system())
    workers = app.container.get(Workers)
    worker = workers.save(Worker(environment_id=1, name="Ada Lovelace", brief="write storage.py", provider="codex", model="gpt-5", worktree=True).running_as(1, timing.time() - 5), Actor.system())
    session = "01a15a25-535e-7cc2-993e-d38deedb6b40"
    rollout = tmp_path / "home" / ".codex" / "sessions" / date.today().strftime("%Y/%m/%d") / f"rollout-2026-10-20T18-29-18-{session}.jsonl"
    rollout.parent.mkdir(parents=True)
    line_text = {"type": "response_item", "payload": {"type": "message", "role": "assistant", "content": [{"type": "output_text", "text": "Storage is written."}]}}
    rollout.write_text(json.dumps({"type": "session_meta", "payload": {"cwd": str(app.container.get(WorkerBranch).place(worker).resolve())}}) + "\n" + json.dumps(line_text) + "\n")
    read = lambda: json.load(urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/workers/1/transcript", headers={"X-Journal-Env": "main"}), timeout=5))
    assert [turn["text"] for turn in read()["turns"]] == ["Storage is written."]
    assert workers.find(1).recovered_session == session, "the session found in Codex's files is kept on the worker's row"
    rollout.write_text(json.dumps({"type": "session_meta", "payload": {"cwd": "/elsewhere"}}) + "\n" + json.dumps(line_text) + "\n")
    assert [turn["text"] for turn in read()["turns"]] == ["Storage is written."], "the next read takes the kept session and does not look through the rollouts again"
    assert workers.save(workers.find(1).running_as(2, timing.time()), Actor.system()).recovered_session == "", "a new run looks for its own session"


def test_a_profile_is_saved_with_its_kind_and_models_and_a_worker_is_instructed_from_it(app: App):
    from journal.features.profiles.support.profile_files import ProfileFiles
    files = app.container.get(ProfileFiles)
    files.write_all()
    assert files.profile_type("journal-researcher") == "subagent" and files.profile_type("nobody") == ""
    from journal.providers.support.profile import Profile
    (files.config.root / ".codex").mkdir(exist_ok=True)
    saved = files.save(Profile("builder", "writes code", "Read, Edit", "You write.\nSay \"done\".", "worker"), "sonnet", "gpt-6")
    assert saved["profile_type"] == "worker" and saved["model"] == "sonnet" and saved["codex_model"] == "gpt-6"
    import tomllib
    codex = tomllib.loads((files.config.root / ".codex" / "agents" / "builder.toml").read_text())
    assert codex["model"] == "gpt-6" and codex["sandbox_mode"] == "workspace-write" and codex["developer_instructions"] == "You write.\nSay \"done\"."
    assert files.read("builder")["profile_type"] == "worker" and files.read("journal-planner")["profile_type"] == "subagent"
    assert (files.read("journal-senior")["model"], files.read("journal-medior")["model"]) == ("opus", "sonnet"), "the two shipped workers keep their own models, whatever the setting"
    from journal.features.profiles.support.profile_files import JOURNAL_TESTING_INSTRUCTION, TURN
    from journal.features.templates.shipped import ZERO_TESTS
    from journal.features.workers.support.worker_runner import WorkerRunner
    from journal.models.worker import Worker
    worker = Worker(environment_id=1, name="Mr. Brunel", profile="builder", brief=f"write it\n\nYou change: the files of its task\n\nHow you test: {ZERO_TESTS.brief}")
    assert app.container.get(WorkerRunner).instructed(worker) == f"{TURN}\n\nYou write.\nSay \"done\".\n\n{JOURNAL_TESTING_INSTRUCTION}\n\nwrite it\n\nYou change: the files of its task\n\nHow you test: {ZERO_TESTS.brief}", "the first job comes after the turn and the custom profile, and the worker is told its tests and builds are queued with the journal, whatever --tests names"
    assert app.container.get(WorkerRunner).instructed(worker.with_(resume="r1")) == f"write it\n\nYou change: the files of its task\n\nHow you test: {ZERO_TESTS.brief}", "a resumed worker remembers them"


@pytest.fixture
def skilled(tmp_path: Path, monkeypatch):
    monkeypatch.setattr(Config, "status_home", property(lambda self: tmp_path / "status"))
    app = main_journal(Config(tmp_path, port=0))
    app.runtime().start()
    for key in ("skills.session_start", "skills.after_compaction"):
        user_set(app, key, ["journal"])
    with app.container.get(Scope).environment(MAIN):
        yield app
    app.runtime().stop()


def read_skill(app, folder: str):
    hook(app, "PostToolUse", tool_name="Read", tool_input={"file_path": str(app.config.root / f".claude/skills/{folder}/SKILL.md")}, tool_response="")


def test_a_running_check_shows_how_far_it_is_and_keeps_its_report(app: App, tmp_path, monkeypatch):
    import time as clock
    from journal.features.checks.support import check_runner
    from journal.features.checks.support.check_runner import CheckRunner
    monkeypatch.setattr(check_runner, "INTERVAL_SECONDS", 0)
    from journal.repositories.checks import Checks
    report = '{"title": "Sins", "summary": "1 sin", "findings": [{"name": "python-dict-bag", "file": "src/x.py", "line": 3, "group": "value objects"}]}'
    step = tmp_path / "step"
    os.mkfifo(step)
    from journal.models.check import Check
    checks = app.container.get(Checks)
    checks.save(Check(title="Counts", command=f"echo 1/3; {fifo_line(step)}; echo 2/3; {fifo_line(step)}; printf '%s' '{report}' > \"$JOURNAL_REPORT\"; exit 1"), Actor.user(1))
    started = app.container.get(CheckRunner).start(checks.find(1), Actor.user(1))
    assert started.progress is not None, "a run started from the page answers at once, marked running"

    def shown(progress: tuple | None):
        deadline = clock.monotonic() + 3
        while (row := checks.find(1)).progress and (row.progress.finished_count, row.progress.total) != progress and clock.monotonic() < deadline:
            clock.sleep(0.01)
        return row

    for finished in (1, 2):
        row = shown((finished, 3))
        assert row.progress and (row.progress.finished_count, row.progress.total) == (finished, 3), f"the row says how far the run is while it runs: {row.progress}"
        step.write_text("\n")
    row = shown(None)
    assert row.progress is None and row.last_passed is False and row.last_duration > 0, "the run's end clears its progress and keeps how long it took"
    assert row.last_report.summary == "1 sin" and row.last_report.findings[0].line == 3, "the report the check wrote is kept with its run"


def test_the_slow_request_tools_start_switched_off_in_a_project(app: App):
    from journal.features.faults.faults_options import FaultsOptions
    assert app.container.get(SettingRows).option(FaultsOptions.DEVELOPER) is False, "the journal's own developer tools are off until a project turns the developer features on"


def test_a_running_output_is_force_stopped_by_the_route_the_chats_stop_posts_to(app: App, tmp_path):
    """The stop beside a watched command's mark or docked card posts to its output: the run's whole process group is killed within a second, and its output says the user stopped it."""
    from journal.models.command_output import CommandOutput
    from journal.repositories.command_outputs import CommandOutputs
    from journal.support.process_check import ProcessCheck
    folder = tmp_path / "run"
    folder.mkdir()
    (folder / "parts").write_text("R sleep 30\n")
    (folder / "0.out").write_text("started\n")
    run = subprocess.Popen(["sleep", "30"], start_new_session=True)
    try:
        (folder / "pid").write_text(str(run.pid))
        with app.container.get(Scope).environment(MAIN):
            output = app.container.get(CommandOutputs).save(CommandOutput(chain="sleeper", command="sleep 30", session="s1", folder=str(folder)).backgrounded(), Actor.system())
        assert posted(app, f"/journal/outputs/{output.row_id}/stop", {}, {"X-Journal-Env": "main"})[0] == 200
        run.wait(timeout=1)
        assert not ProcessCheck.is_running(run.pid), "the run's process group is gone"
        assert "stopped by the user from the chat" in (folder / "0.out").read_text(), "its output says who stopped it"
    finally:
        run.kill()


def test_a_check_left_marked_running_by_a_journal_that_stopped_runs_again(app: App):
    from journal.features.checks.support.check_runner import CheckRunner
    from journal.models.check import RUN_LIMIT_SECONDS
    from journal.repositories.checks import Checks
    from journal.models.check import Check
    checks, runner = app.container.get(Checks), app.container.get(CheckRunner)
    checks.save(Check(title="spikes", command="true", interval=1), Actor.user(1))
    left = checks.save(checks.find(1).started(timing.time() - RUN_LIMIT_SECONDS - 60), Actor.system())
    assert not left.is_running(timing.time()), "a run marked longer ago than a run may last belongs to no live run"
    runner.run(left, Actor.system())
    assert checks.find(1).last_passed is True and checks.find(1).progress is None, "so it runs again"
    running = checks.save(checks.find(1).started(timing.time()), Actor.system())
    assert runner.start(running, Actor.system()) == running, "a run under way is not started twice"


def test_a_launcher_handed_inline_code_names_the_run_by_the_launcher():
    from journal.support.command_shape import CommandShape
    assert SHAPES.command_name('node --input-type=module -e " import x from y"') == "node"
    assert SHAPES.command_name('python3 -c "print(1)"') == "python3"
    assert SHAPES.command_name("python3 -m pytest -q") == "pytest", "a module is still the run's name"
    assert SHAPES.command_name("perl -e 'alarm 120; exec @ARGV' node src/web/tests/chatScroll.browser.mjs") == "chatScroll.browser.mjs", "a timeout wrapper is still read through"


def test_a_due_check_starts_on_the_clock_and_runs_on_a_thread_of_its_own(app: App):
    from journal.engine.clock import Clock
    from journal.repositories.checks import Checks
    from journal.models.check import Check
    app.container.get(Checks).save(Check(title="due", command="true", interval=1), Actor.user(1))
    began = timing.monotonic()
    app.container.get(Clock).tick(app.container.get(Clock).time())
    assert timing.monotonic() - began < 0.5, "the clock's tick only starts the check, on a thread of its own"
    while app.container.get(Checks).find(1).last_passed is None and timing.monotonic() - began < 5:
        timing.sleep(0.05)
    assert app.container.get(Checks).find(1).last_passed is True


def test_a_plugins_skills_are_published_afresh_at_a_start(skilled):
    from journal.features.plugins.support.plugin_folders import PluginFolders
    from journal.features.plugins.support.plugin_skills import PluginSkills
    from journal.models.plugin import Plugin
    from journal.models.support.plugin_manifest import PluginManifest
    from journal.repositories.plugins import Plugins
    app = skilled
    plugin = app.container.get(Plugins).save(Plugin(name="checker", manifest=PluginManifest(name="checker", skills="skills")), Actor.system())
    shipped = app.container.get(PluginFolders).folder(plugin) / "skills/checker-naming"
    shipped.mkdir(parents=True)
    (shipped / "SKILL.md").write_text("---\nname: checker-naming\n---\n\nName things plainly.\n")
    stale = app.config.root / ".claude/skills/checker-gone"
    stale.mkdir(parents=True)
    (stale / "SKILL.md").write_text("---\nplugin: checker\nname: checker-gone\n---\n\nold\n")
    app.container.get(PluginSkills).refresh_all()
    assert not stale.exists(), "a plugin's skill it no longer ships is gone"
    assert "Name things plainly." in (app.config.root / ".claude/skills/checker-naming/SKILL.md").read_text(), "and the skills it ships are written again"


def test_a_plugins_required_skills_are_a_list_of_skill_ids(app: App):
    from journal.features.plugins.support.plugin_fault import PluginFault
    from journal.features.plugins.support.protocol import Protocol
    with pytest.raises(PluginFault, match="not a list of skill ids"):
        app.container.get(Protocol).parsed_answer(json.dumps({"require_skills": "echo-guide"}))


def test_the_link_asks_a_supervisor_on_the_protocol_and_sends_an_old_one_its_datagrams(app: App):
    import socket
    import threading
    link, environment = app.container.get(SupervisorLink), 1
    announced = app.config.home / "runtime" / "inboxes" / "main"
    announced.parent.mkdir(parents=True, exist_ok=True)
    path = f"/tmp/journal-test-{os.getpid()}.sock"
    with socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM) as old:
        Path(path).unlink(missing_ok=True)
        old.bind(path)
        announced.write_text(path)
        assert link.runs(environment), "an old supervisor runs while its socket is open"
        link.restart_agent(environment, ("--resume", "s1"))
        assert json.loads(old.recv(4096)) == {"type": "RestartAgent", "resume": ["--resume", "s1"]}, "a bare path is a supervisor from before the protocol"
        link.stop_service(environment, "plugin.code-commandments.mypy")
        old.settimeout(0.2)
        with pytest.raises(TimeoutError):
            old.recv(4096)
        old.settimeout(None)
    Path(path).unlink(missing_ok=True)
    heard = []
    with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as new:
        new.bind(path)
        new.listen(1)
        announced.write_text(json.dumps({"socket": path, "protocol": 1}))

        def answer():
            connection, _ = new.accept()
            with connection:
                heard.append(json.loads(connection.makefile("rb").readline()))
                connection.sendall(b'{"ok": true}\n')

        respondent = threading.Thread(target=answer)
        respondent.start()
        assert link._send(environment, "restart", {"name": "journal"}) == SupervisorReply(True)
        respondent.join(2)
    Path(path).unlink(missing_ok=True)
    assert heard == [{"verb": "restart", "name": "journal"}]
    assert not link.runs(environment), "an announce file a dead supervisor left answers nothing"


def test_the_services_tab_reads_every_process_the_supervisor_runs_through_its_link(app: App):
    """The Settings page's Services tab is served the processes a running supervisor lists, each with its environment, state, start and process id."""
    import socket
    import threading
    path = f"/tmp/journal-services-{os.getpid()}.sock"
    Path(path).unlink(missing_ok=True)
    announced = app.config.home / "runtime" / "inboxes" / "main"
    announced.parent.mkdir(parents=True, exist_ok=True)
    listed = [{"name": "agent", "pid": 4101, "running": True, "terminal": True, "front": True, "restarts": 0, "started_at": 1793000000.5}, {"name": "journal", "pid": 4102, "running": True, "terminal": False, "front": False, "restarts": 2, "started_at": 1793000100.0}]
    with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as supervisor:
        supervisor.bind(path)
        supervisor.listen(4)
        announced.write_text(json.dumps({"socket": path, "protocol": 1}))
        heard = []

        def answer():
            for _ in range(2):
                connection, _ = supervisor.accept()
                with connection:
                    asked = json.loads(connection.makefile("rb").readline())
                    heard.append(asked["verb"])
                    connection.sendall((json.dumps({"ok": True, "processes": listed} if asked["verb"] == "list" else {"ok": True}) + "\n").encode())

        respondent = threading.Thread(target=answer)
        respondent.start()
        from journal.repositories.environments import Environments
        link = app.container.get(SupervisorLink)
        served = {"processes": [{"environment": environment.name, **vars(process)} for environment in link.running(app.container.get(Environments).all()) for process in link.processes(environment.row_id)]}
        respondent.join(2)
    Path(path).unlink(missing_ok=True)
    assert heard == ["hello", "list"], heard
    assert served["processes"] == [
        {"environment": "main", "name": "agent", "pid": 4101, "is_active": True, "started_at": 1793000000.5, "restarts": 0, "front": True},
        {"environment": "main", "name": "journal", "pid": 4102, "is_active": True, "started_at": 1793000100.0, "restarts": 2, "front": False},
    ]


def test_the_journal_asks_its_host_to_start_every_service_the_features_declare_at_boot(app: App, monkeypatch):
    from journal.features.plugins.support.service_start import ServiceStart
    from journal.features.registry import Registry
    from journal.features.support.service import Service
    transmitted = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: transmitted.append({"verb": verb, **fields}) or SupervisorReply(True))
    monkeypatch.setattr(Registry, "services", lambda self: [Service("watcher", "journal.watcher")])
    starter = app.container.get(ServiceStart)
    monkeypatch.delenv("JOURNAL_ENV", raising=False)
    assert starter.run() == [] and transmitted == [], "a journal no supervisor hosts starts nothing"
    monkeypatch.setenv("JOURNAL_ENV", "main")
    assert starter.run() == [SupervisorReply(True)], "an upgrade that brings a new service starts it as the journal boots again, the supervisor still running"
    assert transmitted[0]["verb"] == "start" and transmitted[0]["name"] == "watcher" and transmitted[0]["command"][1:] == ["-m", "journal.watcher", str(app.config.root)] and transmitted[0]["log"].endswith("runtime/watcher.log")
    package = Path(__file__).resolve().parents[1] / "src"
    assert transmitted[0]["env"]["PYTHONPATH"] == str(package), "the module is imported from the folder the package is installed in, never from inside the journal package"


def clocked_out(app: App, at: float):
    from journal.models.worker import Worker
    from journal.repositories.workers import Workers
    workers = app.container.get(Workers)
    saved = workers.save(Worker(environment_id=1, name="Ada Lovelace", brief="b"), Actor.system())
    return workers.save(saved.delivered(at), Actor.system())


def test_with_the_reviewer_on_the_orchestrators_answer_time_runs_from_the_review_and_merge_preparation_is_no_longer_measured_on_purpose(app: App):
    from journal.models.reviewer import Reviewer
    from journal.models.worker import Worker
    worker = Worker(id=7, environment_id=1, name="Lady Lovelace", dispatcher="s1")
    clocked = worker.delivered(100.0)
    assert clocked.is_unanswered(500.0, 300), "with the reviewer off a clock-out waits on the orchestrator from the clock-out"
    sent = worker.review_requested(100.0, "the parser is done")
    assert not sent.is_unanswered(1000.0, 300), "a worker in review waits on the reviewer, not the orchestrator"
    reviewed = sent.reviewed(900.0, 1, Reviewer(id=9, environment_id=1, session="r-1"), "1 passed")
    assert not reviewed.is_unanswered(1000.0, 300) and reviewed.is_unanswered(1300.0, 300), "its answer time runs from the reviewer's report"
    failed = sent.review_failed(900.0, 1)
    assert not failed.review_pending and type(failed.events[-1]).__name__ == "WorkerReviewFailed" and failed.events[-1].task == 1, "a failed review clears the worker's review and carries the event that tells the orchestrator"
    assert failed.is_unanswered(1300.0, 300), "and from then the work waits on the orchestrator"


def ticked_minutes(app: App, *minutes: int) -> None:
    from journal.engine.clock import Clock
    from journal.events.agent.ticked import Ticked
    clock = app.container.get(Clock)
    start = clock.time()
    with app.container.get(Scope).environment(1):
        for minute in minutes:
            clock.ticked(Ticked(agent=agent_row(app), session="s1", environment_id=1, time=start + minute * 60, silence_seconds=0.0))


def test_a_worker_card_is_green_for_nothing_and_blue_for_its_report(app: App):
    from journal.features.workers.support.worker_process_card import WorkerProcessCard
    from journal.models.worker import Worker
    from journal.models.worker_state import WorkerState
    from journal.repositories.workers import Workers
    card, workers = app.container.get(WorkerProcessCard), app.container.get(Workers)
    states = (WorkerState.MERGED, WorkerState.RELEASED, WorkerState.DELIVERED, WorkerState.REPORTED)
    tones = {state: card.standing(workers.save(Worker(environment_id=1, name=f"Worker {state}", brief="b", state=state), Actor.system())).outcome for state in states}
    assert tones == {WorkerState.MERGED: "passed", WorkerState.RELEASED: "", WorkerState.DELIVERED: "passed", WorkerState.REPORTED: "passed"}, "merged, ready to check and reported have passed; released is plain"


def test_wispr_flow_is_among_the_suggested_mcp_services():
    from journal.features.mcp.support.mcp_catalogue import SUGGESTED
    suggested = {s.name: s for s in SUGGESTED}
    assert suggested["wispr-flow"].url == "https://api.wisprflow.ai/connect/mcp" and suggested["wispr-flow"].auth == "oauth"


def test_codex_words_for_the_user_are_read_from_its_transcript(monkeypatch, tmp_path):
    import json as j
    from journal.providers.codex import Codex
    transcript = tmp_path / "rollout.jsonl"
    line_text = lambda role, text: {"type": "response_item", "payload": {"type": "message", "role": role, "content": [{"type": "output_text", "text": text}]}}
    transcript.write_text(j.dumps(line_text("assistant", "Long ago.")) + "\n" + j.dumps(line_text("assistant", "On it, Sir Jesse.")) + "\n")
    monkeypatch.setattr(Codex, "transcript", lambda self, project, session: transcript)
    first = Codex().authored_texts(tmp_path, "s1", -1)
    texts, read = first.texts, first.time
    assert texts == ["On it, Sir Jesse."], "the first look reads the turn in hand"
    with transcript.open("a") as file:
        file.write(j.dumps(line_text("user", "a prompt")) + "\n" + j.dumps({"type": "response_item", "payload": {"type": "function_call", "name": "exec"}}) + "\n" + j.dumps(line_text("assistant", "The plan is ready.")) + "\n")
    assert Codex().authored_texts(tmp_path, "s1", read).texts == ["The plan is ready."], "only the agent's own words, from where the last look left off"
    answered = j.dumps({"type": "thread.started", "thread_id": "01a1549d-a1ac-75c3"}) + "\n" + j.dumps({"type": "item.completed", "item": {"type": "agent_message", "text": "the tests pass"}})
    assert Codex().worker_outcome(answered, "a long log of the run\n" * 500) == WorkerOutcome("the tests pass", "01a1549d-a1ac-75c3"), "a Codex worker's report is its answer, not its log"


def test_the_edits_kept_are_the_newest_five_hundred(app: App):
    from journal.models.edit import Edit
    from journal.repositories.edits import EDIT_ROWS, Edits
    edits = app.container.get(Edits)
    for i in range(EDIT_ROWS + 2):
        edits.record(Edit(session="s1", path=f"f{i}.py", time=float(i + 10)), Actor.agent("s1"))
    assert edits.stored_count() == EDIT_ROWS, "the oldest go as new ones come"
    assert edits.rows()[0].path == "f2.py" and edits.rows()[-1].path == f"f{EDIT_ROWS + 1}.py", "the two oldest went"


def test_a_command_that_reads_the_projects_code_runs_as_written_and_answers_at_once(app: App):
    from pathlib import Path
    from journal.support.command_lines import CommandLines
    from journal.support.part import Part
    lines = app.container.get(CommandLines)
    here = str(Path.cwd())
    stored = [
        "grep -n foo src/journal/app.py | tail -5", "grep -rn 'def x' src --include=*.py | tail -20", "rg -n token src/web/src/App.vue | tail -3",
        "sed -n 1,40p src/journal/models/plan.py | tail -10", "cat tests/test_server.py | tail -2", "head -50 src/web/src/main.js | tail -5",
        "awk 'NR<9' src/journal/config.py | tail -1", "git show HEAD:src/journal/version.py | tail -1", "git diff -- src/journal/models/phone.py | tail -30",
        'grep -n "a | b" "src/journal/support/chain.py" | tail -4', f"cat {here}/src/journal/models/task.py | tail -3", "wc -l src/journal/*.py | tail -1",
        "grep -c x NOTES.md | tail -1", "cat src/web/package.json | tail -3",
    ]
    cut = [
        "pytest -q | tail -3", "python3 src/journal.py setup | tail -2", "cat ~/notes.py | tail -2", "cat /etc/hosts | tail -1", "grep x ../other/app.py | tail -2",
        "cat src/journal/app.py ~/secret.py | tail -5", "cat .journal/runtime/supervisor.log | tail -5", "sed -i '' 's/a/b/' src/journal/app.py | tail -1",
        "npm run build | tail -3",
    ]
    assert [line for line in stored if lines.part_with_code_read(Part(line)).cut()] == [], "a read of the project's own code keeps its tail and runs as written"
    assert [line for line in cut if not lines.part_with_code_read(Part(line)).cut()] == [], "a test run, a build, a log, a file outside the project and a read that writes keep their tail cut"
    for i, line in enumerate(stored[:4]):
        folder = app.config.root / f"code{i}"
        folder.mkdir()
        ShellVerbs(app).split(line, str(folder))
        assert (folder / "0.part").read_text() == line and not (folder / "dropped").exists(), f"run whole, nothing dropped: {line}"
        assert ShellVerbs(app).cap(line) == "direct 0", f"it runs in the shell as written, nothing captured: {line}"


def test_every_sample_of_the_hydration_corpus_fills_the_chat_it_should(tmp_path):
    """tests/hydration_corpus.jsonl holds about a thousand pieces of real Claude Code and Codex transcripts from many sessions, every word swapped for another, their markers kept: injected instructions and context, task notifications, journal and plugin lines, marker and reply tags, tool calls, thinking and the users' own prompts; each with the chat it fills, only the users' words, the agents' replies and the tool summaries."""
    from journal.features.hydration.support.transcript_chat import TranscriptChat
    from journal.providers.claude import Claude
    from journal.providers.codex import Codex
    programs = {"claude": Claude(), "codex": Codex()}
    samples = [json.loads(line) for line in (Path(__file__).parent / "hydration_corpus.jsonl").read_text().splitlines()]
    assert len(samples) > 900
    path = tmp_path / "piece.jsonl"
    wrong = []
    for number, sample in enumerate(samples):
        path.write_text("".join(json.dumps(row) + "\n" for row in sample["rows"]))
        chat = [[str(row.message.author), row.message.text] for row in TranscriptChat("s").read(programs[sample["program"]].turns(path))]
        if chat != sample["chat"]:
            wrong.append(number)
    assert wrong == [], f"samples filling another chat than their own: {wrong[:20]}"
    said = [(author, text) for sample in samples for author, text in sample["chat"]]
    assert not [text for author, text in said if author == "user" and text.lstrip().startswith(("[journal]", "[plugin ", "<", "# AGENTS.md"))], "no injected line is taken for the user's"
    assert not [text for author, text in said if author == "agent" and any(line.startswith("[!") for line in text.splitlines())], "no marker or reply tag is left in the agent's chat"


FIXTURE_BYTES = 8_000_000


def test_every_line_of_the_shell_corpus_is_cut_into_its_parts():
    """tests/shell_corpus.jsonl holds over 4,000 commands in many styles with the parts each is cut into; one marked shell is cut differently by a real shell, and is kept whole here, which runs the same."""
    from journal.support.chain import Chain
    fixture = Path(__file__).parent / "shell_corpus.jsonl"
    cases = [json.loads(line) for line in fixture.read_text().splitlines()]
    if os.environ.get("SPLIT_FREEZE") == "1":
        fixture.write_text("".join(json.dumps({**case, "parts": Chain.split(case["line"])}, ensure_ascii=False) + "\n" for case in cases))
    wrong = [case["line"] for case in cases if Chain.split(case["line"]) != case["parts"]]
    assert not wrong or os.environ.get("SPLIT_FREEZE") == "1", f"{len(wrong)} of {len(cases)} lines cut differently, the first: {wrong[:3]} (re-freeze with SPLIT_FREEZE=1 when the splitter changed on purpose, after reading each changed line)"
    assert fixture.stat().st_size < FIXTURE_BYTES, "the splitter fixture stays small enough for the suite"


SPLITTER_FOLDER_BYTES = 420_000
# how many commands the generated sample draws, and how long reading them all may take
GENERATED_COMMANDS = 500
GENERATED_SECONDS = 20
# how many corpus parts the cost test classifies, and the most one may take on average
CLASSIFIED_PARTS = 2000
CLASSIFY_SECONDS = 0.002
SPLITTER_SAMPLE_SECONDS = 10


def test_every_generated_line_is_split_into_its_frozen_parts_kinds_and_stages():
    """tests/splitter/lines.jsonl holds lines scripts/splitter_fixture.py rebuilt from the corpus forms, chain shapes and every compound, values generated, each with Chain's parts, their kind and their pipe stages (task 3768); re-frozen with SPLIT_FREEZE=1 after reading each changed line."""
    from journal.support.chain import Chain
    folder = Path(__file__).parent / "splitter"
    fixture = folder / "lines.jsonl"
    rows = [json.loads(line) for line in fixture.read_text().splitlines()]
    began = timing.monotonic()
    split = [[[part.text, part.part_type(), part.stages()] for part in Chain.parts(row["line"])] for row in rows]
    assert timing.monotonic() - began < SPLITTER_SAMPLE_SECONDS, "the splitter sample stays quick enough for the suite"
    if os.environ.get("SPLIT_FREEZE") == "1":
        fixture.write_text("".join(json.dumps({"line": row["line"], "parts": parts}, ensure_ascii=False) + "\n" for row, parts in zip(rows, split)))
    wrong = [row["line"] for row, parts in zip(rows, split) if parts != row["parts"]]
    assert not wrong or os.environ.get("SPLIT_FREEZE") == "1", f"{len(wrong)} of {len(rows)} lines split differently, the first: {wrong[:3]} (regenerate with PYTHONPATH=src python3 -m scripts.splitter_fixture .journal/corpus, or re-freeze with SPLIT_FREEZE=1 where no corpus is at hand, after reading each changed line)"
    assert len(rows) > 500 and {"R;&", "R&;", "R;;"} <= {type_name for row in rows for _, type_name, _ in row["parts"]}
    assert sum(path.stat().st_size for path in folder.iterdir()) < SPLITTER_FOLDER_BYTES, "the splitter fixtures stay within their budget"


def table_rows(rows: dict, where: str):
    for name, row in rows.items():
        yield f"{where}.{name}", rows, row
        for level in ("subcommands", "modifiers"):
            yield from table_rows(row.get(level, {}), f"{where}.{name}.{level}")
        yield from table_rows({"base": row["base"]} if "base" in row else {}, f"{where}.{name}")


def test_the_command_table_follows_its_schema_and_names_only_its_own_kinds_and_effects():
    """src/journal/support/command_table.json classifies each program by a base, subcommands and option modifiers (task 3771): it follows command_table.schema.json, every kind and effect is one the table lists, and every same_as names a row beside it."""
    support = Path(__file__).resolve().parents[1] / "src" / "journal" / "support"
    table = json.loads((support / "command_table.json").read_text())
    assert TableSchema().faults(table) == []
    assert TableSchema().faults({**table, "programs": {"sed": {"bas": {}}}}) == ["table.programs.sed: bas is not allowed"], "the check finds a fault"
    rows = list(table_rows(table["programs"], "programs"))
    assert not [where for where, _, row in rows if row.get("kind", "unknown") not in table["kinds"]], "every kind is listed"
    assert not [where for where, _, row in rows if not set(row.get("effects", [])) <= set(table["effects"])], "every effect is listed"
    assert not [where for where, beside, row in rows if "same_as" in row and row["same_as"] not in beside], "every same_as names a row beside it"
    assert {"git", "sed", "rm", "curl", "pytest", "journal"} <= set(table["programs"]) and {"timeout", "env", "xargs"} <= set(table["wrappers"])


def test_a_chain_is_taken_apart_and_the_shells_wrapping_around_it_is_silent(app: App):
    from journal.support.command_lines import CommandLines
    from journal.support.chain import Chain
    from journal.features.shell.support.activity_label import ActivityLabel
    labels = app.container.get(ActivityLabel)
    assert Chain.split('a $(b; c) && (d; e) || f; g "h && i" | tail -1') == ["a $(b; c)", "(d; e) || f", 'g "h && i" | tail -1']
    assert Chain.split("for f in a b; do echo $f; done && if true; then echo y; fi; case $x in a) echo a;; esac && ls") == ["for f in a b; do echo $f; done", "if true; then echo y; fi", "case $x in a) echo a;; esac", "ls"]
    assert Chain.split("echo `echo a; echo b` && cat <<EOF && echo x\nbody; with && stuff\nEOF") == ["echo `echo a; echo b`", "cat <<EOF && echo x\nbody; with && stuff\nEOF"]
    assert Chain.split('[[ -n a && -n b ]] && echo ok; echo "${x:-a;b}" && (( 1 && 1 ))') == ["[[ -n a && -n b ]]", "echo ok", 'echo "${x:-a;b}"', "(( 1 && 1 ))"]
    loop = "for f in $files; do sed -i '' 's/a/b/g; s/c/d/g' \"$f\"; done"
    assert Chain.split(f'files=$(git grep -l "x y" -- src tests); echo "$files"; {loop}; sed -n 1,2p notes.md') == ['files=$(git grep -l "x y" -- src tests)', 'echo "$files"', loop, "sed -n 1,2p notes.md"], "a loop over a list, with ; inside its quotes and its body, is one part"
    assert Chain.split("for x in a b; echo $x && echo y; echo z; repeat 2 echo r && echo s; echo t") == ["for x in a b; echo $x && echo y", "echo z", "repeat 2 echo r && echo s", "echo t"]
    assert Chain.split("seq 2 | while read -r n; do echo $n; done; echo after") == ["seq 2 | while read -r n; do echo $n; done", "echo after"]
    assert Chain.split('J=x; $J a | head -3; \\\nfor t in "a b" "c d"; do echo "$t"; done') == ["J=x", "$J a | head -3", 'for t in "a b" "c d"; do echo "$t"; done'], "a line continuation before a loop leaves the loop one part (task 3747)"
    assert Chain.split("for L in en nl; do python3 - \"$L\" <<'PY'\nprint(1); x = 2\nPY\ndone; php -l a.php | tail -1; php -l b.php") == ["for L in en nl; do python3 - \"$L\" <<'PY'\nprint(1); x = 2\nPY\ndone", "php -l a.php | tail -1", "php -l b.php"], "a heredoc inside a loop ends at its terminator, and the commands after the loop are parts of their own (task 3747)"
    assert Chain.split("cd x\n# drop blank lines; keep ## tables\nawk '{print}' a\npython3 - <<'P'\nimport re\nP\nwc -l a") == ["cd x", "awk '{print}' a", "python3 - <<'P'\nimport re\nP", "wc -l a"], "a comment on a line of its own is no part and glues no lines together (task 3747)"
    assert Chain.split("(cd t && python3 - <<'EOF'\nprint(\"}\\n)\")\nEOF\n) && echo ok; B=$(cat <<EOF\none; two (three)\nEOF\n); echo \"$B\"") == ["(cd t && python3 - <<'EOF'\nprint(\"}\\n)\")\nEOF\n)", "echo ok", "B=$(cat <<EOF\none; two (three)\nEOF\n)", 'echo "$B"'], "a heredoc inside a subshell or a $( ) is skipped whole (task 3747)"
    assert Chain.split("find . -exec cat {} \\;; echo ---") == ["find . -exec cat {} \\;", "echo ---"], "a ; after find's escaped \\; still ends the part (task 3747)"
    assert Chain.split('for n in 1 2; do case "$n" in 1) echo one | tail -1;; esac; done; echo after') == ['for n in 1 2; do case "$n" in 1) echo one | tail -1;; esac; done', "echo after"], "a case whose arm pipes into another command still closes at its esac (task 3747)"
    assert Chain.split("until [ -s a ] || ls b | grep -q done; do sleep 2; done; sleep 2; ls b") == ["until [ -s a ] || ls b | grep -q done; do sleep 2; done", "sleep 2", "ls b"], "a closer word given to a command as its argument closes nothing (task 3747)"
    assert Chain.split("python3 - <<'EOF'\n    | until the move is verified; set true\nEOF\ntail -4 r; head -8 r") == ["python3 - <<'EOF'\n    | until the move is verified; set true\nEOF", "tail -4 r", "head -8 r"], "words in a heredoc's body open no loop (task 3747)"
    from journal.support.part import Part
    from journal.features.shell.support.piped_test_run import PipedTestRun
    for line, stages in (("a || b", ["a || b"]), ("echo $(a | b) | c", ["echo $(a | b)", "c"]), ('echo "a | b" | c', ['echo "a | b"', "c"]), ("python3 -m pytest -q | tail -3", ["python3 -m pytest -q", "tail -3"]), ("grep a\\|b x | head", ["grep a\\|b x", "head"])):
        assert Part(line).stages() == PipedTestRun.stages(line) == stages and bool(Part(line).pipe_positions(0)) == (len(stages) > 1), line
    assert Chain.split("for i in 1; do echo done; done; echo fi && case a in a) echo one;& b) echo two;; esac") == ["for i in 1; do echo done; done", "echo fi", "case a in a) echo one;& b) echo two;; esac"]
    assert Chain.split("echo a # not && split; here\necho b && echo '#not a comment' && echo c#neither") == ["echo a # not && split; here", "echo b", "echo '#not a comment'", "echo c#neither"], "a newline ends a command, a comment runs to it"
    wrapped = "source /s 2>/dev/null || true && { \\builtin unalias -- 'x'; } >/dev/null 2>&1 || true && eval 'cd src && git commit -m '\"'\"'a; b'\"'\"'' < /dev/null && pwd -P >| /tmp/cwd"
    parts = Chain.parts(wrapped)
    assert [p.text for p in parts if p.recorded] == ["cd src", "git commit -m 'a; b'"]
    assert parts[0].text.startswith("source") and parts[-1].text.startswith("pwd -P") and not parts[0].recorded and not parts[-1].recorded
    heredoc = "source /s 2>/dev/null || true && eval 'cd src && python3 - <<'\"'\"'EOF'\"'\"'\nprint(1)\nEOF' && pwd -P >| /tmp/cwd"
    chained_after = "python3 - <<'EOF'\nimport pathlib\npathlib.Path('tests/a.py').write_text('x')\nEOF\npython3 -m pytest -q tests/a.py 2>&1 | tail -1 && python3 -m pytest -q 2>&1 | tail -15"
    assert [p.text[:20] for p in Chain.parts(chained_after)] == ["python3 - <<'EOF'\nim", "python3 -m pytest -q", "python3 -m pytest -q"], "a heredoc ends at its terminator line, and the commands after it are parts of their own"
    assert not app.container.get(CommandLines).is_code_write(chained_after), "a test run chained behind a script that edits code is no edit of code: the line goes through the runner and its limit"
    assert [p.text for p in Chain.parts(heredoc) if p.recorded] == ["cd src", "python3 - <<'EOF'\nprint(1)\nEOF"], "a command with a heredoc comes without < /dev/null and is still the agent's own"
    assert [labels.build(c) for c in ("git commit -m x", "python3 -m pytest -q | tail -2", "cd src", "npm run build", "foo --bar", "python3 - <<'EOF'\nprint(1)\nEOF")] == ["committing", "testing", "moving", "building", "running foo", "running python3"]
    assert [labels.build(c) for c in ("npm --prefix src/web run build", "npm run dev", "npx vitest run tests/a.test.js", "make -C src")] == ["building", "running a script", "testing", "building"], "a flag's value is no part of what the command does, and a build or a test through npm is one"


def test_the_foreground_limit_is_fifteen_seconds_or_ten_while_a_message_waits(app: App):
    assert ShellVerbs(app).limit() == "15"
    wrapped = "source /s 2>/dev/null || true && eval 'journal task list && journal message unread' < /dev/null && pwd -P >| /tmp/cwd"
    assert ShellVerbs(app).limit(wrapped) == "0", "a line of journal commands alone is never moved to the background"
    assert ShellVerbs(app).limit(wrapped.replace("journal message unread", "sleep 60")) == "15"
    from datetime import datetime, timezone
    from journal.models.message import Message
    from journal.repositories.messages import Messages
    messages = app.container.get(Messages)
    with app.container.get(Scope).environment(1):
        waiting = messages.save(Message(environment_id=1, text="are you there?"), Actor.user(1))
    assert ShellVerbs(app).limit() == "10"
    with app.container.get(Scope).environment(1):
        messages.save(waiting.with_(read_at=datetime.now(timezone.utc)), Actor.agent("s1"))
    app.container.get(SettingRows).save(Setting(environment_id=0, key="shell.foreground", value=5), Actor.system())
    assert ShellVerbs(app).limit() == "5"


def test_the_mcp_page_shows_every_server_as_the_kept_check_found_it_without_a_refresh(app: App, monkeypatch):
    import json as j
    from journal.features.mcp.support.health import Health
    from journal.features.mcp.support.health_report import HealthReport
    from journal.features.mcp.support.server_catalogue import ServerCatalogue
    monkeypatch.setattr(Health, "probe", lambda self: HealthReport({"blender": ServerCatalogue("blender", "uvx blender-mcp", "connected", "")}))
    read = lambda: j.load(urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/mcp", headers={"X-Journal-Env": "main"}), timeout=5))
    read()
    deadline = timing.monotonic() + 3
    while not read()["checked_at"] and timing.monotonic() < deadline:
        timing.sleep(0.05)
    shown = read()
    assert not shown["checking"] and [(s["name"], s["state"]) for s in shown["servers"]] == [("blender", "connected")], "the next read shows the servers as the check found them"


def test_an_integration_is_a_suggested_mcp_server_installed_and_removed_with_the_agents_restarted_and_keyed_without(app: App, monkeypatch, tmp_path):
    import json as j
    from urllib.request import Request as R, urlopen
    from journal.features.mcp.support.health import Health
    from journal.support.keys import Keys
    transmitted = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: transmitted.append({"verb": verb, **fields}))
    monkeypatch.setattr(app.container.get(Keys), "path", tmp_path / "keys.json")
    from journal.features.mcp.support.health_report import HealthReport
    from journal.features.mcp.support.server_catalogue import ServerCatalogue
    monkeypatch.setattr(Health, "probe", lambda self: HealthReport({"github": ServerCatalogue("github", "npx -y @modelcontextprotocol/server-github", "connected", ""), "linear": ServerCatalogue("linear", "https://mcp.linear.app/mcp", "needs_auth", "Needs authentication"), "playwright": ServerCatalogue("playwright", "npx -y @playwright/mcp@latest --headless", "connected", "")}))
    hook(app, "SessionStart")
    app.console().run(["environment", "overview"], AGENT)
    port = app.server().port
    def post(path, body):
        with urlopen(R(f"http://127.0.0.1:{port}{path}", data=j.dumps(body).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5) as r:
            return j.loads(r.read())
    installed = post("/journal/mcp/install", {"name": "github"})
    assert installed["state"] == "needs_key" and installed["has_key"] is False and transmitted[-1]["verb"] == "restart" and transmitted[-1]["name"] == "agent" and transmitted[-1]["resume"] == ["--resume", "s1"], "an idle agent restarts at once"
    hook(app, "PreToolUse", tool_name="Read", tool_input={})
    transmitted.clear()
    post("/journal/mcp/github/key", {"value": "first"})
    assert transmitted == [] and j.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}/journal/mcp", headers={"X-Journal-Env": "main"}), timeout=5))["restart_pending"] == [], "a key restarts nothing: a running agent keeps the environment it was launched with"
    try:
        post("/journal/mcp/github/key", {"value": "  "})
    except HTTPError as error:
        assert "blank" in error.read().decode()
    else:
        raise AssertionError("a blank key is refused")
    post("/journal/mcp/install", {"name": "linear"})
    assert transmitted == [] and j.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}/journal/mcp", headers={"X-Journal-Env": "main"}), timeout=5))["restart_pending"] == ["s1"], "an agent at work is not cut off"
    hook(app, "Stop")
    app.runtime().deferred.drain()
    assert transmitted and transmitted[-1]["verb"] == "restart", "the restart comes the moment its turn ends"
    claude = j.loads((app.config.root / ".mcp.json").read_text())["mcpServers"]["github"]
    assert claude["command"] == "npx" and claude["env"] == {"GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"}
    assert '[mcp_servers.github]' in (app.config.root / ".codex" / "config.toml").read_text()
    keyed = post("/journal/mcp/github/key", {"value": "ghp_secret"})
    assert keyed["has_key"] is True and keyed["state"] == "installed" and j.loads((tmp_path / "keys.json").read_text()) == {"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_secret"}
    assert "ghp_secret" not in (app.config.root / ".mcp.json").read_text(), "a key is never written into the project"
    states = {s["name"]: s["state"] for s in post("/journal/mcp/check", {})["servers"]}
    assert states == {"github": "connected", "linear": "needs_auth"}
    page = j.load(urlopen(HttpRequest(f"http://127.0.0.1:{port}/journal/mcp", headers={"X-Journal-Env": "main"}), timeout=5))
    assert [(s["name"], s["managed"]) for s in page["servers"]] == [("github", True), ("linear", True), ("playwright", False)], "the program's own servers show after the journal's"
    assert {s["name"]: s["installed"] for s in page["suggested"] if s["name"] in ("github", "playwright", "slack")} == {"github": True, "playwright": True, "slack": False}
    assert post("/journal/mcp/github/remove", {}) == {"removed": "github"} and j.loads((tmp_path / "keys.json").read_text()) == {}
    assert app.console().run(["mcp", "list"], USER).text.startswith("linear")
    post("/journal/mcp/install", {"name": "linear"})
    transmitted.clear()
    assert post("/journal/mcp/linear/sign-in", {})["asked"] == "linear"
    assert transmitted[-1]["verb"] == "type" and "mcp__linear__authenticate" in transmitted[-1]["line"], "the agent is asked to sign in through the server's own tool"


def test_commands_run_at_the_same_moment_keep_their_own_output(app: App):
    import threading
    outs = {}
    def run(n):
        outs[n] = ShellVerbs(app).cap() if n % 2 else ShellVerbs(app).limit()
    threads = [threading.Thread(target=run, args=(n,)) for n in range(20)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    assert all(outs[n] == ("hint 400" if n % 2 else "15") for n in range(20)), "each run's output is its own, though they run side by side"


def test_the_sequence_triggers_migration_turns_the_trigger_event_and_the_phrase_rows_into_trigger_records(connection):
    from journal.db.migrations.sequence_triggers import SequenceTriggers
    connection.execute("ALTER TABLE sequences ADD COLUMN trigger_event TEXT DEFAULT ''")
    connection.execute("INSERT INTO sequences (title, steps, trigger_event, created_at, creator) VALUES ('Building a plan', '[]', 'plan.created', '2026-10-26', 'system'), ('Writing an update', '[]', '', '2026-10-26', 'system')")
    connection.execute("INSERT INTO triggers (phrases, action, text, created_at, creator) VALUES ('[\"tldr\", \"catch me up\"]', 'sequence', 'Writing an update', '2026-10-26', 'system'), ('[\"careful\"]', 'nudge', 'be careful', '2026-10-26', 'system')")
    SequenceTriggers().apply(connection)
    triggers = {row["title"]: json.loads(row["triggers"]) for row in connection.all("SELECT title, triggers FROM sequences")}
    assert triggers == {"Building a plan": [{"kind": "row", "moment": "plan.created"}], "Writing an update": [{"kind": "phrase", "text": "tldr"}, {"kind": "phrase", "text": "catch me up"}]}
    assert [row["action"] for row in connection.all("SELECT action FROM triggers")] == ["nudge"], "the rows that started a sequence are gone, the others stay"
    assert "trigger_event" not in {row["name"] for row in connection.all("PRAGMA table_info(sequences)")}


def test_a_row_named_in_a_message_is_a_chip_in_the_viewer():
    from journal.features.messages.support.mentions import Mentions
    assert [str(r) for r in Mentions.found("Please have 2 agents give plan 1 a normal read, following template 3 (Find what is missing), then task 12 and Task 12 again, doc #4")] == ["plans:1", "templates:3", "tasks:12", "docs:4"]
    assert Mentions.found("the plan is ready; 3 agents; version 4") == []


def test_a_worker_sent_back_short_gets_the_failures_its_workers_latest_failed_run_printed_cut_at_forty_lines(app: App, tmp_path):
    import time
    from types import SimpleNamespace
    from journal.config import Config
    from journal.features.workers.support.failed_runs import FailedRuns
    from journal.features.shell.support.readers import Readers
    from journal.models.command_output import CommandOutput
    from journal.models.support.worker_moves import WorkerMoves
    from journal.models.worker import Worker
    from journal.repositories.command_outputs import CommandOutputs
    config, outputs = app.container.get(Config), app.container.get(CommandOutputs)
    config.readers.mkdir(parents=True, exist_ok=True)
    reader = config.readers / "worktree-pytest.pattern"
    reader.write_text("# a pytest run's failed tests and assertions\n^FAILED|^E \ncommands: pytest\n")
    readers = app.container.get(Readers)
    readers.default_choice("worktree-pytest")
    worktree = tmp_path / "worker-tree"

    def run(name, lines, ran_in=str(worktree), status=1):
        folder = tmp_path / name
        folder.mkdir()
        (folder / "parts").write_text("R\n")
        (folder / "0.out").write_text("\n".join(lines) + "\n")
        return outputs.save(CommandOutput(chain=name, command="pytest tests/x.py", folder=str(folder), ran_in=ran_in, ended=True, status=status), Actor.system())

    failed = FailedRuns(outputs, readers, SimpleNamespace(folder=lambda worker: worktree))
    before = Worker(moves=WorkerMoves((("clocked out", time.time() - 100),)))
    try:
        assert failed.with_output(before, "the tests fail") == "the tests fail", "a send-back with no run carries only the reason"
        run("short", ["collected 2 items", "FAILED tests/x.py::test_a - assert 1 == 2", "E   assert 1 == 2", "1 failed"])
        assert failed.with_output(before, "the tests fail").splitlines() == ["the tests fail", "FAILED tests/x.py::test_a - assert 1 == 2", "E   assert 1 == 2"], "the failure rides under the reason as the reader picks it"
        run("elsewhere", ["FAILED tests/y.py::test_b"], ran_in=str(tmp_path / "other-tree"))
        assert "tests/y.py" not in failed.with_output(before, "the tests fail"), "a run in another folder is not the worker's"
        run("long", [f"FAILED tests/x.py::test_{n}" for n in range(45)])
        lines = failed.with_output(before, "the tests fail").splitlines()
        assert len(lines) == 1 + 40 + 1 and lines[-1] == "and 5 more lines", "a long failure is cut at forty lines with the count of the rest"
        after = Worker(moves=WorkerMoves((("clocked out", time.time() + 100),)))
        assert failed.with_output(after, "the tests fail") == "the tests fail", "a run from before the worker's last clock-out is left out"
    finally:
        readers.removed("worktree-pytest")


def test_how_a_watched_run_ended_is_told_without_its_progress_lines_in_a_few_lines(app: App, tmp_path):
    from journal.config import Config
    from journal.features.shell.support.output_views import OutputViews
    from journal.models.command_output import CommandOutput
    from journal.repositories.command_outputs import CommandOutputs
    config, outputs = app.container.get(Config), app.container.get(CommandOutputs)
    config.readers.mkdir(parents=True, exist_ok=True)
    (config.readers / "go-tests.pattern").write_text("# a go test run: each finished test and the totals\n^(\\d+/\\d+ tests|\\d+ tests, )\nprogress: (\\d+)/(\\d+) tests\nlabel: Running tests\ncommands: scripts/tested\n")
    folder = tmp_path / "tested"
    folder.mkdir()
    (folder / "parts").write_text("R\n")
    (folder / "0.out").write_text("".join(f"{n}/24 tests --- PASS: TestNumber{n} (0.01s)\n" for n in range(1, 25)) + "24 tests, 0 failed\n")
    output = outputs.save(CommandOutput(chain="tested", command="scripts/tested ./cli/", folder=str(folder), watch_reader="go-tests", ended=True, status=0), Actor.system())
    assert app.container.get(OutputViews).ended_summary(output) == "24 tests, 0 failed", "the agent is told how the run ended, its progress lines left on the card"


def test_merged_work_is_measured_against_its_model_a_sample_is_judged_by_a_general_verifier_and_a_mismatch_is_named_and_kept_unscored_on_purpose(app: App, monkeypatch):
    from journal.features.verification.support.verifier_runner import VerifierRunner
    from journal.models.edit import Edit
    from journal.models.link import Link
    from journal.models.support.ref import Ref
    from journal.models.support.worker_moves import WorkerMoves
    from journal.models.worker import Worker
    from journal.repositories.edits import Edits
    from journal.repositories.links import Links
    from journal.repositories.agents import Agents
    from journal.repositories.verifiers import Verifiers
    from journal.repositories.workers import Workers
    monkeypatch.setattr(VerifierRunner, "start", lambda self, verifier, resume="": verifier)
    keystrokes = []
    woken_capture(app, monkeypatch, keystrokes)
    settings, workers, edits = app.container.get(SettingRows), app.container.get(Workers), app.container.get(Edits)
    user_set(app, WorkersOptions.MODE.key, "orchestrator")
    user_set(app, WorkersOptions.MODEL_FIT_SAMPLE.key, 1)
    user_set(app, WorkersOptions.VERIFIER_LIMIT.key, 10)
    hook(app, "SessionStart")

    # a worker's job on `model`, `lines` lines over `files` files, sent back `rejections` times over `minutes`, merged now
    def merged(name, model, lines, files, rejections, minutes):
        now = timing.time()
        start = now - minutes * 60
        steps = [("dispatched", start), *[move for back in range(rejections) for move in (("clocked out", start + 60 + back), ("sent back", start + 90 + back))], ("clocked out", now - 30)]
        with app.container.get(Scope).environment(MAIN):
            worker = workers.save(Worker(environment_id=MAIN, name=name, model=model, session=f"ws-{name}", dispatcher="s1", brief="Change src/parser.py; done when its test passes", moves=WorkerMoves(tuple(steps))), Actor.system())
            for n in range(files):
                edits.save(Edit(environment_id=MAIN, session=f"ws-{name}", path=f"src/part_{n}.py" if n else "tests/test_parser.py", added=lines // files, removed=0, time=start + 120, new_text="x = 1"), Actor.system())
            worker = workers.save(workers.find(worker.row_id).merged(0, now), Actor.system())
        app.runtime().deferred.drain()
        with app.container.get(Scope).environment(MAIN):
            return workers.find(worker.row_id)

    small, large = dict(lines=20, files=1, rejections=0, minutes=8), dict(lines=900, files=14, rejections=2, minutes=150)
    fits = {(size, model): merged(f"{size}-{model}", f"claude-{model}-5-5", **work).model_fit for size, work in (("small", small), ("large", large)) for model in ("haiku", "sonnet", "opus")}
    assert fits[("small", "haiku")].called_for.value == "fast" and fits[("large", "opus")].called_for.value == "strongest", "small work calls for the fast model, large for the strongest"
    assert fits[("small", "haiku")].points < fits[("large", "haiku")].points
    assert {key: fit.measured for key, fit in fits.items()} == {("small", "haiku"): "right", ("small", "sonnet"): "too strong", ("small", "opus"): "too strong", ("large", "haiku"): "too weak", ("large", "sonnet"): "too weak", ("large", "opus"): "right"}
    answer = hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"}, tool_use_id="fit-read")[1]
    heard = "\n".join([*keystrokes, str(answer)])
    small_opus = next(w.id for w in workers.global_matching(name="small-opus"))
    assert nudge_reached(app, heard, WorkersNudges.MODEL_OVERPOWERED, n=small_opus, model="claude-opus-5-5"), heard
    assert nudge_reached(app, heard, WorkersNudges.MODEL_UNDERPOWERED, model="claude-haiku-5-5", send_backs=2), heard
    assert "ran on claude-haiku-5-5 for work" not in heard, "a fit is never named"
    agent = app.container.get(Agents).session_agent("s1")
    assert len(agent.model_fits) == 6 and sum(entry.endswith(":right") for entry in agent.model_fits) == 2, agent.model_fits
    with app.container.get(Scope).environment(MAIN):
        sampled = next(w for w in workers.global_matching(name="large-opus"))
        judging = [link.source for link in app.container.get(Links).all_matching(target=Ref.build(sampled), link_type="verifies")]
        verifier = app.container.get(Verifiers).find(judging[-1].id)
    assert verifier.model == "sonnet" and "## The diff" in verifier.brief and "Change src/parser.py" in verifier.brief and "journal verdict model" in verifier.brief, "a merge sampled is judged by a verifier on the general model, never the fast one, handed the brief, the diff and the report"
    answer = app.console().run(["verdict", "model", "too-strong", "one parser module and its test"], Caller.verifier("main", verifier.id, verifier.session, "claude"))
    assert answer.code == 0, answer.error
    with app.container.get(Scope).environment(MAIN):
        judged = workers.find(sampled.row_id).model_fit
    assert (judged.verdict, judged.reason, judged.fit()) == ("too strong", "one parser module and its test", "too strong"), "the verdict is recorded on the worker and counts over the measure"
    assert f"{sampled.row_id}:too strong" in app.container.get(Agents).session_agent("s1").model_fits, "and among its dispatcher's model fits"
    user_set(app, WorkersOptions.MODE.key, WorkersOptions.MODE.default)
    user_set(app, WorkersOptions.MODEL_FIT_SAMPLE.key, WorkersOptions.MODEL_FIT_SAMPLE.default)


def test_a_workers_turn_to_run_tests_starts_when_fewer_runs_go_than_the_budget_else_waits_in_order_and_one_past_the_waiting_cap_is_refused(app: App, tmp_path):
    import threading
    import time
    from types import SimpleNamespace
    from journal.features.shell.support.readers import Readers
    from journal.features.workers.support.test_turns import TestTurns
    from journal.models.worker import Worker
    from journal.repositories.command_outputs import CommandOutputs
    from journal.repositories.environments import Environments
    from journal.repositories.test_turns import TestTurns as TurnRows
    from journal.repositories.workers import Workers
    from journal.support.rejection import Rejection
    settings = app.container.get(SettingRows)
    started, gates, results, refused = [], {n: threading.Event() for n in (1, 2, 3)}, {}, []

    class Runner:
        def run(self, request, caller, environment):
            started.append(request.cwd)
            number = int(Path(request.cwd).name.removeprefix("wt"))
            gates[number].wait(10)
            yield f"FAILED tests/test_{number}.py::test_it\n".encode()

    class Crew:
        def __init__(self):
            self.kept = []

        def find(self, number):
            return Worker(id=number, environment_id=1, name=f"Worker {number}")

        def save(self, row, actor):
            self.kept.append(row.id)
            return row

    crew = Crew()
    turns = TestTurns(app.container.get(TurnRows), Runner(), SimpleNamespace(place=lambda worker: tmp_path / f"wt{worker.id}"), app.container.get(Readers), settings, app.container.get(CommandOutputs), app.container.get(Scope), crew, app.container.get(Environments), app.container.get(TimeSource))

    def worker(number):
        return SimpleNamespace(id=number, name=f"Worker {number}", environment_id=1)

    def ask(number):
        with app.container.get(Scope).environment(1):
            try:
                results[number] = turns.run_batches(worker(number), f"tests/test_{number}.py", SimpleNamespace())
            except Rejection as refusal:
                refused.append(str(refusal))

    def until(test):
        end = time.time() + 10
        while not test() and time.time() < end:
            time.sleep(0.05)
        return test()

    def asking(*numbers):
        threads = [threading.Thread(target=ask, args=(number,)) for number in numbers]
        for thread in threads:
            thread.start()
            time.sleep(0.4)
        return threads

    user_set(app, WorkersOptions.TEST_COMMAND.key, "pytest -q")
    user_set(app, WorkersOptions.TEST_RUNS.key, 2)
    threads = asking(1, 2, 3)
    assert until(lambda: len(started) == 2) and started == [str(tmp_path / "wt1"), str(tmp_path / "wt2")], "a budget of 2 starts two runs, each in its own worker's worktree"
    time.sleep(0.5)
    assert len(started) == 2, "and the third waits"
    gates[1].set()
    assert until(lambda: len(started) == 3) and started[2] == str(tmp_path / "wt3"), "until one ends, when it starts"
    gates[2].set()
    gates[3].set()
    for thread in threads:
        thread.join(10)
    assert all(f"tests/test_{n}.py::test_it" in results[n] for n in (1, 2, 3)), "each worker is handed its own result"
    assert sorted(crew.kept) == [1, 2, 3], "and how each run ended is kept on its worker"

    started.clear(), results.clear()
    gates.update({n: threading.Event() for n in (1, 2, 3)})
    user_set(app, WorkersOptions.TEST_RUNS.key, 1)
    threads = asking(1, 2, 3)
    assert until(lambda: len(started) == 1)
    time.sleep(0.5)
    assert len(started) == 1, "a budget of 1 runs one at a time"
    for number in (1, 2, 3):
        gates[number].set()
        assert until(lambda: number in results), "and in turn"
    assert [Path(cwd).name for cwd in started] == ["wt1", "wt2", "wt3"]

    started.clear(), results.clear()
    gates.update({n: threading.Event() for n in (1, 2, 3)})
    user_set(app, WorkersOptions.TEST_WAITING.key, "1")
    threads = asking(1, 2, 3)
    assert refused == ["1 turns already wait for a test run: ask again once one has run"], "a turn past the waiting cap is refused with one line"
    for number in (1, 2):
        gates[number].set()
    for thread in threads:
        thread.join(10)


def test_a_test_run_stops_at_its_time_limit_a_worker_that_ends_takes_out_its_turns_and_waiting_turns_start_again_after_a_restart(app: App, tmp_path, monkeypatch):
    import threading
    import time
    from types import SimpleNamespace
    from journal.features.shell.support.output_files import OutputFiles
    from journal.features.shell.support.readers import Readers
    from journal.features.workers.support.test_turns import TestTurns
    from journal.models.command_output import CommandOutput
    from journal.models.worker import Worker
    from journal.repositories.command_outputs import CommandOutputs
    from journal.repositories.environments import Environments
    from journal.repositories.test_turns import TestTurns as TurnRows
    from journal.repositories.workers import Workers
    settings, outputs, scope = app.container.get(SettingRows), app.container.get(CommandOutputs), app.container.get(Scope)
    started, gates, results, stops = [], {}, {}, []

    class Crew:
        def find(self, number):
            return Worker(id=number, environment_id=1, name=f"Worker {number}")

        def save(self, row, actor):
            return row

    crew = Crew()
    monkeypatch.setattr(OutputFiles, "stop", lambda self, reason: (stops.append((self.folder.name, reason)), gates[int(self.folder.name.removeprefix("run"))].set()))

    class Runner:
        def run(self, request, caller, environment):
            number = int(Path(request.cwd).name.removeprefix("wt"))
            started.append(number)
            with scope.environment(1):
                row = outputs.save(CommandOutput(chain=f"run{number}", command=request.line, folder=str(tmp_path / f"run{number}"), ran_in=request.cwd), Actor.system())
                gates.setdefault(number, threading.Event()).wait(10)
                outputs.save(outputs.find(row.row_id).with_(ended=True), Actor.system())
            yield f"FAILED tests/test_{number}.py::test_it\n".encode()

    def fresh():
        started.clear(), gates.clear(), results.clear(), stops.clear()
        gates.update({n: threading.Event() for n in range(1, 5)})
        return TestTurns(app.container.get(TurnRows), Runner(), SimpleNamespace(place=lambda worker: tmp_path / f"wt{worker.id}"), app.container.get(Readers), settings, outputs, scope, crew, app.container.get(Environments), app.container.get(TimeSource))

    def worker(number):
        return SimpleNamespace(id=number, name=f"Worker {number}", environment_id=1)

    def ask(turns, number):
        with scope.environment(1):
            results[number] = turns.run_batches(worker(number), f"tests/test_{number}.py", SimpleNamespace())

    def asking(turns, *numbers):
        threads = [threading.Thread(target=ask, args=(turns, number)) for number in numbers]
        for thread in threads:
            thread.start()
            time.sleep(0.4)
        return threads

    def until(test):
        end = time.time() + 10
        while not test() and time.time() < end:
            time.sleep(0.05)
        return test()

    user_set(app, WorkersOptions.TEST_COMMAND.key, "pytest -q")
    user_set(app, WorkersOptions.TEST_RUNS.key, 1)
    user_set(app, WorkersOptions.TEST_RUN_MINUTES.key, 0.01)
    turns = fresh()
    threads = asking(turns, 1, 2)
    assert until(lambda: 1 in results) and "timed out" in results[1] and [name for name, _ in stops] == ["run1"], "a run past the time limit is stopped and reported to its worker as timed out"
    assert until(lambda: started == [1, 2]), "and its place goes to the next waiting turn"
    gates[2].set()
    for thread in threads:
        thread.join(10)

    user_set(app, WorkersOptions.TEST_RUN_MINUTES.key, 10)
    turns = fresh()
    first = asking(turns, 1)
    follow = asking(turns, 2)
    assert started == [1]
    turns.release(1)
    assert until(lambda: started == [1, 2]) and [name for name, _ in stops] == ["run1"], "a worker that ends has its running run stopped, its waiting turn gone, and the next turn starts"
    gates[2].set()
    for thread in follow:
        thread.join(10)

    turns = fresh()
    with scope.environment(1):
        for number in (1, 2, 3):
            turns.open_turn(SimpleNamespace(id=number, name=f"Worker {number}", environment_id=1), "t", "pytest -q t", str(tmp_path / f"wt{number}"))
    resumed = turns.resume()
    for number in (1, 2, 3):
        assert until(lambda: len(started) == number) and started == list(range(1, number + 1)), "after a restart the waiting turns run in order, one at a time"
        gates[number].set()
    for thread in resumed:
        thread.join(10)


def test_a_turn_runs_the_projects_test_command_is_refused_without_one_and_a_worker_holds_one_turn_and_a_worktree_one_run(app: App, tmp_path):
    import threading
    import time
    from types import SimpleNamespace
    from journal.features.shell.support.readers import Readers
    from journal.features.workers.support.test_turns import TestTurns
    from journal.models.worker import Worker
    from journal.repositories.command_outputs import CommandOutputs
    from journal.repositories.environments import Environments
    from journal.repositories.test_turns import TestTurns as TurnRows
    from journal.support.rejection import Rejection
    settings, scope = app.container.get(SettingRows), app.container.get(Scope)
    lines, gates, saved = [], {}, []

    class Crew:
        def find(self, number):
            return Worker(id=number, environment_id=1, name=f"Worker {number}")

        def save(self, row, actor):
            saved.append(row)
            return row

    class Runner:
        def run(self, request, caller, environment):
            lines.append((request.line, Path(request.cwd).name))
            gates.setdefault(request.line, threading.Event()).wait(10)
            if "nope" in request.line:
                yield b"ERROR: file or directory not found: nope.py\n__journal_exit 4\n"
            else:
                yield b"1 passed\n__journal_exit 0\n"

    folders = {"a": tmp_path / "a", "b": tmp_path / "b", "bare": tmp_path / "bare"}
    for name in ("a", "b"):
        (folders[name] / "tests").mkdir(parents=True)
    folders["bare"].mkdir()
    where = {1: "a", 2: "a", 3: "b", 4: "bare"}
    turns = TestTurns(app.container.get(TurnRows), Runner(), SimpleNamespace(place=lambda worker: folders[where[worker.id]]), app.container.get(Readers), settings, app.container.get(CommandOutputs), scope, Crew(), app.container.get(Environments), app.container.get(TimeSource))
    user_set(app, WorkersOptions.TEST_RUNS.key, 3)
    results = {}

    def ask(number, ids):
        with scope.environment(1):
            try:
                results[number] = turns.run_batches(SimpleNamespace(id=number, name=f"Worker {number}", environment_id=1), ids, SimpleNamespace())
            except Rejection as refusal:
                results[number] = f"refused: {refusal}"

    def until(test):
        end = time.time() + 10
        while not test() and time.time() < end:
            time.sleep(0.05)
        return test()

    ask(4, "tests/x.py")
    assert results[4] == f"refused: this project has no test command: set {WorkersOptions.TEST_COMMAND.key}", "a project with no test command refuses a turn in one line naming the setting"
    user_set(app, WorkersOptions.TEST_COMMAND.key, "make check")
    gates["make check tests/x.py"] = threading.Event()
    gates["make check tests/x.py"].set()
    ask(3, "tests/x.py")
    assert lines == [("make check tests/x.py", "b")], "the configured command runs with the test ids"
    user_set(app, WorkersOptions.TEST_COMMAND.key, "")
    gates["pytest -q nope.py"] = threading.Event()
    gates["pytest -q nope.py"].set()
    ask(3, "nope.py")
    assert lines[-1] == ("pytest -q nope.py", "b") and "file or directory not found" in results[3], "with none set, pytest runs where there is a tests folder, and a missing test comes back as the runner's not found result"
    assert saved and saved[-1].failing_runs == 1, "as a failed run, counted toward the failing runs"
    first = threading.Thread(target=ask, args=(1, "tests/one.py"))
    first.start()
    assert until(lambda: lines[-1][0] == "pytest -q tests/one.py"), "a turn started"
    second = threading.Thread(target=ask, args=(2, "tests/two.py"))
    second.start()
    time.sleep(0.6)
    assert lines[-1][0] == "pytest -q tests/one.py", "two workers in one worktree go one after another, whatever the budget"
    again = threading.Thread(target=ask, args=(1, "tests/again.py"))
    again.start()
    again.join(10)
    assert results[1].startswith("refused: worker 1") and "has a turn open already" in results[1], "a worker's second turn is refused while its first is open"
    gates.setdefault("pytest -q tests/one.py", threading.Event()).set()
    assert until(lambda: lines[-1][0] == "pytest -q tests/two.py"), "and the second starts once the first ends"
    gates.setdefault("pytest -q tests/two.py", threading.Event()).set()
    first.join(10)
    second.join(10)


def test_a_turn_of_more_ids_than_tests_per_run_runs_in_batches_each_in_the_budget_and_comes_back_as_one_result_with_the_totals(app: App, tmp_path):
    import threading
    from types import SimpleNamespace
    from journal.features.shell.support.readers import Readers
    from journal.features.workers.support.test_turns import TestTurns
    from journal.models.worker import Worker
    from journal.repositories.command_outputs import CommandOutputs
    from journal.repositories.environments import Environments
    from journal.repositories.test_turns import TestTurns as TurnRows
    settings, scope = app.container.get(SettingRows), app.container.get(Scope)
    lines, going, most = [], [], [0]

    class Crew:
        def find(self, number):
            return Worker(id=number, environment_id=1, name=f"Worker {number}")

        def save(self, row, actor):
            return row

    class Runner:
        def run(self, request, caller, environment):
            lines.append(request.line)
            going.append(1)
            most[0] = max(most[0], len(going))
            outcome = b"FAILED tests/a.py::t - assert 1 == 2\n1 failed, 1 passed in 0.1s\n__journal_exit 1\n" if len(lines) == 1 else b"%d passed in 0.1s\n__journal_exit 0\n" % (2 if len(lines) == 2 else 1)
            going.pop()
            yield outcome

    turns = TestTurns(app.container.get(TurnRows), Runner(), SimpleNamespace(place=lambda worker: tmp_path), app.container.get(Readers), settings, app.container.get(CommandOutputs), scope, Crew(), app.container.get(Environments), app.container.get(TimeSource))
    user_set(app, WorkersOptions.TEST_COMMAND.key, "pytest -q")
    user_set(app, WorkersOptions.TEST_ID_LIMIT.key, 2)
    user_set(app, WorkersOptions.TEST_RUNS.key, 1)
    with scope.environment(1):
        run_output = turns.run_batches(SimpleNamespace(id=1, name="Worker 1", environment_id=1), "a.py b.py c.py d.py e.py", SimpleNamespace())
    assert lines == ["pytest -q a.py b.py", "pytest -q c.py d.py", "pytest -q e.py"], "five ids with two to a run are three runs, the ids kept whole"
    assert most[0] == 1, "each run takes its own place in the budget"
    assert "FAILED tests/a.py::t" in run_output and "2 passed" in run_output, "a failing first batch does not stop the others, and the result holds each batch's lines"
    assert run_output.splitlines()[-1] == "3 runs: 4 passed, 1 failed", "with one line of totals"


def test_a_finished_plan_says_what_follows_and_a_plan_in_review_names_the_reports_not_read_yet(app: App):
    from datetime import datetime, timezone
    from journal.features.plans.plans_nudges import PlansNudges
    from journal.features.plans.support.review_rounds import ReviewRounds
    from journal.models.link import Link
    from journal.models.plan import Plan
    from journal.models.report import Report
    from journal.models.support.ref import Ref
    from journal.repositories.links import Links
    from journal.repositories.messages import Messages
    from journal.repositories.plans import Plans
    from journal.repositories.reports import Reports
    done = PlansNudges.PLAN_FINISHED.create(n=7).rendered()
    assert "plan 7 done" in done and "final suite" in done and "merging to main and releasing wait for the user's word" in done, done
    assert PlansNudges.unread((12, 14)) == "; unread: reports 12, 14", "the reviewers back, the reports of the round still unread are named beside the sequence's next step"
    assert PlansNudges.unread(()) == "", "no unread report, nothing named"
    plan = app.container.get(Plans).save(Plan(title="the hub"), Actor.user(1))
    rounds, reports, links = app.container.get(ReviewRounds), app.container.get(Reports), app.container.get(Links)
    rounds.begin(plan, Actor.user(1))
    unread, read = (reports.save(Report(title=title, abstract=title), Actor.agent("s1")) for title in ("reviewer one", "researcher two"))
    for report in (unread, read):
        links.save(Link(source=Ref.build(report), target=Ref.build(plan), link_type=Messages.SUBJECT_LINK), Actor.agent("s1"))
    reports.save(read.read(datetime.now(timezone.utc)), Actor.user(1))
    assert [report.row_id for report in rounds.unread(plan)] == [unread.row_id], "of the reports filed about the plan in its review only the unread one is named"


def test_a_due_start_of_a_check_that_a_run_started_meanwhile_starts_nothing(app: App):
    import time
    from journal.features.checks.support.check_runner import CheckRunner
    from journal.models.check import Check
    from journal.repositories.checks import Checks
    checks, runner = app.container.get(Checks), app.container.get(CheckRunner)
    with app.container.get(Scope).environment(MAIN):
        stale = checks.save(Check(title="slow", command="true", interval=1), Actor.user(1))
        running = checks.save(stale.started(time.time()), Actor.user(1))
        returned = runner.start(stale, Actor.system())
        assert returned.progress.time == running.progress.time == checks.find(stale.row_id).progress.time, "the due tick had read the check before the run began: it starts no second run over the first"


def test_a_sequence_starts_on_its_phrase_as_the_request_and_not_inside_a_longer_message():
    from journal.models.trigger import Trigger
    from journal.models.trigger_action import TriggerAction
    from journal.features.sequences.shipped import UPDATE_WRITING

    assert UPDATE_WRITING.is_requested("give me an update") and UPDATE_WRITING.is_requested("could you give me an update?"), "the request itself starts it"
    assert not UPDATE_WRITING.is_requested("update the plan and tell me") and not UPDATE_WRITING.is_requested("please update me"), "the bare word update starts nothing"
    assert not UPDATE_WRITING.is_requested("relay the plan to the other agent so it can build it and send me a tldr when it is done with the first phase"), "a phrase inside a long message about something else starts nothing"
    assert Trigger(phrases=("release",), action=TriggerAction.NUDGE).matches("when we release the build, check the notes first and then tag it"), "a nudge still matches its words anywhere"


def test_the_rules_doc_names_every_line_a_listener_says():
    """Plan 2's map: a listener's line not in the rules table is a line nobody planned for."""
    from pathlib import Path
    doc = (Path(__file__).resolve().parents[1] / "docs" / "the-rules.md").read_text()
    root = Path(__file__).resolve().parents[1] / "src" / "journal" / "features"
    missing = []
    for listener in root.glob("*/listeners/*.py"):
        feature = listener.parts[-3]
        for key in set(re.findall(r"\b([A-Z_]+)\.about\(", listener.read_text())):
            name = re.search(rf"\b{key} = Nudge\(name, \"([a-z_]+)\"", (root / feature / "feature.py").read_text())
            if name and f"{feature}.{name.group(1)}" not in doc and name.group(1) not in doc:
                missing.append(f"{feature}.{name.group(1)}")
    assert not missing, f"lines said by a listener and absent from docs/the-rules.md: {sorted(set(missing))}"


def test_the_rules_doc_rules_on_every_state_the_engine_knows(app: App):
    from pathlib import Path
    from journal.engine.states_catalogue import StatesCatalogue
    doc = (Path(__file__).resolve().parents[1] / "docs" / "the-rules.md").read_text()
    table = doc.split("## Every state, and who holds its conduct")[1].split("## ")[0]
    names = app.container.get(StatesCatalogue).names()
    assert "subagent" not in names, "the state nothing entered is gone"
    assert [n for n in names if f"| {n} |" not in table] == [], "every state the engine knows has a ruling in the rules doc"


def test_a_read_outside_every_scope_is_refused(app: App):
    from contextvars import Context
    from journal.repositories.tasks import Tasks
    from journal.support.scope_missing import ScopeMissing
    with pytest.raises(ScopeMissing):
        Context().run(app.container.get(Tasks).scoped)


def test_an_agent_data_in_a_pause_it_owed_is_unwrapped_at_boot_with_the_fact_set(tmp_path: Path, monkeypatch):
    import json
    import sqlite3
    monkeypatch.setattr(Config, "status_home", property(lambda self: tmp_path / "status"))
    first = main_journal(Config(tmp_path, port=0))
    first.runtime().start()
    hook(first, "SessionStart")
    first.console().run(["environment", "overview"], AGENT)
    first.console().run(["task", "create", "t", "--start"], AGENT)
    first.runtime().stop()
    db = sqlite3.connect(first.config.database)
    working = json.loads(db.execute("SELECT data FROM agents WHERE session = 's1'").fetchone()[0])
    nested = {"resume": {"state": "at_mark", "data": {"resume": {"state": "working", "data": working}, "mark": 50}}, "skill": "plans", "path": ".claude/skills/journal-plans/SKILL.md"}
    db.execute("UPDATE agents SET state = 'loading_skill', data = ?, is_overview_read = 1, threshold_due = 0 WHERE session = 's1'", (json.dumps(nested),))
    old_columns(db)
    db.execute("DELETE FROM migrations")
    db.commit()
    db.close()
    second = main_journal(Config(tmp_path, port=0))
    second.runtime().start()
    try:
        from journal.features.skills.support.requirements import Requirements
        from journal.repositories.agents import Agents
        from journal.repositories.scope import Scope
        with second.container.get(Scope).environment(MAIN):
            agent = second.container.get(Agents).session_agent("s1")
            assert agent.state == "working" and agent.data.get("task_id") == 1 and agent.threshold_due == 50 and agent.is_overview_read is True, "unwrapped to the work it held, the mark owed, never dropped to idle"
            assert "plans" in second.container.get(Requirements).obligation_names(agent), "the skill it was reading is owed as a link"
    finally:
        second.runtime().stop()


def test_an_agent_in_the_old_running_sequence_state_is_unwrapped_at_boot_with_the_run_on_its_row(tmp_path: Path, monkeypatch):
    import sqlite3
    monkeypatch.setattr(Config, "status_home", property(lambda self: tmp_path / "status"))
    first = main_journal(Config(tmp_path, port=0))
    first.runtime().start()
    hook(first, "SessionStart")
    first.console().run(["environment", "overview"], AGENT)
    first.console().run(["task", "create", "t", "--start"], AGENT)
    produced = first.console().run(["sequence", "create", "release", "--steps", "bump | tag | push"], USER).text.split()[1].rstrip(":")
    first.runtime().stop()
    db = sqlite3.connect(first.config.database)
    working = json.loads(db.execute("SELECT data FROM agents WHERE session = 's1'").fetchone()[0])
    active = {"resume": {"state": "working", "data": working}, "sequence_id": int(produced), "step": 1, "text": "tag"}
    db.execute("UPDATE agents SET state = 'waiting', data = ? WHERE session = 's1'", (json.dumps({"resume": {"state": "running_sequence", "data": active}, "question_id": 1}),))
    old_columns(db)
    db.execute("DELETE FROM migrations")
    db.commit()
    db.close()
    second = main_journal(Config(tmp_path, port=0))
    second.runtime().start()
    try:
        from journal.repositories.agents import Agents
        from journal.repositories.scope import Scope
        with second.container.get(Scope).environment(MAIN):
            agent = second.container.get(Agents).session_agent("s1")
            run = second.container.get(RunTracker).runs(agent)[-1]
            assert agent.state == "waiting" and [layer["state"] for layer in agent.stack] == ["idle", "working", "following_sequence", "waiting"], "the run's layer is taken out of the chain and stands on the stack beneath the wait"
            assert run.title == "release" and [step.instructions for step in run.steps] == ["bump", "tag", "push"] and run.text == "tag", "the run is on the row at the step it stood at"
    finally:
        second.runtime().stop()


def test_a_list_counts_a_type_in_sql_past_the_page(app: App):
    import json as j
    from urllib.request import urlopen
    from journal.models.task import Task
    from journal.models.task_state import TaskState
    from journal.repositories.tasks import Tasks
    tasks = app.container.get(Tasks)
    for n in range(520):
        tasks.save(Task(environment_id=1, title=f"t{n}", state=TaskState.COMPLETED if n < 400 else TaskState.OPEN), Actor.user(1) if n % 2 else Actor.agent("s1"))
    with urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/tasks?limit=10&env=main"), timeout=5) as reply:
        counts = j.loads(reply.read())["counts"]
    assert counts == {"all": 520, "open": 120, "unread": 60}, "a count is of every row, not of the newest page"


def test_a_skill_owed_as_a_link_moves_onto_the_agent_at_boot(tmp_path: Path, monkeypatch):
    import sqlite3
    from journal.repositories.agents import Agents
    from journal.repositories.links import Links
    monkeypatch.setattr(Config, "status_home", property(lambda self: tmp_path / "status"))
    first = main_journal(Config(tmp_path, port=0))
    first.runtime().start()
    first.runtime().stop()
    db = sqlite3.connect(first.config.database)
    db.execute("INSERT INTO agents (created_at, creator, updated_at, updater, environment_id, session, state, data) VALUES ('2026-10-17', 'system', '2026-10-17', 'system', 1, 's1', 'idle', '{}')")
    agent = db.execute("SELECT MAX(id) FROM agents").fetchone()[0]
    db.execute("INSERT INTO links (created_at, creator, updated_at, updater, source, target, link_type) VALUES ('2026-10-17', 'system', '2026-10-17', 'system', ?, NULL, 'owes:journal')", (f"agents:{agent}",))
    old_columns(db)
    db.execute("DELETE FROM migrations WHERE number >= 7")
    db.commit()
    db.close()
    second = main_journal(Config(tmp_path, port=0))
    second.runtime().start()
    try:
        assert second.container.get(Agents).find(agent).skills_due == ("journal",), "the owed skill is a fact on the agent's row"
        assert not [link for link in second.container.get(Links).all() if link.link_type.startswith("owes:")], "and the one-ended link is gone"
    finally:
        second.runtime().stop()


def test_the_mcp_page_shows_a_servers_state_as_last_checked_and_check_all_reads_it_anew(app: App, monkeypatch):
    import json as j
    from urllib.request import Request as R, urlopen as open_url
    from journal.features.mcp.support.health import Health
    from journal.features.mcp.support.health_report import HealthReport
    from journal.features.mcp.support.server_catalogue import ServerCatalogue
    answers = [HealthReport({"claude_design": ServerCatalogue("claude_design", "https://api.anthropic.com/v1/design/mcp", "failed", "rejected your login")}),
               HealthReport({"claude_design": ServerCatalogue("claude_design", "https://api.anthropic.com/v1/design/mcp", "connected", "")})]
    monkeypatch.setattr(Health, "probe", lambda self: answers.pop(0) if len(answers) > 1 else answers[0])
    app.container.get(Health).recheck()
    port = app.server().port
    read = lambda: j.load(open_url(R(f"http://127.0.0.1:{port}/journal/mcp", headers={"X-Journal-Env": "main"}), timeout=5))
    previous = read()
    design = next(s for s in previous["servers"] if s["name"] == "claude_design")
    assert design["state"] == "failed" and previous["checked_at"] > 0, "the page is told the state and when it was checked"
    open_url(R(f"http://127.0.0.1:{port}/journal/mcp/check", data=b"{}", method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5)
    following = next(s for s in read()["servers"] if s["name"] == "claude_design")
    assert following["state"] == "connected", "Check all asks the program anew, so a login done since shows"


def test_a_plugin_manifest_is_read_and_each_wrong_one_refused_by_name(app: App, tmp_path):
    from journal.features.plugins.support.manifest_reader import ManifestReader
    from journal.support.rejection import Rejection
    reader = app.container.get(ManifestReader)
    good = {"name": "echo", "version": "1.0.0", "program": "run.py", "protocol": 1, "hears": ["tool_starting", "tasks.created"], "holds": ["tool_starting"],
            "services": [{"name": "serve", "command": ["bin/serve"], "restart": "always"}]}

    def made(changes: dict, files=("run.py",)) -> Path:
        folder = tmp_path / str(len(list(tmp_path.iterdir())))
        folder.mkdir()
        for file in files:
            (folder / file).parent.mkdir(parents=True, exist_ok=True)
            (folder / file).write_text("print()")
        (folder / "journal-plugin.json").write_text(json.dumps({**good, **changes}))
        return folder
    manifest = reader.read(made({}))
    assert manifest.name == "echo" and tuple(h.event for h in manifest.blocks) == ("tool_starting",) and manifest.services[0].name == "serve"
    refusals = {
        "is not": {"name": "Echo!"},
        "one of the journal's own features": {"name": "tasks"},
        "speaks protocol 2": {"protocol": 2},
        "hears nothing.created!, which is no event": {"hears": ["nothing.created!"]},
        "the secrets rows are never sent": {"hears": ["secrets.created"]},
        "blocks idle but does not hear it": {"holds": ["idle"]},
        "blocks tool_finished, which no plugin may hold": {"hears": ["tool_finished"], "holds": ["tool_finished"]},
        "program ../run.py leads outside its folder": {"program": "../run.py"},
        "service serve /usr/bin/serve leads outside": {"services": [{"name": "serve", "command": ["/usr/bin/serve"]}]},
        "program missing.py is not in its folder": {"program": "missing.py"},
        "the users rows are never sent": {"hears": ["users.updated"]},
        "skill journal-tasks has the name of a skill of the journal": ({"skills": "skills"}, ("run.py", "skills/journal-tasks/SKILL.md")),
        "skills /tmp leads outside": {"skills": "/tmp"},
    }
    for text, changes in refusals.items():
        try:
            reader.read(made(*changes) if isinstance(changes, tuple) else made(changes))
            raise AssertionError(f"not refused: {changes}")
        except Rejection as refused:
            assert text in str(refused), f"{changes} refused as {refused}"
    foreign = tmp_path / "elsewhere.py"
    foreign.write_text("print()")
    linked = made({}, ())
    (linked / "run.py").symlink_to(foreign)
    with pytest.raises(Rejection, match="program run.py leads outside its folder"):
        reader.read(linked)
    from journal.models.plugin import Plugin
    from journal.repositories.plugins import Plugins
    lint = made({"name": "lint", "skills": "skills"}, ("run.py", "skills/lint-rules/SKILL.md"))
    app.container.get(Plugins).save(Plugin(name="lint", source=str(lint), linked=True, manifest=PluginManifest.parsed({**good, "name": "lint", "skills": "skills"})), Actor.user(1))
    with pytest.raises(Rejection, match="skill lint-rules has the name of a skill of plugin lint"):
        reader.read(made({"skills": "skills"}, ("run.py", "skills/lint-rules/SKILL.md")))


def test_a_manifest_and_an_answer_with_a_key_this_journal_does_not_know_still_work_with_a_warning(app: App, tmp_path):
    from journal.features.plugins.support.manifest_reader import ManifestReader
    from journal.features.plugins.support.protocol import Protocol
    reader, protocol = app.container.get(ManifestReader), app.container.get(Protocol)
    folder = tmp_path / "newer"
    folder.mkdir()
    (folder / "run.py").write_text("print()")
    (folder / "journal-plugin.json").write_text(json.dumps({"name": "newer", "version": "1", "program": "run.py", "hears": ["tool_starting"], "from_the_future": 1, "also": 2}))
    manifest = reader.read(folder)
    assert manifest.name == "newer" and manifest.events == ("tool_starting",) and manifest.ignored == ("also", "from_the_future"), "an unknown manifest key is ignored and named, never a refusal"
    answer = protocol.parsed_answer(json.dumps({"answer": "refuse", "reason": "no", "say": "x"}))
    assert (answer.answer, answer.reason, answer.ignored) == ("refuse", "no", ("say",)), "an unknown answer key is ignored and named, the answer kept"


def test_a_plugin_is_a_row_and_writes_as_itself(app: App):
    from journal.support.actor_type import ActorType
    from journal.models.plugin import Plugin
    from journal.models.task import Task
    from journal.repositories.plugins import Plugins
    from journal.repositories.tasks import Tasks
    plugins = app.container.get(Plugins)
    plugins.save(Plugin(name="lint", source="/tmp/lint", manifest=PluginManifest(name="lint")), Actor.user(1))
    assert plugins.lookup("lint").enabled and [p.name for p in plugins.enabled()] == ["lint"]
    served = PluginManifest.parsed({"name": "served", "services": [{"name": "watch", "command": ["./watch"], "when": "test -d .git"}]})
    plugins.save(Plugin(name="served", source="/tmp/served", manifest=served), Actor.user(1))
    assert plugins.lookup("served").manifest.services[0].condition == "test -d .git" and served.published()["services"][0]["when"] == "test -d .git", "a service's when key is stored and read back as plugins write it"
    task = app.container.get(Tasks).save(Task(environment_id=1, title="written by a plugin"), Actor.plugin("lint"))
    assert task.creator == Actor(ActorType.PLUGIN, "lint") and task.creator.stamp == "plugin:lint" and Actor.parse("plugin:lint") == task.creator

def test_the_plugin_protocol_sends_one_line_and_reads_one_back(app: App):
    from journal.events.agent.tool_starting import ToolStarting
    from journal.events.models.created import Created
    from journal.features.plugins.support.plugin_fault import PluginFault
    from journal.features.plugins.support.protocol import Protocol
    from journal.models.task import Task
    protocol = app.container.get(Protocol)
    from journal.providers.claude import Claude
    tool = json.loads(protocol.event_line(ToolStarting(agent=agent_row(app), call=Claude().call("Bash", {"command": "ls"}, frozenset(), CLASSIFIER)).placed(agent_row(app, "s1", 1, "claude"), 0.2, 0.0), "main", "working"))
    assert (tool["v"], tool["event"], tool["session"], tool["state"], tool["data"]) == (1, "tool_starting", "s1", "working", {"boot_wait_seconds": 0.0, "tool_use": 0, "hook_key": "", "tool": "Bash", "input": {"command": "ls"}, "operation": {"kind": "shell line", "command": "ls", "shell": "", "flag": ""}, "command": "ls", "parts": [{"text": "ls", "is_journal": False, "writes": False, "files": [], "reads_output": False, "read_shape": "ls", "classification": {"command_type": "search", "effects": ["reads_files"], "uncertain": False, "label": "listing"}, "shape": "ls"}], "is_journal": False, "writes": False, "written_paths": [], "read_paths": [], "file_lines": 0, "skill_loaded": "", "work": "searching", "table_version": CLASSIFIER.version, "shape": "ls", "name": "ls", "shape_runs": 0, "folder": ""}), "an agent event: its name, where it happened and the call's one reading, flat, as a plugin reads it, with the folder it runs in"
    row = json.loads(protocol.event_line(Created(model=Task(id=7, environment_id=1, title="t"), actor=Actor.plugin("echo")), "main"))
    assert row["event"] == "tasks.created" and row["data"] == {"table": "tasks", "id": 7, "by": "plugin:echo"}, "a row event: its table, its number and who wrote it"
    assert protocol.parsed_answer("").answer == "allow", "an empty answer lets the event through"
    answer = protocol.parsed_answer(json.dumps({"v": 1, "answer": "refuse", "reason": "not on main", "cards": [{"kind": "sin", "label": "a sin"}], "commands": ["journal task list"]}))
    assert (answer.answer, answer.reason, answer.cards[0].card_type, answer.commands) == ("refuse", "not on main", "sin", ("journal task list",))
    for broken, text in (("{nope", "not JSON"), ('["a"]', "not a JSON object"), ('{"answer": "maybe"}', "allow, refuse or tell"), ('{"v": 2}', "protocol 2"), (json.dumps({"commands": ["journal x"] * 21}), "at most 20")):
        try:
            protocol.parsed_answer(broken)
            raise AssertionError(f"no fault for {broken}")
        except PluginFault as fault:
            assert text in str(fault), f"{broken}: {fault}"

def echo(app, name="echo", **manifest):
    """The echo plugin as a fetched copy in the journal's plugins folder, its row's manifest changed as given."""
    import shutil
    from journal.models.plugin import Plugin
    from journal.repositories.plugins import Plugins
    folder = Path(__file__).parent / "plugins" / "echo"
    shutil.copytree(folder, app.config.home / "plugins" / name, dirs_exist_ok=True)
    return app.container.get(Plugins).save(Plugin(name=name, source=str(folder), manifest=PluginManifest.parsed(json.loads((folder / "journal-plugin.json").read_text()) | manifest)), Actor.user(1))


def test_a_plugins_processes_run_with_the_path_the_users_login_shell_has(app: App, tmp_path, monkeypatch):
    from journal.features.plugins.support.plugin_runner import PluginRunner
    shell = tmp_path / "login-shell"
    shell.write_text('#!/bin/sh\nprintf "%s" "noise journal-path-begin:/home/me/.nvm/bin:/usr/bin:journal-path-finish"\n')
    shell.chmod(0o755)
    monkeypatch.setenv("SHELL", str(shell))
    plugin = echo(app)
    path = app.container.get(PluginRunner).environment(plugin, "main")["PATH"]
    assert path == f"{app.config.home / 'bin'}:/home/me/.nvm/bin:/usr/bin", "a tool the user's shell finds, as nvm's node, is found by the plugin's service and commands too"


def echo_heard(app, name="echo") -> list[str]:
    file = app.config.home / "plugin-data" / name / "heard.jsonl"
    return [json.loads(line)["event"] for line in file.read_text().splitlines()] if file.is_file() else []


def test_a_subagents_event_reaches_a_plugin_and_is_held_only_at_a_tool(app: App):
    from journal.events.agent.prompt_submitted import PromptSubmitted
    from journal.events.agent.tool_starting import ToolStarting
    from journal.features.plugins.listeners.plugin_agent_relay import PluginAgentRelay
    plugin = echo(app)
    assert PluginAgentRelay.blocks(plugin, ToolStarting(agent=agent_row(app), call=ToolCall(tool="Read", input={}, operation=Claude().operation("Read", {})), subagent="a1")), "a subagent's tool is held like the agent's"
    assert not PluginAgentRelay.blocks(plugin, PromptSubmitted(agent=agent_row(app), prompt="x", subagent="a1")) and PluginAgentRelay.blocks(plugin, PromptSubmitted(agent=agent_row(app), prompt="x")), "a subagent's other events are heard, never held"


def test_the_restart_notice_closes_in_every_environment_once_a_session_started_on_the_running_version(app: App):
    """The hook writes the event and the version a session started on; once it names the version the journal runs, every environment's restart notice closes, whether or not the start reached the server."""
    from datetime import datetime, timezone
    from journal.features.updates.jobs.restart_check import RestartCheck
    from journal.features.updates.support.session_restart import NOTICE_TITLE, SessionRestart
    from journal.repositories.environments import Environments
    from journal.repositories.notices import Notices
    from journal.version import VERSION
    app.container.get(Environments).lookup("second")
    restart, notices = app.container.get(SessionRestart), app.container.get(Notices)
    restart.notice()
    def open_everywhere():
        return [n.title for environment in app.container.get(Environments).all() for n in scoped_notices(environment.row_id) if n.title == NOTICE_TITLE]
    def scoped_notices(environment_id):
        with app.container.get(Scope).environment(environment_id):
            return notices.open_scoped()
    assert len(open_everywhere()) == 2, "pinned in every environment"
    marker = app.config.home / "runtime" / "session-version"
    marker.parent.mkdir(parents=True, exist_ok=True)
    marker.write_text("SessionStart 4.4.9\n")
    app.container.get(RestartCheck).tick(datetime.now(timezone.utc).timestamp())
    assert len(open_everywhere()) == 2, "a session started on an older version takes nothing up"
    marker.write_text(f"SessionStart {VERSION}\n")
    app.container.get(RestartCheck).tick(datetime.now(timezone.utc).timestamp())
    assert open_everywhere() == [], "a session started on the running version closes the notice in every environment"


def test_an_update_across_the_shell_runner_pins_a_notice_to_start_the_session_again_until_one_starts(app: App):
    """Updating from before 4.5.0 to it or later pins a notice in every environment asking for the agent's session to start again, once; a start on the same version pins nothing, and the next session start closes it."""
    from journal.features.updates.seeds.version_change import VersionChange
    from journal.features.updates.support.session_restart import NOTICE_TITLE, SessionRestart
    from journal.repositories.journal_versions import JournalVersions
    from journal.repositories.notices import Notices
    assert SessionRestart.is_crossed("4.4.9", "4.5.0") and not SessionRestart.is_crossed("4.5.0", "4.5.1") and not SessionRestart.is_crossed("4.3.0", "4.4.9")
    hook(app, "SessionStart")
    notices = app.container.get(Notices)
    open_notices = lambda: [n.title for n in notices.open_scoped() if n.title == NOTICE_TITLE]
    versions = app.container.get(JournalVersions)
    versions.save(versions.current().with_(version="4.4.9"), Actor.system())
    app.container.get(VersionChange).run()
    with app.container.get(Scope).environment(1):
        assert open_notices() == [NOTICE_TITLE], "the notice is pinned"
    app.container.get(VersionChange).run()
    with app.container.get(Scope).environment(1):
        assert open_notices() == [NOTICE_TITLE], "a start on the same version pins no second notice"
    hook(app, "SessionStart", source="startup")
    app.runtime().deferred.drain()
    with app.container.get(Scope).environment(1):
        assert open_notices() == [], "the next session start closes it"


def test_a_plugin_upgrade_keeps_the_files_the_plugin_built_and_an_upgrade_to_the_same_version_changes_nothing(app: App, tmp_path):
    import shutil
    import subprocess
    from journal.features.plugins.support.plugin_folders import PluginFolders
    from journal.repositories.plugins import Plugins
    source = tmp_path / "echo-source"
    shutil.copytree(Path(__file__).parent / "plugins" / "echo", source)
    (source / "old-script.py").write_text("shipped by the old version")

    def committed(*line: str) -> None:
        subprocess.run(["git", "-C", str(source), *line], check=True, capture_output=True, timeout=30)

    committed("init", "-q")
    committed("add", "-A")
    committed("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "echo")
    console, plugins = app.console(), app.container.get(Plugins)
    assert console.run(["plugin", "install", f"file://{source}", "--yes"], USER).code == 0
    built = app.container.get(PluginFolders).folder(plugins.lookup("echo")) / "bin" / "release"
    built.parent.mkdir()
    built.write_text("built on install")
    shown = console.run(["plugin", "upgrade", "echo"], USER).text
    assert "bin/release" not in shown, "a file the plugin built is not shown as removed"
    (source / "old-script.py").unlink()
    committed("add", "-A")
    committed("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "drop the old script")
    assert console.run(["plugin", "upgrade", "echo", "--yes"], USER).code == 0
    assert built.read_text() == "built on install", "and the upgrade keeps it"
    assert not (built.parent.parent / "old-script.py").exists(), "while a file the old source shipped and the new one dropped is removed"


def test_a_plugin_that_needs_a_newer_journal_is_refused_by_that_before_any_key_it_brings(app: App, tmp_path):
    from journal.features.plugins.support.manifest_reader import ManifestReader
    from journal.support.rejection import Rejection
    from journal.version import VERSION
    folder = tmp_path / "later"
    folder.mkdir()
    (folder / "journal-plugin.json").write_text(json.dumps({"name": "later", "journal": "99.0.0", "keys_of_a_later_journal": []}))
    reader = app.container.get(ManifestReader)
    with pytest.raises(Rejection) as refused:
        reader.read(folder)
    assert str(refused.value) == f"later needs journal 99.0.0 or newer; this journal is {VERSION}", "an install hears the version it needs, not a key it cannot know"
    assert reader.least_journal(folder) == "99.0.0", "an upgrade reads the minimum alone, so an older journal passes the release by"


def test_released_waits_unlink_the_row_and_retire_the_check_its_block_made(app: App):
    from journal.features.tasks.support.waits import Waits
    from journal.models.task import Task
    from journal.repositories.checks import Checks
    from journal.repositories.scope import Scope
    from journal.repositories.tasks import Tasks
    with app.container.get(Scope).environment(1):
        tasks, waits = app.container.get(Tasks), app.container.get(Waits)
        task = tasks.save(Task(environment_id=1, title="ship it"), USER.actor)
        waits.linked(task, [], "false", 2, USER.actor)
        assert tasks.reason(task).startswith("check "), "the block names the check it made"
        waits.released(task, USER.actor)
        assert tasks.reason(task) == "", "no wait is left on it"
        assert all(check.is_retired for check in app.container.get(Checks).rows() if check.wait_target), "the check its block made runs no more"


def test_a_cancelled_task_is_finished_and_never_counted_open(app: App):
    from datetime import datetime, timezone
    from journal.db.migrations.finish_cancelled_tasks import FinishCancelledTasks
    from journal.db.connection import Connection
    from journal.models.task import Task
    from journal.repositories.scope import Scope
    from journal.repositories.tasks import Tasks
    with app.container.get(Scope).environment(1):
        tasks = app.container.get(Tasks)
        cancelled = tasks.save(tasks.save(Task(environment_id=1, title="a task of its own"), USER.actor).cancelled(datetime.now(timezone.utc), "the plan was cancelled"), USER.actor)
        tasks.save(Task(environment_id=1, title="a task of nobody's"), USER.actor)
        assert cancelled.completed_at is not None, "a cancel stamps when it finished"
        app.container.get(ListenerQueue).drain()
        connection = app.container.get(Connection)
        connection.execute("UPDATE tasks SET completed_at = NULL WHERE id = ?", (cancelled.row_id,))
        FinishCancelledTasks().apply(connection)
        assert tasks.find(cancelled.row_id).completed_at is not None, "and one cancelled before that is finished by the migration"
        assert tasks.unfinished_count() == 1, "only the task still open is counted"


def test_a_secret_row_holds_its_fields_and_its_values_live_in_a_private_file(app: App, tmp_path, monkeypatch):
    import stat
    import uuid
    from datetime import datetime, timedelta, timezone
    from journal.support.secret_values import SecretValues
    from journal.models.secret import Secret
    from journal.models.secret_type import SecretType
    from journal.repositories.secrets import Secrets
    monkeypatch.setenv("AGENT_JOURNAL_SECRETS", str(tmp_path / "private"))
    secrets, values = app.container.get(Secrets), app.container.get(SecretValues)
    secret = secrets.save(Secret(title="Github", secret_type=SecretType.API_KEY, fields=SecretType.API_KEY.first_fields("Github")), Actor.user("u"))
    assert secret.fields == ({"name": "key", "hidden": True, "variable": "GITHUB_KEY"},) and secret.waiting()
    token = f'gh-"quoted"-{uuid.uuid4().hex}'
    values.put("GITHUB_KEY", token)
    secret = secrets.save(secret.is_filled("key"), Actor.user("u"))
    assert not secrets.find(secret.id).waiting() and values.values() == {"GITHUB_KEY": token}
    assert stat.S_IMODE(values.path.stat().st_mode) == 0o600 and stat.S_IMODE(values.path.parent.stat().st_mode) == 0o700
    assert values.path.name == f"{(app.config.home / 'project-id').read_text().strip()}.env", "the file is named by the project's id, kept in its journal folder"
    raw = b"".join(path.read_bytes() for path in app.config.home.glob("journal.db*"))
    assert token.encode() not in raw, "no value ever reaches the database"
    values.drop(["GITHUB_KEY"])
    assert values.values() == {}
    missing = secrets.save(secrets.find(secret.id).deleted(datetime.now(timezone.utc)), Actor.user("u"))
    assert secrets.active() == [] and secrets.stale_retired(datetime.now(timezone.utc) + timedelta(days=1)) == [missing]


def test_secrets_kept_as_files_in_the_project_folder_become_rows_once(app: App):
    import json as j
    from journal.features.secrets.seeds.secret_files import SecretFiles
    from journal.repositories.secrets import Secrets
    folder = app.config.home / "project" / "secret"
    folder.mkdir(parents=True)
    head = {"n": 1, "title": "flespi", "data": {"kind": "api key", "secret_fields": [{"name": "key", "hidden": True, "variable": "FLESPI_KEY"}], "filled": {"key": 1791556011.2}, "programs": ["curl"], "used": 1791706718.7}, "deleted": 0.0}
    (folder / "001.md").write_text("---\n" + j.dumps(head, indent=2) + "\n---\nThe flespi token, used with curl.\n")
    (folder / "changes.log").write_text("not a secret")
    seed = app.container.get(SecretFiles)
    seed.run()
    seed.run()
    rows = app.container.get(Secrets).all()
    assert len(rows) == 1, "brought in once, however often the journal boots"
    flespi = rows[0]
    assert flespi.title == "flespi" and flespi.secret_type == "api key" and flespi.filled == ("key",) and flespi.programs == ("curl",) and flespi.brief == "The flespi token, used with curl." and flespi.used_at is not None and not flespi.waiting()


def test_a_browser_login_is_taken_in_a_window_given_to_the_agents_browser_and_taken_back(app: App, tmp_path, monkeypatch):
    import json as j
    import time as timing
    from journal.features.mcp.support.mcp_installing import McpInstalling
    from journal.features.secrets.support.browser_logins import BrowserLogins
    from journal.models.mcp_server import McpServer
    from journal.models.secret import Secret
    from journal.models.secret_type import SecretType
    from journal.repositories.mcp_servers import McpServers
    from journal.repositories.secrets import Secrets
    monkeypatch.setenv("AGENT_JOURNAL_SECRETS", str(tmp_path / "private"))
    applied = []
    monkeypatch.setattr(McpInstalling, "applied", lambda self: applied.append(True))

    def recorded(self, title, url):
        self.folder.mkdir(mode=0o700, parents=True, exist_ok=True)
        saved = self.stored_login(title)
        saved.write_text(j.dumps({"cookies": [{"name": "sid", "domain": ".example.com", "path": "/", "expires": 4102444800}], "origins": []}))
        return saved

    monkeypatch.setattr(BrowserLogins, "record", recorded)
    servers, secrets = app.container.get(McpServers), app.container.get(Secrets)
    servers.save(McpServer(name="playwright", title="Playwright", command="npx", args=("-y", "@playwright/mcp@latest", "--headless")), Actor.system())
    secret = secrets.save(Secret(title="Example", secret_type=SecretType.BROWSER_LOGIN, url="https://app.example.com/login"), Actor.user("u"))
    assert "the user logs in to Example:" in app.console().run(["secret", "login", str(secret.id)], AGENT).error, "the agent logs in on its own only where the user allows it"
    viewer(app, f"secrets/{secret.id}/allow-login")
    began = timing.time()
    while secrets.find(secret.id).login_started_at and timing.time() - began < 5:
        timing.sleep(0.05)
    finished = secrets.find(secret.id)
    assert finished.auto_login and finished.session_at and finished.session_expires.year == 2100
    merged = app.container.get(BrowserLogins).merged
    args = servers.lookup("playwright").args
    assert args[-3:] == ("--storage-state", str(merged), "--isolated") and merged.is_file() and applied, "the agent's browser starts with the login, and the agents restart to use it"
    assert "logged in to Example" in app.console().run(["secret", "login", str(secret.id), "--wait"], AGENT).text
    viewer(app, f"secrets/{secret.id}/revoke-login")
    assert not secrets.find(secret.id).auto_login and merged.exists(), "asking each time keeps the saved login"
    viewer(app, f"secrets/{secret.id}/forget-login")
    assert "--storage-state" not in servers.lookup("playwright").args and not merged.exists() and secrets.find(secret.id).session_at is None


def test_a_worker_outlives_a_restart_and_is_watched_again_at_boot(app: App, tmp_path):
    import subprocess
    import time as timing
    from journal.features.workers.jobs.worker_watch import WorkerWatch
    from journal.features.workers.seeds.workers_seed import WorkersSeed
    from journal.features.workers.support.worker_runner import WorkerRunner
    from journal.models.worker import Worker
    from journal.repositories.messages import Messages
    from journal.repositories.scope import Scope
    from journal.repositories.workers import Workers
    workers, runner, scope = app.container.get(Workers), app.container.get(WorkerRunner), app.container.get(Scope)
    with scope.environment(1):
        active = workers.save(Worker(name="Mr. Babbage", brief="the parser", model="sonnet"), Actor.system())
        dropped = workers.save(Worker(name="Mr. Brunel", brief="the bridge", model="sonnet"), Actor.system())
    output, _ = runner.outputs(active)
    output.parent.mkdir(parents=True, exist_ok=True)
    done = tmp_path / "done"
    os.mkfifo(done)
    started = subprocess.run(["sh", "-c", f"({fifo_line(done)}; echo the parser is done) > '{output}' 2>&1 & echo $!"], capture_output=True, text=True, timeout=10)
    pid = int(started.stdout.strip())
    workers.save(active.running_as(pid, timing.time()), Actor.system())
    app.container.get(WorkersSeed).run()
    done.write_text("\n")
    end = timing.monotonic() + 3
    while runner.is_running(pid) and timing.monotonic() < end:
        timing.sleep(0.01)
    app.container.get(WorkerWatch).tick(timing.time())
    with scope.environment(1):
        texts = [m.text for m in app.container.get(Messages).scoped()]
    assert "Mr. Babbage reports: the parser is done" in "\n".join(texts), "a worker still running when the journal came back is watched until it ends, its report read from its file"
    assert any(t.startswith("Mr. Brunel reports: ") for t in texts) and not workers.find(dropped.id).is_running(), "a worker whose process ended while the journal was down is not left out"


def test_a_worker_the_restart_cut_off_is_started_again_in_its_session(app: App, monkeypatch):
    import json as j
    import subprocess
    import time as timing
    from journal.features.workers.jobs.worker_watch import REVIVE_BRIEF, WorkerWatch
    from journal.features.workers.seeds.workers_seed import WorkersSeed
    from journal.features.workers.support.worker_actions import WorkerActions
    from journal.features.workers.support.worker_runner import WorkerRunner
    from journal.models.worker import Worker
    from journal.repositories.scope import Scope
    from journal.repositories.workers import Workers
    workers, runner, scope = app.container.get(Workers), app.container.get(WorkerRunner), app.container.get(Scope)
    relaunched = []
    monkeypatch.setattr(WorkerActions, "relaunch", lambda self, worker, brief, dispatcher, actor, move, *rest, **named: relaunched.append((worker.id, brief)) or worker)
    from journal.models.worker_state import WorkerState
    with scope.environment(1):
        cut = workers.save(Worker(name="Ms. Hopper", brief="the compiler", model="sonnet"), Actor.system())
        clocked_in = workers.save(Worker(name="Mr. Babbage", brief="the engine", model="sonnet"), Actor.system())
        ended = workers.save(Worker(name="Mr. Turing", brief="the machine", model="sonnet"), Actor.system())
        workers.save(Worker(name="Ms. Lovelace", brief="the notes", model="sonnet"), Actor.system())
    gone = subprocess.Popen(["true"])
    gone.wait()
    for worker, events in ((cut, [{"type": "assistant"}]), (clocked_in, [{"type": "assistant"}]), (ended, [{"type": "assistant"}, {"type": "result", "subtype": "success", "result": "the machine runs"}])):
        output, _ = runner.outputs(worker)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text("\n".join(j.dumps(event) for event in events) + "\n")
        workers.save(worker.running_as(gone.pid, timing.time()), Actor.system())
    workers.save(workers.find(clocked_in.id).with_(state=WorkerState.READY), Actor.system())
    app.container.get(WorkersSeed).run()
    app.container.get(WorkerWatch).tick(timing.time())
    assert sorted(relaunched) == sorted([(cut.id, REVIVE_BRIEF), (clocked_in.id, REVIVE_BRIEF)]), "a run the restart cut off is started again in its own session, sent its job or clocked in on it; one that ended on its own, or never ran, is not"
    assert not workers.find(ended.id).is_running(), "a run that ended on its own has its end recorded as before"


def test_a_worker_past_its_time_limit_is_stopped_and_the_end_of_its_run_kept(app: App):
    from journal.features.workers.feature import Workers as WorkersFeature
    from journal.features.workers.support.worker_runner import WorkerRunner
    from journal.support.actor import Actor as A
    from journal.repositories.messages import Messages
    from journal.repositories.setting_rows import SettingRows
    from journal.repositories.workers import Workers
    hook(app, "SessionStart")
    dispatched(app.console(), ["Lady Lovelace", "say hello", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet"], AGENT)
    user_set(app, WorkersOptions.TIMEOUT.key, 0.005)
    worker = app.container.get(Workers).find(1)
    started_run(app.container.get(WorkerRunner), app.container.get(Workers), worker, ["sh", "-c", "echo half done; sleep 30"], A.agent("s1"))
    ended = app.container.get(Workers).find(1)
    assert ended.state == WorkerState.UNFINISHED and "stopped after" in ended.run_end and "half done" in ended.run_end, "stopped at its limit, it keeps what it printed as the end of its run, its task still held"


def test_a_commit_trailer_of_an_old_head_or_a_closed_task_closes_nothing(app: App, monkeypatch):
    import subprocess
    from journal.repositories.tasks import Tasks
    woken_capture(app, monkeypatch, [])
    root = app.config.root
    subprocess.run(["git", "init", "-q"], cwd=root, check=True)
    old = {"GIT_COMMITTER_DATE": "2020-01-01T00:00:00", "GIT_AUTHOR_DATE": "2020-01-01T00:00:00"}
    subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "Old\n\nJournal: tasks done 1 and 2 earlier"], cwd=root, check=True, env={**os.environ, **old})
    hook(app, "SessionStart")
    app.console().run(["task", "create", "footer", "--start"], AGENT)
    app.console().run(["task", "create", "margin"], AGENT)
    command = dict(tool_name="Bash", tool_input={"command": "git commit -m x"}, tool_response={"stdout": "", "stderr": ""})
    hook(app, "PostToolUse", **command)
    assert app.container.get(Tasks).find(1).state == "started", "the head was not made by this command"
    for line in (["task", "start", "2"], ["task", "start", "1"]):
        app.console().run(line, AGENT)
    subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "New\n\nJournal: tasks done 1 and 2 now"], cwd=root, check=True)
    hook(app, "PostToolUse", **command)
    assert app.container.get(Tasks).find(1).state == "completed" and app.container.get(Tasks).find(2).state == "started", "the trailer closes only the started task; the blocked one it names is not closed, and the agent takes it up again in auto mode once its wait on the closed one ends"


def test_a_commit_made_in_a_linked_worktree_closes_the_tasks_it_names_once(app: App):
    import subprocess
    from journal.repositories.tasks import Tasks
    root = app.config.root
    git = lambda *argv, cwd=root: subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", *argv], cwd=cwd, capture_output=True, text=True, timeout=30)
    git("init", "-q", "-b", "trunk")
    git("commit", "-q", "--allow-empty", "-m", "start")
    linked = root / ".claude" / "worktrees" / "main"
    git("worktree", "add", "-q", str(linked), "-b", "worktree-main")
    hook(app, "SessionStart")
    app.console().run(["task", "create", "the parser", "--start"], AGENT)
    git("commit", "-q", "--allow-empty", "-m", "the parser\n\nJournal: tasks done 1", cwd=linked)
    command = dict(tool_name="Bash", tool_input={"command": "git commit -m x"}, tool_response={"stdout": "", "stderr": ""})
    first = json.dumps(hook(app, "PostToolUse", **command)[1])
    assert app.container.get(Tasks).find(1).state == "completed", "a commit in the linked worktree closes the task its message names"
    again = json.dumps(hook(app, "PostToolUse", **command)[1])
    assert "closed task 1" in first and "closed task 1" not in again, "the same commit noticed twice closes it once"


def test_a_task_a_worker_holds_is_never_closed_by_a_hand_merge_or_a_trailer(app: App, monkeypatch):
    import subprocess
    from journal.features.workers.support.worker_runner import WorkerRunner
    from journal.repositories.tasks import Tasks
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, actor: None)
    root = app.config.root
    git = lambda *argv: subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", *argv], cwd=root, capture_output=True, text=True, timeout=30)
    git("init", "-q", "-b", "main")
    git("commit", "-q", "--allow-empty", "-m", "start")
    hook(app, "SessionStart")
    console = app.console()
    console.run(["task", "create", "the parser", "--brief", "the parser reads"], AGENT)
    console.run(["worker", "dispatch", "Lady Lovelace", "--task", "1", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet"], AGENT)
    git("commit", "-q", "--allow-empty", "-m", "the parser\n\nJournal: tasks done 1")
    answered = hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "git commit -m x"}, tool_response={"stdout": "", "stderr": ""})[1]
    assert app.container.get(Tasks).find(1).state != "completed" and nudge_reached(app, json.dumps(answered), GitNudges.WORKER_TASK_REFUSAL, task=1, worker=1), "a trailer leaves a worker's task open, naming the worker"
    git("checkout", "-q", "-b", "side")
    git("commit", "-q", "--allow-empty", "-m", "more of the parser\n\nJournal: tasks done 1")
    git("checkout", "-q", "main")
    git("merge", "-q", "--no-ff", "--no-edit", "side")
    answered = hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "git merge side"}, tool_response={"stdout": "", "stderr": ""})[1]
    assert app.container.get(Tasks).find(1).state != "completed" and "task 1 is worker 1's" in json.dumps(answered), "so does a hand merge of a branch whose commit names it"
    assert "check its proofs, then `journal worker merge 1`" in console.run(["task", "complete", "1", "--how", "by hand"], AGENT).error, "and the agent's own completion is refused"


def test_a_commit_whose_own_hook_was_lost_to_a_restart_closes_its_task_at_the_next_tool_use(app: App):
    import subprocess
    from journal.features.git.listeners.commit_detection import CommitDetection
    from journal.repositories.tasks import Tasks
    root = app.config.root
    git = lambda *argv: subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", *argv], cwd=root, capture_output=True, text=True, timeout=30)
    git("init", "-q", "-b", "main")
    git("commit", "-q", "--allow-empty", "-m", "start")
    hook(app, "SessionStart")
    app.console().run(["task", "create", "the parser", "--start"], AGENT)
    line = "git add -A && git commit -q -F - <<'EOF'\nthe parser\n\nJournal: tasks done 1\nEOF\ngit push -q; sh install.sh"
    hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": line})
    git("commit", "-q", "--allow-empty", "-m", "the parser\n\nJournal: tasks done 1")
    app.container.get(CommitDetection)._head_log_times.clear()
    hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "ls"}, tool_response={"stdout": "", "stderr": ""})
    assert app.container.get(Tasks).find(1).state == "completed", "the commit's own hook was lost and the journal restarted, so the next tool use finds it and closes its task"


def test_one_reader_draft_comes_at_a_marked_runs_real_end_naming_its_part_capped_never_for_a_plugin_alias_or_a_worker(app: App):
    """Task 3776: the six reader lines are one draft of the shell conduct, said when a run moved to the background ends (with the line naming the ended outputs, or the end of a watch), never while it runs; it names the part a reader would read, not the line, is filled from the run's own output, comes once per part, at most one per run and a few per session, and never for a plugin alias nor in a worker's session."""
    from journal.features.shell.support.output_log import OutputLog
    from journal.features.shell.support.reader_drafts import ReaderDrafts
    from journal.features.shell.shell_nudges import ShellNudges
    from journal.support.chain import Chain
    from journal.models.entry import Entry
    from journal.repositories.entries import Entries
    from journal.models.agent import Agent
    from journal.models.alias import Alias
    from journal.repositories.aliases import Aliases
    from journal.repositories.command_outputs import CommandOutputs
    from journal.support.agent_role import AgentRole
    hook(app, "SessionStart")
    outputs, drafts = app.container.get(CommandOutputs), app.container.get(ReaderDrafts)

    def background_run(name: str, line: str, text: str, ended: bool = True):
        folder = app.config.root / name
        folder.mkdir()
        (folder / "parts").write_text("R-\n" * len(Chain.parts(line)))
        for i, part in enumerate(Chain.parts(line)):
            (folder / f"{i}.part").write_text(part.text)
            (folder / f"{i}.out").write_text(text)
        app.container.get(OutputLog).start(name, line, folder, Caller.agent("main", "s1", "claude"))
        output = outputs.save(outputs.find(max(o.id for o in outputs.all())).backgrounded(), Actor.system())
        return outputs.save(output.ended_with(1, timing.time()), Actor.system()) if ended else output

    main = Agent(environment_id=MAIN, session="s1", role=AgentRole.MAIN)
    with app.container.get(Scope).environment(MAIN):
        running = background_run("running", "make all", "error: x\nbuilt in 1s\n", ended=False)
        assert not [draft for draft in drafts.drafts(main) if draft.output == running.id], "nothing is offered while the run still runs"
        built = background_run("built", "cd web && make all", "compiling\nerror: missing header\nbuilt in 3.1s\n")
        [draft] = [draft for draft in drafts.drafts(main) if draft.output == built.id]
        assert draft.part == "make all" and "cd web" not in draft.command and "--commands \"make all\"" in draft.command and "--label 'Building'" in draft.command, "it names the part a reader would read, filled from the run's own output"
        assert drafts.drafts(Agent(environment_id=MAIN, session="w1", role=AgentRole.WORKER)) == (), "a worker's session is offered none"
        app.container.get(Aliases).save(Alias(name="judge", line="vendor/bin/judge {args}", plugin="commandments"), Actor.system())
        plugin = background_run("plugin", "vendor/bin/judge --changes", "error: one sin\n3 sins in 2.0s\n")
        assert not [draft for draft in drafts.drafts(main) if draft.output == plugin.id], "a run a plugin's alias runs is never offered a reader"
    from journal.engine.nudger import Nudger
    from journal.repositories.reader_suggestions import ReaderSuggestions
    nudger, suggestions = app.container.get(Nudger), app.container.get(ReaderSuggestions)
    assert nudger.deliver(app.container.get(SessionAgents).agent("s1", MAIN), ShellNudges.READER_DRAFT.create(part="make all", command=draft.command))
    app.runtime().deferred.drain()
    assert set(suggestions.suggestion_times()) == {"make all"}, "a suggestion said is recorded for the project by its part"
    with app.container.get(Scope).environment(MAIN):
        [again] = [draft for draft in drafts.drafts(main) if draft.output == built.id]
        assert again.suggested and again.later_runs == 0 and not again.is_suggestible(50) and not again.is_suggestible(0), "a part told before is not due until its runs since reach the repeat"
        app.container.get(Entries).save(Entry(environment_id=MAIN, entry_type="nudge", actor=Actor.agent("s1"), data={"session": "s1", "key": "shell.make_its_reader", "values": {"command": "job.sh"}, "line": "no reader reads job.sh yet", "time": 10.0}), Actor.system())
        assert drafts.suggestion_times()["job.sh"] == 10.0, "a part told by a line the one draft replaced counts as told"
    assert app.console().run(["reader", "add", "make-builds", "--commands", "make all", "--pattern", "error|built in", "--finished", "built in", "--about", "the builds", "--label", "Building the project"], AGENT).code == 0
    app.runtime().deferred.drain()
    assert "make all" not in suggestions.suggestion_times(), "a reader added that reads the part takes its suggestion away"


def test_a_sequence_ported_from_version_3_is_written_at_boot(app: App):
    from journal.repositories.sequences import Sequences
    sorting = next(s for s in app.container.get(Sequences).all() if s.title == "Filing a document that is already written")
    assert [trigger.line() for trigger in sorting.triggers] == ["row:doc.created"] and len(sorting.steps) == 2


def version_3_row(folder, type_name: str, n: int, brief: str = "", **header) -> None:
    """A version 3 row file: its JSON header between --- lines, then its brief."""
    folder.mkdir(parents=True, exist_ok=True)
    head = {"n": n, "type": type_name, "title": "", "refs": [], "seen": ["user"], "created": 1.0, "updated": 1.0, "deleted": 0.0, "completed": 0.0, "outcome": "", "data": {}, **header}
    (folder / f"{n:03d}.md").write_text(f"---\n{json.dumps(head, indent=2)}\n---\n{brief}\n")


def test_only_the_version_3_environments_still_in_use_are_brought_across_and_never_twice(app: App):
    from journal.features.migration.support.migrator import Migrator
    from journal.repositories.environments import Environments
    from journal.repositories.reports import Reports
    stored = app.config.home / "version-3"
    for n, name, type_name in ((1, "main", "main"), (2, "ticket-8", "ticket"), (3, "ticket-9", "ticket"), (4, "1012-inventory-page", "worktree")):
        version_3_row(stored / "project" / "environment", "environment", n, title=name, data={"kind": type_name})
    version_3_row(stored / "environments" / "ticket-8" / "todo", "todo", 1, "still open")
    version_3_row(stored / "environments" / "ticket-9" / "todo", "todo", 1, "long done", completed=2.0)
    (stored.parents[1] / ".claude" / "worktrees" / "1012-inventory-page").mkdir(parents=True)
    migrator = app.container.get(Migrator)
    for _ in range(2):
        with app.container.get(Scope).environment(MAIN):
            migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
    names = {e.name for e in app.container.get(Environments).rows()}
    assert {"main", "ticket-8", "1012-inventory-page"} <= names and "ticket-9" not in names, "main, the one with open work and the one whose worktree is still on disk, not the finished one"
    with app.container.get(Scope).environment(MAIN):
        body = app.container.get(Reports).all()[-1].body
    assert "| environments | 0 | 1 |" in body and "environment ticket-9: not in use" in body, "the second run brings nothing twice and says what stayed"


def test_every_version_3_message_comes_across_with_its_author_time_reply_and_attachment(app: App):
    import zipfile
    from journal.features.migration.support.migrator import Migrator
    from journal.repositories.messages import Messages
    stored = app.config.home / "version-3"
    version_3_row(stored / "project" / "environment", "environment", 1, title="main", data={"kind": "main"})
    messages = stored / "environments" / "main" / "message"
    version_3_row(messages, "message", 1, "an old one", created=1700000000.0, completed=1700000100.0)
    (messages / "001.md").rename(messages / "old.md")
    (messages / "packed").mkdir()
    with zipfile.ZipFile(messages / "packed" / "2023-11-14.zip", "w") as packed:
        packed.write(messages / "old.md", "001.md")
    (messages / "old.md").unlink()
    version_3_row(messages, "message", 2, "the answer", seen=["agent", "user"], refs=["message:1"], created=1700000200.0, updated=1700000250.0)
    version_3_row(messages, "message", 3, "a picture", created=1700000300.0)
    (messages / "3").mkdir()
    (messages / "3" / "shot.png").write_bytes(b"png")
    version_3_row(messages, "message", 4, "gone", deleted=5.0)
    migrator = app.container.get(Migrator)
    with app.container.get(Scope).environment(MAIN):
        migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
        imported = [m for m in app.container.get(Messages).rows() if m.text in ("an old one", "the answer", "a picture", "gone")]
    assert [m.text for m in imported] == ["an old one", "the answer", "a picture"], "the packed one too, in order, the deleted one left behind"
    old, answer, picture = imported
    assert old.created_at.timestamp() == 1700000000.0 and old.read_at is not None, "its own time, and read"
    assert answer.author == "agent" and answer.reply_target == old.id, "the reply still points at what it answers"
    assert answer.read_at.timestamp() == 1700000250.0 and picture.read_at is None, "read when the other side saw it, so the viewer has nothing to mark read"
    assert picture.files == ("shot.png",) and (app.config.files / "message" / str(picture.id) / "shot.png").read_bytes() == b"png"


def test_the_mcp_list_answers_at_once_and_asks_the_program_on_a_thread_of_its_own(app: App, monkeypatch):
    import time as timing
    from journal.features.mcp.support.health import Health
    from journal.features.mcp.support.health_report import HealthReport
    from journal.features.mcp.support.server_catalogue import ServerCatalogue
    requested = []
    def slow(self):
        requested.append(1)
        timing.sleep(0.5)
        return HealthReport({"github": ServerCatalogue("github", "npx", "connected", "")})
    monkeypatch.setattr(Health, "probe", slow)
    health = app.container.get(Health)
    began = timing.time()
    assert health.report().servers == {} and health.report().servers == {} and timing.time() - began < 0.2, "no request waits on the program"
    for _ in range(20):
        if health.report().servers:
            break
        timing.sleep(0.1)
    assert list(health.report().servers) == ["github"] and requested == [1], "asked once, in the background, and the next request has it"


def test_version_3_comments_and_reactions_come_across_on_their_rows(app: App):
    from journal.features.migration.support.migrator import Migrator
    from journal.models.support.ref import Ref
    from journal.repositories.links import Links
    from journal.repositories.messages import Messages
    from journal.repositories.reactions import Reactions
    stored = app.config.home / "version-3"
    version_3_row(stored / "project" / "environment", "environment", 1, title="main", data={"kind": "main"})
    main = stored / "environments" / "main"
    version_3_row(main / "message", "message", 1, "ship it")
    version_3_row(main / "comment", "comment", 1, "> ship it\n\nnot yet", refs=["message:1"])
    version_3_row(main / "comment", "comment", 2, "on a task that stayed", refs=["todo:5"])
    version_3_row(main / "reaction", "reaction", 1, "", refs=["message:1"], data={"face": "🎉"})
    migrator = app.container.get(Migrator)
    with app.container.get(Scope).environment(MAIN):
        migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
        messages = app.container.get(Messages)
        shipped = next(m for m in messages.rows() if m.text == "ship it")
        comment = next(m for m in messages.rows() if m.text.endswith("not yet"))
        links = app.container.get(Links)
        assert links.targets(comment, Messages.COMMENT_LINK) == [Ref.build(shipped)], "the comment sits under its message"
        reaction = app.container.get(Reactions).rows()[-1]
        assert reaction.emoji == "🎉" and links.targets(reaction, "reacts") == [Ref.build(shipped)]
        assert not any(m.text == "on a task that stayed" for m in messages.rows()), "a comment whose row stayed behind stays too"


def test_version_3_todos_become_tasks_in_their_states_with_their_work_logs(app: App):
    from journal.features.migration.support.migrator import Migrator
    from journal.repositories.task_logs import TaskLogs
    from journal.repositories.tasks import Tasks
    stored = app.config.home / "version-3"
    version_3_row(stored / "project" / "environment", "environment", 1, title="main", data={"kind": "main"})
    todo = stored / "environments" / "main" / "todo"
    version_3_row(todo, "todo", 1, "the brief", title="done one", completed=2.0, outcome="it shipped")
    version_3_row(todo, "todo", 2, "", title="in progress", data={"status": "started"})
    version_3_row(todo, "todo", 3, "", title="waiting", data={"blocked": "the vendor's answer"})
    version_3_row(todo, "todo", 4, "", title="still open")
    version_3_row(todo, "todo", 5, "", title="struck", data={"struck": True})
    work = stored / "environments" / "main" / "work" / "001.md"
    version_3_row(work.parent, "work", 1, "", refs=["todo:1"], data={"todo": 1})
    work.write_text(work.read_text() + "## 1 · 2026-10-11 18:10 UTC\nbuilt it\n## 2 · 2026-10-11 19:00 UTC\ntested it\n")
    migrator = app.container.get(Migrator)
    with app.container.get(Scope).environment(MAIN):
        migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
        tasks = {t.title: t for t in app.container.get(Tasks).rows()}
        assert tasks["done one"].state == "completed" and tasks["done one"].outcome == "it shipped" and tasks["done one"].brief == "the brief"
        assert tasks["in progress"].state == "blocked" and tasks["waiting"].state == "blocked" and tasks["waiting"].block_reason == "the vendor's answer"
        assert tasks["still open"].state == "open" and "struck" not in tasks, "a struck to-do stays behind"
        assert [log.line for log in app.container.get(TaskLogs).rows() if log.task_id == tasks["done one"].id] == ["built it", "tested it"]


def test_version_3_plans_keep_their_state_phases_and_tasks_and_questions_their_answers(app: App):
    from journal.features.migration.support.migrator import Migrator
    from journal.repositories.plans import Plans
    from journal.repositories.questions import Questions
    stored = app.config.home / "version-3"
    version_3_row(stored / "project" / "environment", "environment", 1, title="main", data={"kind": "main"})
    main = stored / "environments" / "main"
    version_3_row(main / "todo", "todo", 7, "", title="first step")
    version_3_row(main / "plan", "plan", 1, "the goal", title="the plan", data={"status": "approved", "phases": [{"title": "one", "when": "it works", "checkpoint": True, "todos": [7]}]})
    version_3_row(main / "question", "question", 1, "", title="which one?", data={"options": [{"title": "a"}, {"title": "b"}]}, completed=3.0, outcome="b")
    version_3_row(main / "question", "question", 2, "", title="still open?")
    migrator = app.container.get(Migrator)
    with app.container.get(Scope).environment(MAIN):
        migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
        plans = app.container.get(Plans)
        plan = next(p for p in plans.rows() if p.title == "the plan")
        phases = plans.plan_phases(plan)
        assert plan.state == "approved" and plan.brief == "the goal", "an approval stays an approval"
        assert [(p.title, p.completion_rule, p.checkpoint) for p in phases] == [("one", "it works", True)]
        assert [t.title for t in plans.plan_tasks(plan)] == ["first step"] and [t.title for t in plans.phase_tasks(phases[0])] == ["first step"]
        questions = {q.text: q for q in app.container.get(Questions).rows()}
        assert questions["which one?"].options == ("a", "b") and questions["which one?"].answer == "b" and questions["still open?"].answer is None


def test_version_3_facts_rules_reminders_documents_and_reports_come_across_and_struck_ones_stay(app: App):
    from journal.features.migration.support.migrator import Migrator
    from journal.repositories.docs import Docs
    from journal.repositories.memories import Memories
    from journal.repositories.reminders import Reminders
    from journal.repositories.reports import Reports
    from journal.repositories.rules import Rules
    stored = app.config.home / "version-3"
    version_3_row(stored / "project" / "environment", "environment", 1, title="main", data={"kind": "main"})
    main = stored / "environments" / "main"
    version_3_row(main / "fact", "fact", 1, "the port is 8420", data={"keywords": ["port"]})
    version_3_row(main / "fact", "fact", 2, "an old truth", completed=2.0)
    version_3_row(main / "reminder", "reminder", 1, "say you")
    version_3_row(main / "report", "report", 1, "what we found", title="the audit", abstract="one line")
    version_3_row(stored / "project" / "rule", "rule", 1, "Always plain English")
    doc = stored / "project" / "doc" / "001"
    version_3_row(doc, "doc", 1, "the intro", title="the guide", abstract="how it works")
    (doc / "001.md").rename(doc / "doc.md")
    (doc / "doc.md").write_text((doc / "doc.md").read_text() + "## Setup\nrun it\n")
    migrator = app.container.get(Migrator)
    with app.container.get(Scope).environment(MAIN):
        migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
        memories = [(m.text, m.keywords, m.weight) for m in app.container.get(Memories).rows()]
        assert ("the port is 8420", ("port",), 5) in memories and not any(text == "an old truth" for text, _, _ in memories), "a version 3 fact becomes a memory of weight 5, and a struck one stays behind"
        assert any(r.text == "say you" for r in app.container.get(Reminders).rows())
        assert any(r.title == "the audit" and r.body == "what we found" for r in app.container.get(Reports).rows())
    assert any(r.text == "Always plain English" for r in app.container.get(Rules).rows())
    guide = next(d for d in app.container.get(Docs).rows() if d.title == "the guide")
    assert guide.abstract == "how it works" and guide.body == "the intro\n\n## Setup\n\nrun it"


def test_version_3_checks_triggers_sequences_templates_and_settings_come_across_where_they_fit(app: App):
    from journal.features.migration.support.migrator import Migrator
    from journal.repositories.checks import Checks
    from journal.repositories.sequences import Sequences
    from journal.repositories.setting_rows import SettingRows
    from journal.repositories.templates import Templates
    from journal.repositories.triggers import Triggers
    stored = app.config.home / "version-3"
    project = stored / "project"
    version_3_row(project / "check", "check", 1, "the suite passes", title="tests", data={"command": "pytest -q", "every": 30})
    version_3_row(project / "trigger", "trigger", 1, "", data={"words": ["deploy"], "does": "instruct", "text": "read the deploy notes"})
    version_3_row(project / "trigger", "trigger", 2, "", data={"words": ["hold"], "does": "hold", "text": "x"})
    sequence = project / "sequence" / "001.md"
    version_3_row(sequence.parent, "sequence", 1, "", title="Releasing", data={"starts_on": ""})
    sequence.write_text(sequence.read_text() + "## Tag it\n\n## Push it\nwith the tags\n")
    version_3_row(project / "sequence", "sequence", 2, "", title="Shipped one", data={"system": True})
    version_3_row(project / "template", "template", 1, "write it plainly", title="Report", data={"applies_to": ["report"], "purpose": "critique"})
    (stored / "settings.json").write_text(json.dumps({"features": {"checks": False, "boards": True}}))
    migrator = app.container.get(Migrator)
    with app.container.get(Scope).environment(MAIN):
        migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
    check = next(c for c in app.container.get(Checks).rows() if c.title == "tests")
    assert check.command == "pytest -q" and check.interval == 30
    assert [(t.phrases, t.action, t.text) for t in app.container.get(Triggers).rows() if "deploy" in t.phrases] == [(("deploy",), "instruct", "read the deploy notes")]
    assert not any("hold" in t.text for t in app.container.get(Triggers).rows()), "a trigger version 4 cannot do stays behind"
    titles = {s.title: s for s in app.container.get(Sequences).rows()}
    assert [(step.title, step.instructions) for step in titles["Releasing"].steps] == [("Tag it", "Tag it"), ("Push it", "with the tags")] and "Shipped one" not in titles, "version 3's shipped sequences stay behind"
    assert any(t.title == "Report" and t.purpose == "critique" for t in app.container.get(Templates).rows())
    assert app.container.get(SettingRows).project("features.checks") is False and app.container.get(SettingRows).project("features.boards") is None, "only a feature version 4 has"


def test_a_small_version_3_journal_comes_across_counted_kind_by_kind_and_a_second_run_brings_nothing(app: App):
    from journal.features.migration.support.migrator import Migrator
    from journal.repositories.reports import Reports
    stored = app.config.home / "version-3"
    version_3_row(stored / "project" / "environment", "environment", 1, title="main", data={"kind": "main"})
    main = stored / "environments" / "main"
    for n in (1, 2):
        version_3_row(main / "message", "message", n, f"message {n}")
        version_3_row(main / "todo", "todo", n, "", title=f"task {n}")
    version_3_row(main / "comment", "comment", 1, "a comment", refs=["message:1"])
    version_3_row(main / "reaction", "reaction", 1, "", refs=["message:2"], data={"face": "👍"})
    version_3_row(main / "fact", "fact", 1, "a fact")
    version_3_row(stored / "project" / "rule", "rule", 1, "Always a rule")
    version_3_row(stored / "project" / "secret", "secret", 1, "how it is used", title="github", data={"kind": "api key", "secret_fields": [{"name": "key", "hidden": True, "variable": "GITHUB_TOKEN"}]})
    version_3_row(main / "agent", "agent", 1, "", data={"provider": "claude", "transcript": "/x/abc.jsonl"})
    migrator = app.container.get(Migrator)
    for _ in range(2):
        with app.container.get(Scope).environment(MAIN):
            migrator.run(migrator.begin(Actor.user(1)), Actor.user(1))
    with app.container.get(Scope).environment(MAIN):
        first, second = [r.body for r in app.container.get(Reports).all() if r.title == "The version 3 journal brought across"]
    for line in ("| environments | 1 |", "| messages | 2 |", "| tasks | 2 |", "| comments | 1 |", "| reactions | 1 |", "| facts | 1 |", "| rules | 1 |", "| secrets | 1 |", "| agents | 1 |"):
        assert line in first, line
    assert "| messages | 0 |" in second and "| tasks | 0 |" in second and "| secrets | 0 |" in second, "a second run brings nothing twice"


def test_a_version_3_row_that_cannot_come_across_is_reported_and_the_migration_goes_on(app: App):
    from journal.features.migration.support.migrator import Migrator
    from journal.repositories.messages import Messages
    from journal.repositories.reports import Reports
    stored = app.config.home / "version-3"
    version_3_row(stored / "project" / "environment", "environment", 1, title="main", data={"kind": "main"})
    version_3_row(stored / "environments" / "main" / "message", "message", 1, "broken", seen=["nobody"])
    version_3_row(stored / "environments" / "main" / "message", "message", 2, "fine")
    migrator = app.container.get(Migrator)
    with app.container.get(Scope).environment(MAIN):
        assert migrator.run(migrator.begin(Actor.user(1)), Actor.user(1)).state == "done", "nothing stops the run"
        texts = [m.text for m in app.container.get(Messages).rows()]
        body = app.container.get(Reports).all()[-1].body
    assert "fine" in texts and "broken" not in texts
    assert "message 1 in main: could not be brought:" in body, "the row is named with its error"


def test_an_update_never_overwrites_a_setting_the_user_set(app: App):
    from journal.app import App
    from journal.config import Config
    settings = app.container.get(SettingRows)
    settings.save(Setting(environment_id=0, key="shell.command_characters", value=500), Actor.user(1))
    settings.save(Setting(environment_id=0, key="tasks.auto", value=False), Actor.user(1))
    updated = main_journal(Config(app.config.root, port=0))
    updated.runtime().boot()
    stored = updated.container.get(SettingRows)
    assert stored.project("shell.command_characters") == 500 and stored.project("tasks.auto") is False, "booting the new code, as an update does, keeps what the user set"


def test_a_job_on_files_a_worker_already_worked_on_goes_back_to_that_worker(app: App):
    from journal.repositories.workers import Workers
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    dispatched(console, ["Lady Lovelace", "fix the chain", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet"], AGENT)
    workers = app.container.get(Workers)
    with app.container.get(Scope).environment(MAIN):
        workers.save(workers.find(1).with_(resume="abc", touched_paths=("src/journal/features/shell/chain.py",)).reported(0.0, 0), Actor.system())
    dispatch = lambda line: hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": f"journal worker dispatch {line} --profile journal-medior --model sonnet"})
    status, body = dispatch("'Mr. Babbage' 'test src/journal/features/shell/chain.py'")
    assert status != 200 and "worker 1, Lady Lovelace, last on src/journal/features/shell/chain.py: `journal worker send 1" in json.dumps(body), "related work goes back to the worker that touched its files"
    assert dispatch("'Mr. Babbage' 'test src/journal/features/shell/chain.py' --fresh")[0] == 200, "unless a fresh one is asked for"
    assert dispatch("'Mr. Bell' 'write docs/other.md'")[0] == 200, "other files, another worker"


class Source:
    def __init__(self, *tags: str, head: str = "") -> None:
        self.tags_asked = []
        self.rows = list(tags)
        self.plugin_found = []
        self.head = head
        self.branches_asked = []

    def head_commit(self, address: str, branch: str) -> str:
        self.branches_asked.append((address, branch))
        return self.head

    def release_tags(self, address: str) -> list[str]:
        return self.plugin_found

    def tags(self, prefix: str) -> list[str]:
        self.tags_asked.append(prefix)
        return self.rows


class Plugins:
    def __init__(self) -> None:
        self.upgraded = []

    def upgrade(self, name: str, ref: str, environment: str, actor: Actor) -> None:
        self.upgraded.append((name, ref))


class Installer:
    def __init__(self) -> None:
        self.ran = []

    def run(self, ref: str, repository: str, reason: str) -> None:
        self.ran.append(ref)


def updating_with(app, source: Source, installer: Installer, auto: bool) -> Updater:
    user_set(app, "updates.auto", auto)
    updating = app.container.get(Updater)
    updating.source, updating.installer = source, installer
    return updating


def test_an_update_a_person_asks_for_reads_the_releases_anew_first(app: App, monkeypatch):
    from journal.features.updates.support.updater import Updater
    source, installer = Source("v4.0.0"), Installer()
    updating = updating_with(app, source, installer, auto=False)
    monkeypatch.setattr(Updater, "restart", lambda self: None)
    updating.read()
    source.rows.append("v4.99.0")
    updating.install(Actor.user(1))
    assert installer.ran == ["v4.99.0"], "a release published since the last read is the one installed, never 'nothing newer'"


def test_an_update_whose_installer_fails_for_whatever_reason_runs_the_official_install_command_instead(app: App, monkeypatch):
    from journal.features.updates.support.updater import Updater
    from journal.features.updates.support.official_install import OfficialInstall
    from types import SimpleNamespace

    class Broken(Installer):
        def run(self, ref: str, repository: str, reason: str) -> None:
            raise TypeError("ReleaseInstaller.run() missing 1 required positional argument: 'reason'")

    official = []
    monkeypatch.setattr(OfficialInstall, "installation", lambda self, ref: official.append(ref) or SimpleNamespace(returncode=0, stdout="", stderr=""))
    monkeypatch.setattr(Updater, "restart", lambda self: None)
    updating = updating_with(app, Source("v4.0.0", "v4.99.0"), Broken(), auto=False)
    updating.read()
    updating.install(Actor.user(1))
    assert official == ["v4.99.0"] and updating.problem == "", "a broken installer falls back to the README's official install command for the same release, and the update goes on"


def test_an_update_runs_the_real_installer_end_to_end_with_only_the_download_and_the_shell_stood_in(app: App, monkeypatch):
    import io
    from types import SimpleNamespace
    from journal.features.updates.support import release_installer
    from journal.features.updates.support.release_installer import ReleaseInstaller
    from journal.features.updates.support.updater import Updater
    fetched, ran = [], []
    monkeypatch.setattr(release_installer, "urlopen", lambda address, timeout: fetched.append(address) or io.BytesIO(b"echo installed\n"))
    restarted = []
    monkeypatch.setattr(release_installer.subprocess, "Popen", lambda command, **options: ran.append((command[0], options["env"]["AGENT_JOURNAL_REF"], options["start_new_session"])))
    monkeypatch.setattr(Updater, "restart", lambda self: restarted.append(True))
    updating = updating_with(app, Source("v4.0.0", "v4.99.0"), app.container.get(ReleaseInstaller), auto=False)
    updating.read()
    updating.install(Actor.user(1))
    assert fetched == ["https://raw.githubusercontent.com/jessegall/agent-journal/v4.99.0/install.sh"] and ran == [("sh", "v4.99.0", True)] and updating.problem == "", "the updater fetches the new release's install script and starts it as a process of its own, detached so it outlives this journal (messages 71323, 71356)"
    assert restarted == [], "the old instance restarts nothing itself: the new release's script installs and restarts the journal, so no old code runs a step of the update"
    app.container.get(ReleaseInstaller).run("v4.99.0", "https://github.com/jessegall/agent-journal")
    assert ran[-1] == ("sh", "v4.99.0", True) and (app.config.home / "runtime" / "update.log").read_text().startswith("installing v4.99.0 of https://github.com/jessegall/agent-journal: updating to the latest release"), "an updater from before 24 October, which passes the ref and the repository alone, still runs the new installer (message 67664)"
    monkeypatch.setattr(release_installer.subprocess, "Popen", lambda command, **options: (_ for _ in ()).throw(OSError("no shell")))
    monkeypatch.setattr("journal.features.updates.support.official_install.OfficialInstall.installation", lambda self, ref: SimpleNamespace(returncode=1, stdout="", stderr="offline"))
    updating.card.clear()
    source = updating.source
    source.rows.append("v4.100.0")
    updating.read()
    updating.install_newest(Actor.user(1))
    assert updating.card.paused() is None and "nor could the official install command" in updating.problem, "an install that fails, the official command too, leaves no marker a launch would wait on, and says why"


def test_releases_compare_by_number_and_pre_releases_are_left_out():
    matched = Release.lookup(["v4.10.0", "v4.9.2", "v4.1.0-rc1", "nightly", "v4.9.10"])
    assert [release.version for release in matched] == ["4.9.2", "4.9.10", "4.10.0"]
    assert Release("v4.0.1").upgrades(Release("4.0.0")) and not Release("4.0.0").upgrades(Release("v4.0.0"))


def test_an_update_never_crosses_a_major_version(app: App):
    updating = app.container.get(Updater)
    updating.releases = Release.lookup(["v3.9.0", "v4.0.0", "v4.99.0", "v5.0.0"])
    assert [release.tag for release in updating.newer()] == ["v4.99.0"]
    updating.releases = Release.lookup(["v5.0.0"])
    assert updating.newer() == [] and not updating.data().newer


def test_a_newer_release_is_installed_on_its_own_only_when_the_setting_is_on(app: App):
    source, installer = Source("v4.0.0", "v4.1.0", "v4.99.0", "v5.0.0"), Installer()
    off = updating_with(app, source, installer, auto=False)
    off.checked()
    assert installer.ran == [] and off.data().latest == "4.99.0" and source.tags_asked == ["v4."]
    enabled = updating_with(app, source, installer, auto=True)
    enabled.checked()
    assert installer.ran == ["v4.99.0"] and enabled.problem == ""


def test_the_updater_asks_for_a_new_release_as_often_as_the_setting_says(app: App):
    source = Source("v4.0.0")
    updating = updating_with(app, source, Installer(), auto=False)
    user_set(app, "updates.check_minutes", 5)
    first = timing.time() + 60
    for time, asked in ((first, 1), (first + 299, 1), (first + 300, 2)):
        updating.tick(time)
        ending = timing.time() + 30
        while (len(source.tags_asked) < asked or updating._working.locked()) and timing.time() < ending:
            timing.sleep(0.01)
        assert len(source.tags_asked) == asked, f"at {time - first:.0f} seconds the releases were asked {len(source.tags_asked)} times, not {asked}"


def test_nothing_is_installed_on_its_own_when_no_release_is_newer(app: App):
    installer = Installer()
    updating_with(app, Source("v4.0.0", "v5.0.0"), installer, auto=True).checked()
    assert installer.ran == []


def test_a_workers_clean_up_never_drops_a_launch_worktree_or_its_branch(app: App):
    import subprocess
    from journal.features.workers.support.worker_branch import WorkerBranch
    from journal.models.worker import Worker
    from journal.support.worktree import Worktree
    root = app.config.root
    git = lambda *argv: subprocess.run(["git", *argv], cwd=root, capture_output=True, text=True, timeout=30)
    for argv in (["init", "-q", "-b", "main"], ["-c", "user.email=t@example.com", "-c", "user.name=T", "commit", "-q", "--allow-empty", "-m", "start"]):
        git(*argv)
    calm, quiet = Worktree(root, "calm-river").created(), Worktree(root, "quiet-heron").created()
    branch = app.container.get(WorkerBranch)
    assert not branch.name(Worker(name="worktree-calm-river")).startswith("worktree-"), "a worker's branch is never named like a launch worktree's"
    away = calm.with_name("calm-river.away")
    calm.rename(away)
    branch.worktree_list_pruned(root)
    away.rename(calm)
    listed = git("worktree", "list", "--porcelain").stdout
    assert f"worktree {calm.resolve()}" in listed and f"worktree {quiet.resolve()}" in listed, "a launch worktree briefly away is never pruned from git's list by a worker's clean-up"
    branch.pruned("worker/9-Someone", [root])
    assert {"worktree-calm-river", "worktree-quiet-heron"} <= {line.strip(" *+") for line in git("branch").stdout.splitlines()}, "and a worker's branch delete takes only its own branch"


def test_a_failed_worktree_add_leaves_another_launch_worktree_registered_and_moves_nothing_aside(app: App):
    import subprocess
    from journal.support.worktree import Worktree
    from journal.support.worktree_failure import WorktreeFailure
    root = app.config.root
    git = lambda *argv: subprocess.run(["git", *argv], cwd=root, capture_output=True, text=True, timeout=30)
    for argv in (["init", "-q", "-b", "main"], ["-c", "user.email=t@example.com", "-c", "user.name=T", "commit", "-q", "--allow-empty", "-m", "start"]):
        git(*argv)
    calm = Worktree(root, "calm-river").created()
    away = calm.with_name("calm-river.away")
    calm.rename(away)
    git("branch", "worktree-taken")
    git("worktree", "add", str(root / "elsewhere"), "worktree-taken")
    try:
        Worktree(root, "taken").created()
        raise AssertionError("a start whose branch is checked out elsewhere fails")
    except WorktreeFailure:
        pass
    away.rename(calm)
    assert f"worktree {calm.resolve()}" in git("worktree", "list", "--porcelain").stdout, "the failed add pruned nothing: the launch worktree briefly away is still registered"
    assert not [path for path in calm.parent.iterdir() if "moved-aside" in path.name] and not (calm.parent / "taken").exists(), "and nothing was moved aside or left behind"
    (calm.parent / "calm-river").rename(away)
    assert Worktree(root, "calm-river").created() == calm and calm.is_dir(), "a launch whose own folder is gone drops only its own record and makes it again"


def test_a_worktree_whose_environment_is_gone_is_listed_and_removed_through_the_same_checks(app: App, monkeypatch):
    import subprocess
    from journal.repositories.environments import Environments
    from journal.support.worktree import Worktree
    root = app.config.root
    git = lambda *argv: subprocess.run(["git", *argv], cwd=root, capture_output=True, text=True, timeout=30)
    for argv in (["init", "-q", "-b", "main"], ["-c", "user.email=t@example.com", "-c", "user.name=T", "commit", "-q", "--allow-empty", "-m", "start"]):
        git(*argv)
    console = app.console()
    for name in ("calm-river", "quiet-heron"):
        Worktree(root, name).created()
        console.run(["environment", "create", name], USER)
    environment = app.container.get(Environments).existing("calm-river")
    assert posted(app, f"/journal/environments/{environment.row_id}/remove", {}, {"X-Journal-Env": "main"})[0] == 200
    listed = console.run(["worktree", "list"], USER).text
    assert "calm-river: on worktree-calm-river; its environment is gone" in listed and "quiet-heron: on worktree-quiet-heron\n" in listed, listed
    status, answer = get_answer(app, "/journal/worktrees", {"X-Journal-Env": "main"})
    assert status == 200 and answer["worktrees"] == [{"name": "calm-river", "branch": "worktree-calm-river"}], "the viewer lists the worktree whose environment is gone, and no other"
    status, removed = posted(app, "/journal/worktrees/calm-river/removal", {}, {"X-Journal-Env": "main"})
    assert status == 200 and "removed the worktree" in removed["line"] and not (root / ".claude" / "worktrees" / "calm-river").exists(), "and removes it through the same checks"


def test_a_worktree_made_through_a_symlinked_project_path_is_the_same_one_by_either_spelling(app: App, tmp_path):
    import subprocess
    from journal.support.worktree import Worktree
    root = app.config.root
    git = lambda *argv: subprocess.run(["git", *argv], cwd=root, capture_output=True, text=True, timeout=30)
    for argv in (["init", "-q", "-b", "main"], ["-c", "user.email=t@example.com", "-c", "user.name=T", "commit", "-q", "--allow-empty", "-m", "start"]):
        git(*argv)
    linked = tmp_path / "linked-project"
    linked.symlink_to(root)
    through_link = Worktree(linked, "calm-river").created()
    direct = Worktree(root, "calm-river").created()
    assert through_link.resolve() == direct.resolve() and Worktree(root, "calm-river").is_registered() and Worktree(linked, "calm-river").is_registered(), "one folder, registered, whichever spelling of the project's path made or found it"
    assert [path.name for path in (root / ".claude" / "worktrees").iterdir() if path.is_dir()] == ["calm-river"], "and no second folder or moved-aside sibling beside it"


def test_a_journal_standing_by_serves_the_moment_the_one_holding_the_project_is_gone(app: App, tmp_path):
    import threading
    import time
    from journal.config import Config
    from journal.support.instance_guard import InstanceGuard
    first, second = InstanceGuard(app.config), InstanceGuard(Config.rooted(app.config.root))
    assert first.claimed() and not second.claimed(), "one journal holds the project; a second launch's stands by"
    served = threading.Event()
    waiting = threading.Thread(target=lambda: (second.blocking_claim(), served.set()), daemon=True)
    waiting.start()
    assert not served.wait(0.3), "it waits while the first holds the project"
    ended_at = time.monotonic()
    first.lock_file.close()
    assert served.wait(1.0) and time.monotonic() - ended_at < 0.5, "and holds it the moment the first is gone, well under a second, not after any retry limit"
    linked = tmp_path / "linked"
    linked.symlink_to(app.config.root)
    assert Config.rooted(linked).home.resolve() == app.config.home.resolve(), "a journal reached through another spelling of its path is the same journal"


def test_hooks_from_two_worktrees_at_once_each_land_in_their_own_environment(app: App):
    import subprocess
    import threading
    from journal.repositories.agents import Agents
    from journal.repositories.environments import Environments
    from journal.support.worktree import Worktree
    root = app.config.root
    git = lambda *argv: subprocess.run(["git", *argv], cwd=root, capture_output=True, text=True, timeout=30)
    for argv in (["init", "-q", "-b", "main"], ["-c", "user.email=t@example.com", "-c", "user.name=T", "commit", "-q", "--allow-empty", "-m", "start"]):
        git(*argv)
    launches = app.config.home / "runtime" / "launches"
    launches.mkdir(parents=True, exist_ok=True)
    folders = {}
    for name in ("calm-river", "quiet-heron"):
        folders[name] = Worktree(root, name).created()
        app.console().run(["environment", "create", name], USER)
        (launches / f"{name}.json").write_text(json.dumps({"launch": f"launch-{name}"}))
    script = root / ".journal" / "src" / "journal" / "hooks" / "environment.sh"
    script = script if script.is_file() else Path(__file__).resolve().parents[1] / "src" / "journal" / "hooks" / "environment.sh"
    named = {name: subprocess.run(["sh", "-c", f". '{script}'; journal_environment"], cwd=folder, env={key: value for key, value in os.environ.items() if key != "JOURNAL_ENV"}, capture_output=True, text=True, timeout=30).stdout for name, folder in folders.items()}
    assert named == {"calm-river": "calm-river", "quiet-heron": "quiet-heron"}, "a hook with no JOURNAL_ENV names the environment of the worktree folder it runs in"
    roots = {subprocess.run(["sh", "-c", f". '{script}'; journal_main_root"], cwd=folder, capture_output=True, text=True, timeout=30).stdout.strip() for folder in (root, *folders.values())}
    assert roots == {str(root.resolve())}, "a journal command or launch from inside a worktree finds the main checkout as its root, so it uses its journal, its server and its worktrees folder"

    def started(name: str) -> None:
        for turn in range(5):
            posted(app, "/hooks/claude", {"hook_event_name": "SessionStart" if turn == 0 else "UserPromptSubmit", "session_id": f"s-{name}", "prompt": "go"}, {"X-Journal-Env": name, "X-Journal-Launch": f"launch-{name}"})

    runs = [threading.Thread(target=started, args=(name,)) for name in folders]
    for run in runs:
        run.start()
    for run in runs:
        run.join(30)
    environments = app.container.get(Environments)
    homes = {name: app.container.get(Agents).session_agent(f"s-{name}").environment_id for name in folders}
    assert homes == {name: environments.existing(name).row_id for name in folders}, "hooks posted from two worktrees at once each land in their own environment, never in main or the other"


def test_a_lost_worktree_folder_is_made_again_at_its_last_real_tip_which_only_moves_forward(app: App):
    import shutil
    import subprocess
    from journal.support.worktree import Worktree
    root = app.config.root
    git = lambda *argv, cwd=root: subprocess.run(["git", *argv], cwd=cwd, capture_output=True, text=True, timeout=30)
    for argv in (["init", "-q", "-b", "main"], ["-c", "user.email=t@example.com", "-c", "user.name=T", "commit", "-q", "--allow-empty", "-m", "start"]):
        git(*argv)
    tree = Worktree(root, "calm-river")
    folder = tree.created()
    git("-c", "user.email=t@example.com", "-c", "user.name=T", "commit", "-q", "--allow-empty", "-m", "the work", cwd=folder)
    tip = git("rev-parse", "HEAD", cwd=folder).stdout.strip()
    tree.record_tip()
    shutil.rmtree(folder)
    tree.record_tip()
    assert git("rev-parse", "refs/journal/worktrees/calm-river").stdout.strip() == tip, "an end with the folder already gone leaves the kept tip where the last real end put it"
    git("branch", "-D", "worktree-calm-river")
    git("worktree", "prune")
    remade = Worktree(root, "calm-river").created()
    assert remade == folder and git("rev-parse", "HEAD", cwd=remade).stdout.strip() == tip, "a relaunch makes the lost folder again at the last real tip"
    git("reset", "-q", "--hard", "HEAD~1", cwd=remade)
    Worktree(root, "calm-river").record_tip()
    assert git("rev-parse", "refs/journal/worktrees/calm-river").stdout.strip() == tip, "and the kept tip never moves back"


def test_a_worker_of_an_environment_whose_worktree_vanished_is_refused_never_cut_from_main(app: App):
    import shutil
    import subprocess
    from journal.features.workers.support.worker_branch import WorkerBranch
    from journal.models.worker import Worker
    from journal.repositories.environments import Environments
    from journal.support.rejection import Rejection
    from journal.support.worktree import Worktree
    root = app.config.root
    git = lambda *argv: subprocess.run(["git", *argv], cwd=root, capture_output=True, text=True, timeout=30)
    for argv in (["init", "-q", "-b", "main"], ["-c", "user.email=t@example.com", "-c", "user.name=T", "commit", "-q", "--allow-empty", "-m", "start"]):
        git(*argv)
    tree = Worktree(root, "calm-river")
    folder = tree.created()
    app.console().run(["environment", "create", "calm-river"], USER)
    app.console().run(["environment", "branch", "calm-river", tree.branch], USER)
    environment = app.container.get(Environments).existing("calm-river")
    shutil.rmtree(folder)
    branches = git("branch", "--list").stdout
    try:
        app.container.get(WorkerBranch).checkout(Worker(id=7, environment_id=environment.row_id, name="Ada", worktree=True))
        raise AssertionError("a worker of an environment whose worktree vanished is refused")
    except Rejection as refused:
        assert "launch calm-river again" in str(refused), str(refused)
    assert git("branch", "--list").stdout == branches, "and main gets no worker branch cut from it"


def test_renaming_an_environment_carries_its_worktree_branch_and_kept_tip_and_refuses_a_name_left_from_earlier(app: App):
    import shutil
    import subprocess
    from journal.support.worktree import Worktree
    root = app.config.root
    git = lambda *argv: subprocess.run(["git", *argv], cwd=root, capture_output=True, text=True, timeout=30)
    for argv in (["init", "-q", "-b", "main"], ["-c", "user.email=t@example.com", "-c", "user.name=T", "commit", "-q", "--allow-empty", "-m", "start"]):
        git(*argv)
    console = app.console()
    for name in ("calm-river", "quiet-heron"):
        tree = Worktree(root, name)
        tree.created()
        console.run(["environment", "create", name], USER)
        console.run(["environment", "branch", name, tree.branch], USER)
    renamed = console.run(["environment", "rename", "calm-river", "keen-otter"], USER)
    assert renamed.code == 0 and (root / ".claude" / "worktrees" / "keen-otter").is_dir() and not (root / ".claude" / "worktrees" / "calm-river").exists(), renamed.error
    assert git("rev-parse", "--verify", "-q", "worktree-keen-otter").returncode == 0 and git("rev-parse", "--verify", "-q", "refs/journal/worktrees/keen-otter").returncode == 0, "its branch and kept tip move with it"
    shutil.rmtree(root / ".claude" / "worktrees" / "quiet-heron")
    git("worktree", "prune")
    lost = console.run(["environment", "rename", "quiet-heron", "brisk-maple"], USER)
    assert lost.code == 0 and git("rev-parse", "--verify", "-q", "worktree-brisk-maple").returncode == 0 and git("rev-parse", "--verify", "-q", "refs/journal/worktrees/brisk-maple").returncode == 0, "with its folder lost, its branch and tip still move to the new name"
    git("branch", "worktree-amber-cedar")
    console.run(["environment", "create", "deft-pebble"], USER)
    refused = console.run(["environment", "rename", "keen-otter", "amber-cedar"], USER)
    assert refused.code != 0 and "is still in use" in refused.error and (root / ".claude" / "worktrees" / "keen-otter").is_dir(), "a rename onto a name an old branch still holds is refused, and nothing moves"


def test_a_launch_worktree_in_a_folder_of_repositories_holds_a_worktree_of_each_on_its_branch(app: App, monkeypatch):
    import subprocess
    from journal.launcher.launch import Launch
    from journal.launcher.menu import Menu
    from journal.providers.support.status_line import StatusLine
    from journal.support.choice import Choice
    from journal.support.workspace_worktree import WorkspaceWorktree
    root = app.config.root
    git = lambda *argv, cwd=root: subprocess.run(["git", *argv], cwd=cwd, capture_output=True, text=True, timeout=30)
    for repository in ("api", "web"):
        (root / repository).mkdir()
        for argv in (["init", "-q", "-b", "main"], ["-c", "user.email=t@example.com", "-c", "user.name=T", "commit", "-q", "--allow-empty", "-m", f"start {repository}"]):
            git(*argv, cwd=root / repository)
    monkeypatch.setattr(Menu, "journal", lambda self, *argv: app.console().run(list(argv), USER).text)
    tree = WorkspaceWorktree.chosen(root, "calm-river")
    assert isinstance(tree, WorkspaceWorktree), "a project folder that is no repository but holds two is a folder of repositories"
    folder = Launch.parse(["claude", "--worktree", "calm-river"], root).launch_file(Choice("calm-river"), StatusLine(root))["front"]["folder"]
    assert folder == str(root / ".claude" / "worktrees" / "calm-river"), "the agent works in the launch folder"
    for repository in ("api", "web"):
        assert git("rev-parse", "--abbrev-ref", "HEAD", cwd=Path(folder) / repository).stdout.strip() == "worktree-calm-river", f"the launch folder holds a worktree of {repository} on the branch worktree-calm-river"
    assert (Path(folder) / ".journal").is_symlink() and (Path(folder) / ".journal").resolve() == app.config.home.resolve(), "with the project's journal linked beside them"
    removed = app.console().run(["worktree", "remove", "calm-river"], USER)
    assert removed.code == 0 and not Path(folder).exists() and git("rev-parse", "--verify", "-q", "worktree-calm-river", cwd=root / "api").returncode == 0, "and journal worktree remove takes the folder away, each repository's branch kept"


def test_an_old_main_worktree_moves_to_an_environment_of_its_own_and_main_launches_in_the_project(app: App):
    import subprocess
    from journal.features.git.seeds.old_main_worktree import OldMainWorktree
    from journal.launcher.launch import Launch
    from journal.repositories.environments import Environments
    from journal.support.choice import Choice
    from journal.support.worktree import Worktree
    root = app.config.root
    git = lambda *argv, cwd=root: subprocess.run(["git", *argv], cwd=cwd, capture_output=True, text=True, timeout=30)
    for argv in (["init", "-q", "-b", "trunk"], ["-c", "user.email=t@example.com", "-c", "user.name=T", "commit", "-q", "--allow-empty", "-m", "start"]):
        git(*argv)
    old = Worktree(root, "main").created()
    git("-c", "user.email=t@example.com", "-c", "user.name=T", "commit", "-q", "--allow-empty", "-m", "work in the old main worktree", cwd=old)
    app.container.get(OldMainWorktree).run()
    moved = [environment for environment in app.container.get(Environments).all() if (environment.branch or "").startswith("worktree-") and environment.name != "main"]
    assert not old.exists() and len(moved) == 1 and (root / ".claude" / "worktrees" / moved[0].name).is_dir(), "the upgrade moves the old main worktree to a made-up name with an environment of its own"
    assert git("log", "-1", "--format=%s", cwd=root / ".claude" / "worktrees" / moved[0].name).stdout.strip() == "work in the old main worktree", "its work moves with it"
    launch = Launch.parse(["claude"], root)
    assert not launch.is_worktree_launch(Worktree(root, "main")), "main launches in the project's own checkout"
    assert "never a worktree" in Launch.parse(["claude", "--worktree", "main"], root).start_refusal(Choice("main")), "and main can never again be a worktree name"


def test_an_environment_that_records_a_worktree_has_its_lost_folder_remade_from_the_viewer_and_the_menu(app: App, monkeypatch):
    import shutil
    import subprocess
    from journal.launcher.launch import Launch
    from journal.launcher.menu import Menu
    from journal.providers.support.status_line import StatusLine
    from journal.support.choice import Choice
    from journal.support.worktree import Worktree
    root = app.config.root
    git = lambda *argv: subprocess.run(["git", *argv], cwd=root, capture_output=True, text=True, timeout=30)
    for argv in (["init", "-q", "-b", "main"], ["-c", "user.email=t@example.com", "-c", "user.name=T", "commit", "-q", "--allow-empty", "-m", "start"]):
        git(*argv)
    monkeypatch.setattr(Menu, "journal", lambda self, *argv: app.console().run(list(argv), USER).text)
    tree = Worktree(root, "calm-river")
    folder = tree.created()
    app.console().run(["environment", "create", "calm-river"], USER)
    app.console().run(["environment", "branch", "calm-river", tree.branch], USER)
    for argv in (["claude", "--env", "calm-river"], ["claude"]):
        shutil.rmtree(folder)
        git("worktree", "prune")
        produced = Launch.parse(argv, root).launch_file(Choice("calm-river"), StatusLine(root))
        assert produced["front"]["folder"] == str(folder) and folder.is_dir(), f"launched as {argv}, the environment's lost worktree is made again from its kept tip"


def test_deleting_an_environment_never_removes_its_worktree_merged_or_not(app: App):
    import subprocess
    from journal.support.worktree import Worktree
    root = app.config.root
    git = lambda *argv, cwd=root: subprocess.run(["git", *argv], cwd=cwd, capture_output=True, text=True, timeout=30)
    git("init", "-q", "-b", "main")
    git("config", "user.email", "t@example.com")
    git("config", "user.name", "T")
    git("commit", "-q", "--allow-empty", "-m", "start")
    tree = Worktree(root, "calm-river").created()
    console = app.console()
    console.run(["environment", "create", "calm-river"], USER)
    line_text = console.run(["environment", "delete", "calm-river"], USER).text
    assert "its worktree" in line_text and "stays" in line_text and tree.is_dir(), "a clean worktree stays when its environment is deleted"
    git("merge", "-q", "worktree-calm-river")
    console.run(["environment", "create", "calm-river"], USER)
    line_text = console.run(["environment", "delete", "calm-river"], USER).text
    assert "stays" in line_text and tree.is_dir() and "worktree-calm-river" in git("branch", "--list", "worktree-calm-river").stdout, "a merged one stays too, with its branch: only the person removes a worktree"
    from journal.models.agent import Agent
    from journal.support.agent_role import AgentRole
    from journal.repositories.agents import Agents
    from journal.repositories.environments import Environments
    console.run(["environment", "create", "calm-river"], USER)
    environment = app.container.get(Environments).existing("calm-river")
    status, answer = posted(app, f"/journal/environments/{environment.row_id}/remove", {}, {"X-Journal-Env": "main"})
    assert status == 200 and "stays" in answer["worktree"] and tree.is_dir(), "the viewer's Delete, which wipes the environment, keeps its worktree too"
    console.run(["environment", "create", "calm-river"], USER)
    environment = app.container.get(Environments).existing("calm-river")
    working = app.container.get(Agents).save(Agent(environment_id=environment.row_id, session="s-calm", role=AgentRole.MAIN, state="working"), Actor.system())
    refused = console.run(["worktree", "remove", "calm-river"], USER)
    assert refused.code != 0 and "a session works in the worktree calm-river" in refused.error and tree.is_dir(), "removing is refused while a session works in it"
    app.container.get(Agents).save(working.with_(state="ended"), Actor.system())
    (tree / "draft.txt").write_text("unsaved\n")
    refused = console.run(["worktree", "remove", "calm-river"], USER)
    assert refused.code != 0 and "1 uncommitted files (draft.txt)" in refused.error and tree.is_dir(), "and while it holds uncommitted work"
    (tree / "draft.txt").unlink()
    status, removed = posted(app, f"/journal/environments/{environment.row_id}/worktree-removal", {}, {"X-Journal-Env": "main"})
    assert status == 200 and "removed the worktree" in removed["line"] and not tree.exists(), "the viewer's button removes a clean worktree through the same checks"
    assert "there is no worktree named calm-river" in console.run(["worktree", "remove", "calm-river"], USER).error
    assert "worktree-calm-river" in git("branch", "--list", "worktree-calm-river").stdout
    assert git("rev-parse", "refs/journal/worktrees/calm-river").stdout.strip() == git("rev-parse", "worktree-calm-river").stdout.strip(), "its branch and its last commit stay, so a launch of its name makes it again"
    from journal.launcher.launch import Launch
    from journal.support.choice import Choice
    assert Launch.parse(["claude", "--worktree", "calm-river"], root).start_refusal(Choice("calm-river")) == "", "while any other worktree name launches"


def test_the_viewer_lists_an_environments_worktree_with_its_branch(app: App):
    import subprocess
    from journal.http.controllers.environments import EnvironmentController
    from journal.repositories.environments import Environments
    from journal.support.worktree import Worktree
    root = app.config.root
    for argv in (["init", "-q", "-b", "main"], ["-c", "user.email=t@example.com", "-c", "user.name=T", "commit", "-q", "--allow-empty", "-m", "start"]):
        subprocess.run(["git", *argv], cwd=root, capture_output=True, timeout=30)
    Worktree(root, "calm-river").created()
    environments = app.container.get(Environments)
    rows = app.container.get(EnvironmentController).shown_page([environments.lookup("main"), environments.lookup("calm-river")])
    assert [(r["name"], r["worktree"]) for r in rows] == [("main", ""), ("calm-river", "worktree on worktree-calm-river")]


def test_a_commit_made_in_a_worktree_closes_its_task_at_once_and_the_merge_that_lands_it_closes_nothing_twice(app: App):
    import subprocess
    from journal.repositories.tasks import Tasks
    from journal.repositories.scope import Scope
    from journal.support.worktree import Worktree
    root = app.config.root
    git = lambda *argv, cwd=root: subprocess.run(["git", *argv], cwd=cwd, capture_output=True, text=True, timeout=30)
    git("init", "-q", "-b", "trunk")
    git("config", "user.email", "t@example.com")
    git("config", "user.name", "T")
    (root / ".gitignore").write_text(".journal/\n.claude/\n")
    git("add", ".gitignore")
    git("commit", "-qm", "start")
    tree = Worktree(root, "main").created()
    hook(app, "SessionStart")
    app.console().run(["task", "create", "the page", "--start"], AGENT)
    (tree / "page.py").write_text("PAGE = 1\n")
    git("add", "page.py", cwd=tree)
    git("commit", "-qm", "the page\n\nJournal: tasks done 1", cwd=tree)
    hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "git commit -m 'the page'"}, tool_response={})
    state = lambda: app.container.get(Tasks).find(1).state.value
    with app.container.get(Scope).environment(1):
        assert state() == "completed", "a commit made in the worktree closes the task its trailer names"
    git("merge", "-q", "worktree-main")
    hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "git merge worktree-main"}, tool_response={})
    with app.container.get(Scope).environment(1):
        assert state() == "completed", "the merge that lands it leaves it closed"
    git("merge", "-q", "worktree-main")
    status, _ = hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "git merge worktree-main"}, tool_response={})
    assert status == 200, "a merge that brings nothing new closes nothing twice"


def test_a_phone_pairs_once_by_its_code_one_at_a_time_as_version_3_did(app: App):
    from datetime import datetime, timedelta, timezone
    from journal.features.sharing.support.tunnel import Tunnel
    from journal.features.phone.support.phone_connector import PhoneConnector
    from journal.repositories.messages import Messages
    from journal.repositories.setting_rows import SettingRows
    from journal.support.rejection import Rejection
    user_set(app, "sharing.host", "tunler.example")
    pairing, time = app.container.get(PhoneConnector), datetime.now(timezone.utc)
    with pytest.raises(Rejection, match="only the user pairs"):
        pairing.proposal(7, Actor.agent("s1"), time)
    with pytest.raises(Rejection, match="1, 7, 30 days"):
        pairing.proposal(3, Actor.user(1), time)
    first = pairing.proposal(7, Actor.user(1), time)
    assert app.container.get(Tunnel).is_wanted(time), "a live code keeps the tunnel open, so the phone can reach the journal"
    assert first.link.startswith("https://") and ".tunler.example/p/#" in first.link and len(first.short) == 9, "a link through the tunnel and a short code in two halves"
    newer = pairing.proposal(7, Actor.user(1), time)
    with pytest.raises(Rejection, match="pairs no phone"):
        pairing.pair(first.link.split("#")[1], "iPhone", time)
    paired = pairing.pair(newer.short.lower(), "  iPhone   of Jesse ", time)
    assert paired.phone.name == "iPhone of Jesse" and paired.phone.key != paired.key and paired.phone.expires_at - time == timedelta(days=7), "the short code typed in any case pairs; the key is kept only as its hash"
    app.container.get(ListenerQueue).drain()
    assert any(m.text == "A phone paired: iPhone of Jesse" for m in app.container.get(Messages).scoped()), "the desk is told"
    with pytest.raises(Rejection, match="one phone at a time"):
        pairing.proposal(7, Actor.user(1), time)
    with pytest.raises(Rejection, match="pairs no phone"):
        pairing.pair(newer.short, "Android", time)
    listed = json.load(urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/phones", headers={"X-Journal-Env": "main"}), timeout=5))["phones"]
    assert [p["name"] for p in listed] == ["iPhone of Jesse"] and "key" not in listed[0], "the desk sees the phone, never its key's hash"
    assert app.container.get(Tunnel).is_wanted(time), "a paired phone keeps the tunnel open, with no link shared"
    assert viewer(app, f"phones/{paired.phone.id}/disconnect")["disconnected"] == paired.phone.id
    assert not app.container.get(Tunnel).is_wanted(datetime.now(timezone.utc)), "with the phone disconnected and no code live, nothing keeps it open"
    assert pairing.proposal(7, Actor.user(1), time).short, "once it is disconnected, another phone may pair"


def test_a_pairing_code_expires_and_is_voided_by_ten_wrong_tries(app: App):
    from datetime import datetime, timedelta, timezone
    from journal.features.sharing.support.tunnel import Tunnel
    from journal.features.phone.support.phone_connector import PhoneConnector
    from journal.repositories.setting_rows import SettingRows
    from journal.support.rejection import Rejection
    user_set(app, "sharing.host", "tunler.example")
    pairing, time = app.container.get(PhoneConnector), datetime.now(timezone.utc)
    late = pairing.proposal(1, Actor.user(1), time)
    tunnel = app.container.get(Tunnel)
    assert tunnel.wanted, "a live code keeps the tunnel open"
    tunnel.reconcile_changes(time + timedelta(minutes=11))
    assert not tunnel.wanted, "and once it runs out, the clock closes the tunnel again"
    with pytest.raises(Rejection):
        pairing.pair(late.short, "iPhone", time + timedelta(minutes=11))
    guessed = pairing.proposal(1, Actor.user(1), time)
    for _ in range(10):
        with pytest.raises(Rejection):
            pairing.pair("WRONGCODE", "iPhone", time)
    with pytest.raises(Rejection):
        pairing.pair(guessed.short, "iPhone", time)
    assert viewer(app, "phones/connect", {"days": 30})["short"], "the viewer asks for a code as the user"


def test_a_phone_whose_days_ran_out_is_told_so_and_reaches_nothing(app: App):
    from datetime import datetime, timedelta, timezone
    from journal.features.phone.support.phone_connector import PhoneConnector
    from journal.http.phone.phone_pages import COOKIE, PhonePages
    from journal.http.phone.phone_request import PhoneRequest
    from journal.repositories.setting_rows import SettingRows
    user_set(app, "sharing.host", "tunler.example")
    pairing, then = app.container.get(PhoneConnector), datetime.now(timezone.utc) - timedelta(days=2)
    paired = pairing.pair(pairing.proposal(1, Actor.user(1), then).short, "iPhone", then)
    answer = app.container.get(PhonePages).pass_along(PhoneRequest("GET", "/p/journal/messages", f"{COOKIE}={paired.key}"))
    assert answer.status == 410 and b"run out" in answer.body, "a phone past its days is told so and reads nothing"


def test_a_phone_is_pushed_once_for_each_new_thing_that_waits_for_the_user(app: App, monkeypatch, tmp_path):
    import stat
    from datetime import datetime, timedelta, timezone
    from journal.features.phone.listeners.phone_notice import PhoneNotice
    from journal.features.phone.support.p256 import P256
    from journal.features.phone.support.push_keys import PushKeys
    from journal.features.phone.support.web_push import WebPush
    from journal.models.phone import Phone
    from journal.repositories.phones import Phones
    keys = PushKeys.stored(tmp_path / "push.json")
    assert PushKeys.stored(tmp_path / "push.json") == keys and stat.S_IMODE((tmp_path / "push.json").stat().st_mode) == 0o600, "made once, kept where only its owner reads"
    signed = keys.signed(b"a journal")
    assert P256.is_curve_point(keys.public) and P256.is_signed(keys.public, b"a journal", signed) and not P256.is_signed(keys.public, b"another", signed), "a token's signature checks out, and only for what it signed"
    assert WebPush.is_allowed("https://web.push.apple.com/abc") and WebPush.is_allowed("https://wns2.notify.windows.com/x")
    assert not WebPush.is_allowed("http://web.push.apple.com/abc") and not WebPush.is_allowed("https://evil.example/push"), "a push goes only to the phone makers' services, over https"
    transmitted, answers = [], [201]
    monkeypatch.setattr(WebPush, "send", lambda self, endpoint: transmitted.append(endpoint) or answers[0])
    phones, time = app.container.get(Phones), datetime.now(timezone.utc)
    phones.save(Phone(name="iPhone", key="k", expires_at=time + timedelta(days=1), subscription="https://web.push.apple.com/abc"), Actor.user(1))
    hook(app, "SessionStart")
    announcement = app.container.get(PhoneNotice)
    announcement.handle(None)
    assert transmitted == [], "nothing waits, nothing is pushed"
    app.console().run(["question", "ask", "Which name?"], AGENT)
    announcement.handle(None)
    announcement.handle(None)
    assert transmitted == ["https://web.push.apple.com/abc"], "a new question is pushed once, not on every tick"
    answers[0] = 0
    app.console().run(["question", "ask", "Which colour?"], AGENT)
    announcement.handle(None)
    announcement.handle(None)
    failed = phones.matching(name="iPhone")[0]
    assert len(transmitted) == 2 and failed.subscription_failed_at and failed.has_updates(["questions:2"]), "a push that did not reach the service stays owed and waits a minute before it is tried again"
    phones.save(failed.push_failed(time - timedelta(minutes=2)), Actor.system())
    answers[0] = 410
    announcement.handle(None)
    assert len(transmitted) == 3 and phones.matching(name="iPhone")[0].subscription == "", "an address the service no longer knows is forgotten until the phone subscribes again"


def test_a_line_naming_a_list_that_changes_is_said_once_inside_its_window(app: App):
    from journal.engine.nudger import Nudger
    from journal.features.tasks.feature import Tasks
    from journal.models.agent import Agent
    from journal.repositories.agents import Agents
    app.container.get(Agents).save(Agent(session="s1", environment_id=1, provider="claude"), Actor.system())
    agent, nudger = app.container.get(SessionAgents).agent("s1", 1), app.container.get(Nudger)
    assert nudger.deliver(agent, ShellNudges.BACKGROUND_CHECK.create(background_outputs="12, 15")), "the first naming of the commands still running is said"
    assert nudger.deliver(agent, ShellNudges.BACKGROUND_CHECK.create(background_outputs="12, 15, 18")) is None, "a command joining the list inside the window says nothing again: Ada's flood"
    assert nudger.deliver(agent, TasksNudges.IDLE_CHECK.create()), "the quiet check is said once"
    assert nudger.deliver(agent, TasksNudges.IDLE_CHECK.create()) is None, "and not again at the next tick five seconds later"
    assert nudger.deliver(agent, TasksNudges.UNLOGGED_TASK.create(n=3)) and nudger.deliver(agent, TasksNudges.UNLOGGED_TASK.create(n=4)), "a line about one row is still held by its words: another task is named"


def test_a_thread_that_ends_without_releasing_gives_its_connection_back(connection):
    import gc
    import threading

    def query():
        connection.one("SELECT 1")

    connection.one("SELECT 1")
    for _ in range(5):
        worker = threading.Thread(target=query)
        worker.start()
        worker.join()
        del worker
        gc.collect()
    opened = len(connection._open)
    for _ in range(5):
        worker = threading.Thread(target=query)
        worker.start()
        worker.join()
        del worker
        gc.collect()
    assert len(connection._open) == opened, "a check's or a worker's thread that never released its connection gives it back once it is gone, and the next thread takes it"


def test_work_that_may_be_left_undone_is_skipped_once_the_deferred_work_is_far_behind(tmp_path):
    from journal.config import Config
    from journal.support.fault_log import FaultLog
    from journal.support.listener_queue import ListenerQueue
    deferred, completed = ListenerQueue(FaultLog(Config(tmp_path))), []
    for i in range(ListenerQueue.QUEUE_WARNING_ITEMS + 50):
        deferred.add_bounded(lambda i=i: completed.append(i), f"plugin {i}")
    assert deferred.depth() == ListenerQueue.QUEUE_WARNING_ITEMS and deferred.skipped == 50, "a plugin relay past the bound is skipped and counted, so a slow plugin never grows the queue without end"
    deferred.add(lambda: completed.append("own"))
    assert deferred.depth() == ListenerQueue.QUEUE_WARNING_ITEMS + 1, "the journal's own work is always added"


def test_a_read_that_asks_a_server_outside_is_not_judged_against_the_budget(app: App, monkeypatch):
    from journal.http.router import Router
    from journal.http.support.request import Request
    from journal.support.response import Response
    from journal.features.faults.support.request_time_recorder import RequestTimeRecorder
    measured = []
    monkeypatch.setattr(RequestTimeRecorder, "measured", lambda self, method, path, ms: measured.append(path))
    router = app.container.get(Router)
    router.get_outward("/journal/far", lambda request: Response.json({}))
    router.get("/journal/near", lambda request: Response.json({}))
    inquiry = lambda path: router.route(Request("GET", path, {}, {}, {}, {"X-Journal-Env": "main"}, Actor.user(1)))
    inquiry("/journal/far")
    inquiry("/journal/near")
    assert measured == ["/journal/near"], "the tunnel's answer waits on the network, so only the journal's own reads are held to a budget"


def test_the_database_gives_deleted_rows_space_back_by_itself(app: App):
    from journal.db.connection import Connection
    assert app.container.get(Connection).one("PRAGMA auto_vacuum")[0] == 1, "auto-vacuum is on, so a trimmed record shrinks the file"


def test_every_start_writes_the_journals_skills_afresh_in_both_skill_folders_and_removes_retired_ones(tmp_path: Path):
    def planted(root: Path) -> dict[str, Path]:
        paths = {}
        for home in (".claude/skills", ".agents/skills"):
            for name, text in (("journal-tasks", "---\nname: journal-tasks\n---\nan old text"), ("journal-retired", "---\nname: journal-retired\n---\nretired"), ("journal-lint", "---\nplugin: lint\nname: journal-lint\n---\nthe plugin's"), ("deploy", "---\nname: deploy\n---\nmine")):
                path = root / home / name / "SKILL.md"
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(text)
                paths[f"{home}/{name}"] = path
        return paths

    for start in ("first start", "restart"):
        paths = planted(tmp_path)
        app = main_journal(Config(tmp_path, port=0))
        app.runtime().start()
        try:
            for home in (".claude/skills", ".agents/skills"):
                assert "an old text" not in paths[f"{home}/journal-tasks"].read_text(), f"{start}: a journal skill changed on disk is written afresh in {home}"
                assert not paths[f"{home}/journal-retired"].parent.exists(), f"{start}: a journal skill no longer shipped is removed from {home}"
                assert paths[f"{home}/journal-lint"].read_text().endswith("the plugin's") and paths[f"{home}/deploy"].read_text().endswith("mine"), f"{start}: a plugin's skill and the project's own stay in {home}"
        finally:
            app.runtime().stop()


def test_the_journals_skills_and_profiles_are_written_fresh_and_a_projects_own_are_left_alone(app: App):
    from journal.features.profiles.support.profile_files import ProfileFiles
    from journal.features.skills.support.skill_files import SkillFiles
    root = app.config.root
    stale_skill = root / ".claude" / "skills" / "journal-gone" / "SKILL.md"
    own_skill = root / ".claude" / "skills" / "deploy" / "SKILL.md"
    plugin_skill = root / ".claude" / "skills" / "journal-lint" / "SKILL.md"
    for path, text in ((stale_skill, "---\nname: journal-gone\n---\nold"), (own_skill, "---\nname: deploy\n---\nmine"), (plugin_skill, "---\nplugin: lint\nname: journal-lint\n---\nthe plugin's")):
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text)
    app.container.get(SkillFiles).write_all()
    assert not stale_skill.parent.exists() and own_skill.is_file() and plugin_skill.is_file(), "a journal skill no longer shipped goes; the project's own and a plugin's stay"
    assert (root / ".claude" / "skills" / "journal-tasks" / "SKILL.md").is_file()
    agents = root / ".claude" / "agents"
    agents.mkdir(parents=True, exist_ok=True)
    files = app.container.get(ProfileFiles)
    researcher = next(p for p in files.PROFILES if p.name == "journal-researcher")
    (agents / "researcher.md").write_text(f"---\nname: researcher\n---\n\n{researcher.body}\n")
    (agents / "planner.md").write_text("---\nname: planner\n---\n\nmy own planner, rewritten\n")
    (agents / "journal-gone.md").write_text("---\nname: journal-gone\n---\n\nold\n")
    (agents / "auditor.md").write_text("---\nname: auditor\n---\n\nmine\n")
    files.write_all()
    names = sorted(p.stem for p in agents.glob("*.md"))
    assert names == ["auditor", "journal-debugger", "journal-medior", "journal-plan-reviewer", "journal-planner", "journal-researcher", "journal-senior", "planner"], f"the old unedited researcher and a journal profile no longer shipped go; an edited planner and the project's auditor stay: {names}"


def test_every_line_a_feature_declares_is_registered_with_it(app: App):
    from journal.engine.nudge import Nudge
    from journal.features.registry import Registry
    unregistered = [f"{nudge.key}" for feature in app.container.get(Registry).features for nudge in vars(type(feature) if not isinstance(feature, type) else feature).values() if isinstance(nudge, Nudge) and nudge not in feature.nudges]
    assert unregistered == [], f"a line the registry cannot find is taken for one whose answer stays out of the chat: {unregistered}"


def test_await_and_stuck_are_taught_once_in_the_tasks_skill_and_every_other_skill_names_it(app: App):
    from journal.features.registry import Registry
    skills = app.container.get(Registry).skills()
    for command in ("journal await", "journal stuck"):
        teaching = [skill.name for skill in skills if command in skill.body]
        assert teaching == ["tasks"], f"{command} is taught in {teaching}, not in the tasks skill alone"


def test_the_fiddly_skills_show_a_real_command_and_hold_one_rule_to_a_bullet_of_four_lines_at_most(app: App):
    import re
    from journal.features.registry import Registry
    registry = app.container.get(Registry)
    for name, noun in (("messages", "message"), ("tasks", "task"), ("reports", "report"), ("workers", "worker")):
        real = re.findall(rf"`journal {noun} [^`<]*\d[^`<]*`", registry.skill(name).body)
        assert real, f"the {name} skill shows no real {noun} command, one with its values filled in"
    for name in ("messages", "tasks", "workers"):
        bullets = [bullet for block in registry.skill(name).body.split("\n\n") for bullet in re.split(r"\n(?=- )", block)]
        long = [bullet.splitlines()[0][:60] for bullet in bullets if bullet.startswith("- ") and len(bullet.splitlines()) > 4]
        assert long == [], f"the {name} skill has bullets of more than four lines, more than one rule each: {long}"


def test_the_skills_check_fails_on_a_skill_off_the_map_and_on_a_sentence_in_two_skills_and_passes_on_the_shipped_set():
    import importlib.util
    from dataclasses import replace
    from journal.support.skill import Skill
    spec = importlib.util.spec_from_file_location("skills_map", Path(__file__).resolve().parents[1] / "scripts" / "checks" / "skills_map.py")
    check = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(check)
    shipped = check.shipped()
    assert check.problems(shipped) == [], "the shipped skills pass"
    sentence = "Every footer names the shop that sells the goods on its page."
    unmapped = Skill("footers", "Write footers; load it when a footer changes", f"# Footers\n\n- {sentence}\n")
    problems = check.problems([*shipped, unmapped])
    assert any("footers skill" in problem for problem in problems), f"a skill off the map is named: {problems}"
    echoed = [replace(skill, body=f"{skill.body}\n- {sentence}\n") if skill.name == "tasks" else skill for skill in [*shipped, unmapped]]
    assert any(problem.startswith(("tasks and footers", "footers and tasks")) for problem in check.problems(echoed)), "a sentence in two skills is named"


def test_every_skill_description_says_what_then_when_in_under_300_characters(app: App):
    from journal.features.registry import Registry
    from journal.features.skills.skills_options import SkillsOptions
    skills = app.container.get(Registry).skills()
    when = {skill.name: "; read at the start of every session" if skill.name in SkillsOptions.START_SKILLS.default else "; load it " for skill in skills}
    unclaused = [skill.name for skill in skills if when[skill.name] not in skill.description or skill.description.startswith(("Load it", "How ", "The "))]
    long = [skill.name for skill in skills if len(skill.description) >= 300]
    assert unclaused == [], f"these skills do not say what they do, then when: {unclaused}"
    assert long == [], f"these descriptions are 300 characters or more: {long}"


def test_the_journal_skill_is_a_short_map_naming_every_skill_and_listing_no_commands(app: App):
    import re
    from journal.features.registry import Registry
    skills = app.container.get(Registry).skills()
    journal = next(skill for skill in skills if skill.name == "journal")
    table = "\n".join(line for line in journal.body.splitlines() if line.startswith("| "))
    unnamed = [skill.name for skill in skills if skill.name != "journal" and not re.search(rf"(?<![\w-]){re.escape(skill.name)}(?![\w-])", table)]
    commands = set(re.findall(r"`journal (\S+)", journal.body))
    assert unnamed == [], f"the map's table names no row for {unnamed}"
    assert commands <= {"<noun>", "environment", "search"}, f"the map lists commands: {commands}"
    assert len(journal.body.strip().splitlines()) <= 35 and journal.body.count("[journal]") == 1, "the map is about 30 lines and says the line rule once"


def test_the_work_modes_skill_holds_the_mode_and_fitness_paragraphs_and_the_workers_skill_stays_short(app: App):
    from journal.features.registry import Registry
    registry = app.container.get(Registry)
    workers, modes, journal = (registry.skill(name) for name in ("workers", "work-modes", "journal"))
    assert "The work mode is the bottom state of your stack" in modes.body and "Your fitness is worked out" in modes.body, "the work-modes skill holds the mode and fitness paragraphs"
    assert "The work mode is the bottom state" not in workers.body and "Your fitness is worked out" not in workers.body, "the workers skill no longer holds them"
    assert set(modes.keywords) == {"orchestrator", "builder", "solo", "fitness"} and set(modes.required_states) == {"orchestrating", "soloing"}
    assert len(workers.body.strip().splitlines()) < 70, f"the workers skill is {len(workers.body.strip().splitlines())} lines"
    assert "workers, work-modes" in journal.body, "the journal map names both"


def test_the_pinned_links_and_messages_skills_both_say_what_a_pin_is_and_what_a_button_is_in_the_same_words(app: App):
    from journal.features.pins.support.pin_and_button_text import PinAndButtonText
    from journal.features.registry import Registry
    registry = app.container.get(Registry)
    for sentence in ("A pin is a note left on the user's desk", "It stays until the user\n  closes it.", "A button is an action for now", "moves on with the chat.", "Something ready that the user also acts on now gets both"):
        assert sentence in PinAndButtonText.BULLETS, f"the pin and button text no longer says {sentence!r}"
    holding = [name for name in ("pinned-links", "messages") if PinAndButtonText.BULLETS in registry.skill(name).body]
    assert holding == ["pinned-links", "messages"], f"only {holding} say what a pin and a button are"
    pointer = [line for line in registry.skill("journal").body.splitlines() if "A pin is" in line and "a button" in line]
    assert pointer and "the pinned-links and messages skills" in registry.skill("journal").body, "the journal map names the distinction and points to both skills"


def test_a_blocks_waits_and_the_from_flag_are_taught_in_tasks_and_plans_and_messages_point_to_it(app: App):
    from journal.features.registry import Registry
    registry = app.container.get(Registry)
    tasks, plans, messages = (registry.skill(name).body for name in ("tasks", "plans", "messages"))
    assert all(flag in tasks for flag in ("--on task:", "--until", "--from")), "the tasks skill teaches a block's waits and --from"
    assert "--on" not in plans and "--until" not in plans and "the tasks skill" in plans, "the plans skill points to tasks for a block's waits"
    assert "--from" not in messages and "the tasks skill" in messages, "the messages skill keeps the choice and points to tasks for --from"


def test_an_outputs_tail_and_a_polled_transcript_are_read_only_as_far_as_needed(tmp_path):
    from journal.features.shell.support.output_files import OutputFiles
    from journal.http.transcripts.transcript_turns import TranscriptTurns
    from journal.providers.claude import Claude
    (tmp_path / "parts").write_text("R\nW\nR\n")
    (tmp_path / "0.out").write_text("".join(f"first {i}\r\n" for i in range(5)))
    (tmp_path / "0.err").write_text("oops\n")
    (tmp_path / "2.out").write_text("".join(f"line {i} " + "x" * (i % 300) + "\n" for i in range(40000)))
    files = OutputFiles(tmp_path)
    assert all(files.last(n) == files.lines()[-n:] for n in (1, 20, 39999, 40001, 40006, 90000)), "the tail read from the files' ends is the tail of every line, across parts and past a block"
    transcript = tmp_path / "t.jsonl"
    row = lambda n: json.dumps({"type": "assistant", "timestamp": "", "message": {"role": "assistant", "content": [{"type": "text", "text": f"said {n}"}]}}) + "\n"
    transcript.write_text(row(1) + "not json\n" + row(2) + row(3)[:20])
    turns, claude = TranscriptTurns(), Claude()
    assert turns.build(claude, transcript) == claude.turns(transcript), "the first poll reads every whole line"
    transcript.write_text(transcript.read_text() + row(3)[20:] + row(4))
    assert turns.build(claude, transcript) == claude.turns(transcript) and [t.line for t in turns.build(claude, transcript)] == [1, 3, 4, 5], "a later poll carries on from where the last stopped, the line numbers counted on"
    transcript.write_text(row(9))
    assert [t.text for t in turns.build(claude, transcript)] == ["said 9"], "a transcript written anew is read from its start"


def test_an_update_holds_its_mark_until_the_journal_runs_the_version_it_went_to(app: App):
    import dataclasses
    import time as timing
    from journal.features.updates.support.update_pause import UpdatePause
    from journal.features.updates.support.update_card import UpdateCard
    from journal.support.rejection import Rejection
    from journal.version import VERSION
    threshold = app.container.get(UpdateCard)
    updating = updating_with(app, Source("v4.0.0", "v4.99.0"), Installer(), auto=True)
    updating.checked()
    assert threshold.paused().target == "4.99.0" and updating.data().updating == "4.99.0", "the update keeps its mark through the restart it asks for"
    updating.checked()
    assert "an update to 4.99.0 is under way" in updating.problem, "a second automatic update waits for the first"
    threshold.write(dataclasses.replace(threshold.paused(), pid=os.getppid(), step="Restarting once outputs 4 end"))
    updating.install(Actor.user(1))
    assert threshold.paused().pid == os.getpid(), "an update a person runs goes ahead over a live marker, and the marker is its own"
    threshold.write(dataclasses.replace(threshold.paused(), pid=-1))
    updating.reconcile(timing.time())
    assert threshold.paused() is None and "did not finish" in updating.problem and "update.log" in updating.problem, "a journal that came back on the old version says the update did not finish"
    threshold.write(UpdatePause("4.0.0", VERSION, "Restarting the journal", timing.time(), -1))
    updating.reconcile(timing.time())
    assert threshold.paused() is None and updating.problem == "", "a journal that came back on the version it went to takes the mark off"
    threshold.write(UpdatePause("4.0.0", VERSION, "Restarting the journal", timing.time(), os.getpid()))
    updating.reconcile(timing.time())
    assert threshold.paused() is None, "even when it came back under the same process number, as a journal in a container does"
    import subprocess
    ended = subprocess.Popen(["true"])
    ended.wait()
    threshold.write(UpdatePause("4.0.0", "4.99.0", "Installing the new version", timing.time(), ended.pid))
    assert threshold.paused() is not None and updating.data().updating == "", "a mark whose process is gone shows no update under way, so the viewer's cover never hangs on it"
    threshold.claim("4.0.0", "4.99.0")
    assert threshold.paused().pid == os.getpid(), "and a new update goes ahead over it, rather than waiting out the quarter hour"


def failed_path(app: App, version: str) -> dict:
    from journal.features.updates.support.update_path_file import UpdatePathFile
    record = {"from": version, "to": "4.99.0", "steps": ["4.98.0"], "reached": version, "failed": "4.98.0"}
    paths = app.container.get(UpdatePathFile)
    paths.path.parent.mkdir(parents=True, exist_ok=True)
    paths.path.write_text(json.dumps(record))
    return record


def test_a_failed_step_takes_the_card_down_names_the_step_and_starts_nothing_until_retried(app: App):
    import time as timing
    from journal.features.updates.support.update_card import UpdateCard
    from journal.features.updates.support.update_path_file import UpdatePathFile
    from journal.features.updates.support.update_path_record import UpdatePathRecord
    from journal.features.updates.support.update_pause import UpdatePause
    from journal.support.rejection import Rejection
    from journal.version import VERSION
    card, paths = app.container.get(UpdateCard), app.container.get(UpdatePathFile)
    installer = Installer()
    updating = updating_with(app, Source("v4.0.0", "v4.99.0"), installer, auto=True)
    with pytest.raises(Rejection, match="nothing to retry"):
        updating.retry(Actor.user(1))
    record = failed_path(app, VERSION)
    card.write(UpdatePause(VERSION, "4.99.0", "Installing the new version", timing.time(), os.getpid()))
    updating.reconcile(timing.time())
    assert card.paused() is None and f"stopped at {VERSION}: the step to 4.98.0 failed, and {VERSION} keeps running" in updating.data().problem, "the card comes down and names the failed step and the version still running"
    assert paths.record() == UpdatePathRecord.read(record), "a boot reads the path and never clears it"
    updating.checked()
    assert installer.ran == [] and card.paused() is None, "with automatic updates on, a boot after a failed step starts nothing"
    updating.close_path()
    assert updating.data().problem == "" and paths.record().has_failed(VERSION), "close takes the path off the card and keeps the failed step from being tried on its own"
    updating.checked()
    assert installer.ran == [], "a closed path is not tried again on its own"
    updating.retry(Actor.user(1))
    updates_joined()
    assert installer.ran == ["v4.99.0"] and paths.record() == UpdatePathRecord.empty(), "retry installs the newest release again from the version still running, so its path starts at the step that failed"


def test_a_two_step_path_drives_one_card_from_its_start_to_its_final_version(app: App):
    import time as timing
    from journal.features.updates.support.update_card import UpdateCard
    from journal.features.updates.support.update_path_file import UpdatePathFile
    from journal.features.updates.support.update_pause import UpdatePause
    from journal.version import VERSION
    card, paths = app.container.get(UpdateCard), app.container.get(UpdatePathFile)
    updating = updating_with(app, Source("v4.0.0", "v4.99.0"), Installer(), auto=False)
    paths.path.parent.mkdir(parents=True, exist_ok=True)
    paths.path.write_text(json.dumps({"from": VERSION, "to": "4.99.0", "steps": ["4.98.0"], "reached": VERSION, "failed": ""}))
    card.write(UpdatePause(VERSION, "4.99.0", "Installing the new version", timing.time(), os.getpid()))
    updating.reconcile(timing.time())
    shown = updating.data()
    assert card.paused().step == f"Updating from {VERSION} to 4.99.0 in 2 steps: installing 4.98.0, step 1 of 2", "the card says the whole path and the step in hand"
    assert (shown.updating, shown.step_count, shown.step_version, shown.final_version) == ("4.99.0", 2, "4.98.0", "4.99.0")
    paths.path.write_text(json.dumps({"from": "4.0.0", "to": "4.99.0", "steps": [VERSION], "reached": "4.0.0", "failed": ""}))
    card.write(UpdatePause("4.0.0", "4.99.0", "Installing the new version", timing.time(), -1))
    updating.reconcile(timing.time())
    assert card.paused().pid == os.getpid() and card.paused().step == "Updating from 4.0.0 to 4.99.0 in 2 steps: installing 4.99.0, step 2 of 2", "the journal booted on a step takes the card over and names the next"
    assert updating.problem == "" and updating.data().step_version == "4.99.0", "a boot on a recorded step is no update that did not finish"
    os.utime(paths.path, (timing.time() - 3600, timing.time() - 3600))
    card.write(UpdatePause("4.0.0", "4.99.0", "Installing the new version", timing.time(), -1))
    updating.reconcile(timing.time())
    assert card.paused() is None and "did not finish" in updating.problem and updating.data().step_count == 0, "a walk that went quiet past a step's time holds the card no longer"


def test_a_status_a_program_answered_or_a_number_with_a_unit_is_never_named_a_missing_link():
    from journal.features.messages.support.unlinked_row_numbers import UnlinkedRowNumbers
    text = "the server answered 200 in 2 ms, HTTP 404 for the old path, and the build took 300 s"
    assert UnlinkedRowNumbers.numbers(text) == [], "a status, a status code and a time are no row"


def test_a_command_is_shown_without_its_variables_on_its_first_line_and_cut_short():
    from journal.support.command_text import SHOWN_CHARACTERS, CommandText
    heredoc = "COMMANDMENTS_PLAIN_PROGRESS=1 cat > src/a.js <<'EOF'\nimport {x} from 'y';\nEOF"
    assert CommandText(SHAPES).shown(heredoc) == "cat > src/a.js <<'EOF'", "a heredoc shows its command, not its text, and no variable set before it"
    shown = CommandText(SHAPES).shown("pytest " + "tests/a.py " * 40)
    assert len(shown) == SHOWN_CHARACTERS and shown.endswith("…"), "a long command is cut to the set length"


def test_a_shell_line_says_whether_it_reads_searches_or_runs(app: App):
    from journal.support.command_classifier import CommandClassifier
    classifier = app.container.get(CommandClassifier)
    work = lambda line: Claude().call("Bash", {"command": f"source /s 2>/dev/null || true && eval '{line}' < /dev/null && pwd -P >| /tmp/cwd"}, frozenset(), classifier).work
    assert work("sed -n 1,20p src/a.py") == "reading", "a read through the shell is reading, so the figure shows its book"
    assert work("grep -rn foo src && cat b.py") == "searching", "a line that only reads, with a search in it, is searching"
    assert work("journal search find hammer") == "searching", "the journal's own search is searching, as a grep is"
    assert work("npm run build") == "running", "anything else runs"


def checkout_commits(app: App, count: int) -> list[str]:
    """The project's checkout made a git repository, with count new empty commits in a line, oldest first."""
    root = app.config.root
    subprocess.run(["git", "init", "-q"], cwd=root, check=True)
    for number in range(count):
        subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", f"commit {number}"], cwd=root, check=True)
    log = subprocess.run(["git", "log", "--format=%H", f"-{count}"], cwd=root, capture_output=True, text=True, check=True).stdout.split()
    return log[::-1]


def install_commit(app: App, commit: str) -> None:
    (app.config.home / "src").mkdir(parents=True, exist_ok=True)
    (app.config.home / "src" / "commit").write_text(f"{commit}\n")


def test_a_journal_set_to_follow_a_branch_installs_that_branchs_head_only_when_it_is_ahead_of_the_installed_commit(app: App):
    older, installed, newer = checkout_commits(app, 3)
    install_commit(app, installed)
    user_set(app, "updates.branch", "development")
    source, installer = Source("v4.99.0", head=installed), Installer()
    updating = updating_with(app, source, installer, auto=True)
    updating.checked()
    assert source.branches_asked == [("https://github.com/jessegall/agent-journal", "development")] and source.tags_asked == [], "a followed branch is asked for its head, never the releases"
    assert installer.ran == [] and not updating.data().newer and "newest commit" in updating.line(), "the installed commit is the branch's head: nothing to install"
    source.head = older
    updating.checked()
    assert installer.ran == [] and not updating.data().newer, "a pushed head behind the installed commit, as local installs get ahead of the remote, is left alone"
    source.head = newer
    updating.checked()
    assert installer.ran == ["development"] and updating.data().latest == newer[:7] and updating.data().branch == "development", "the branch moved ahead, so its head is installed, by its name"
    assert (app.config.home / "runtime" / "update.log").read_text().endswith(f"installing development at {newer[:7]}: {newer[:12]} is ahead of the installed {installed[:12]}\n"), "the update log says which commit and why"
    assert updating.data().installed == f"development at {installed[:7]}" and updating.label() == f"development at {installed[:7]}", "what is installed is named by the branch and its commit"


def test_a_branch_head_beside_the_installed_commit_is_left_alone(app: App):
    root = checkout_commits(app, 1)[0]
    subprocess.run(["git", "checkout", "-q", "-b", "beside", root], cwd=app.config.root, check=True)
    beside = checkout_commits(app, 1)[0]
    subprocess.run(["git", "checkout", "-q", "-"], cwd=app.config.root, check=True)
    installed = checkout_commits(app, 1)[0]
    install_commit(app, installed)
    user_set(app, "updates.branch", "development")
    installer = Installer()
    updating = updating_with(app, Source(head=beside), installer, auto=True)
    updating.checked()
    assert installer.ran == [] and not updating.data().newer, "a head that does not contain the installed commit is never installed"


def test_journal_update_follow_sets_the_branch_the_journal_follows_and_unfollow_the_releases_again(app: App):
    source, installer = Source("v4.99.0", head="ccccccc3333"), Installer()
    updating = updating_with(app, source, installer, auto=False)
    console = app.console()
    followed = console.run(["update", "follow", "development"], AGENT)
    assert followed.code == 0 and followed.text.startswith("following the branch development: development at ccccccc is out") and updating.branch() == "development", "the branch is set and its head read at once"
    assert source.branches_asked == [("https://github.com/jessegall/agent-journal", "development")], "the followed branch's head is asked for"
    assert console.run(["update", "unfollow"], AGENT).text == "following the releases again\n" and updating.branch() == "", "unfollow clears the branch"


def test_a_running_codex_workers_transcript_is_found_by_its_rollouts_folder_before_its_session_is_known(app: App, tmp_path, monkeypatch):
    import json as js
    from pathlib import Path
    from journal.providers.codex import Codex
    home = tmp_path / "home"
    day = home / ".codex" / "sessions" / "2026" / "10" / "20"
    day.mkdir(parents=True)
    monkeypatch.setattr(Path, "home", staticmethod(lambda: home))
    monkeypatch.delenv("CLAUDE_CONFIG_DIR", raising=False)
    remote = day / "rollout-2026-10-20T21-00-00-aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa.jsonl"
    remote.write_text(js.dumps({"type": "session_meta", "payload": {"cwd": "/somewhere/else"}}) + "\n")
    journal_owned = day / "rollout-2026-10-20T21-58-57-01a15ae5-449b-7131-9ee4-edd40f4e3dc3.jsonl"
    journal_owned.write_text(js.dumps({"type": "session_meta", "payload": {"cwd": str(app.config.root.resolve())}}) + "\n")
    codex = Codex()
    assert codex.latest_session(app.config.root, 0.0) == "01a15ae5-449b-7131-9ee4-edd40f4e3dc3", "the newest rollout whose first line names the project's folder is the worker's conversation"
    assert codex.transcript(app.config.root, "01a15ae5-449b-7131-9ee4-edd40f4e3dc3") == journal_owned
    assert codex.latest_session(app.config.root, journal_owned.stat().st_mtime + 60) == "", "nothing newer than the time asked for"


def test_a_plugins_linked_skill_folder_is_unlinked_when_withdrawn_and_its_target_kept(app: App, tmp_path):
    from journal.features.plugins.support.plugin_skills import PluginSkills
    from journal.models.plugin import Plugin
    target = tmp_path / "published" / "echo-guide"
    target.mkdir(parents=True)
    (target / "SKILL.md").write_text("---\nplugin: echo\nname: echo-guide\n---\n# Echo\n")
    home = app.config.root / ".claude" / "skills"
    home.mkdir(parents=True, exist_ok=True)
    (home / "echo-guide").symlink_to(target)
    app.container.get(PluginSkills).withdraw(Plugin(name="echo"))
    assert not (home / "echo-guide").exists() and not (home / "echo-guide").is_symlink(), "the link is taken away"
    assert (target / "SKILL.md").is_file(), "what it pointed at is left as it was"


def test_the_classifier_reads_each_command_by_its_program_subcommands_options_wrappers_redirects_and_inner_commands(app: App):
    """CommandClassifier (task 3772): Part.tokens with assignments and wrappers taken off, value-taking flags skipped, clustered short flags and --opt=value read, inner commands classified, interpreter code uncertain by its content, an unknown program no write and an uncertain form a write."""
    from journal.support.command_classifier import CommandClassifier
    classify = app.container.get(CommandClassifier).classify_line
    expected = {
        "git log --oneline": ("version control", ("reads_files",), False), "git -C repo branch -D old": ("version control", ("changes_version_control",), False),
        "CI=1 npm --prefix web run build": ("build", ("makes_files", "reads_files", "runs_long"), False), "sed -ni p notes.txt": ("edit", ("writes_files",), False),
        "sed --in-place=.bak s/a/b/ notes.txt": ("edit", ("writes_files",), False), "timeout 30 rm -rf build": ("edit", ("deletes_files",), False),
        "uv run pytest -q": ("test run", ("reads_files", "runs_long"), False), "echo hi > /dev/null 2>&1": ("read", (), False), "echo hi >> notes.txt": ("read", ("writes_files",), False),
        "find . -name '*.pyc' -exec rm {} \\;": ("edit", ("deletes_files", "reads_files"), False), "echo $(rm x)": ("edit", ("deletes_files",), False),
        "eval 'rm x'": ("edit", ("deletes_files",), False), "black --check src": ("check", ("reads_files",), False), "./scripts/x.sh": ("unknown", (), False),
    }
    found = {line: (classify(line).command_type, classify(line).effects, classify(line).uncertain) for line in expected}
    assert found == expected, [(line, found[line]) for line in expected if found[line] != expected[line]]
    assert classify("sh -c 'rm -rf x'").is_write and classify("ssh host 'rm -rf /tmp/x'").effects == ("deletes_files", "reaches_network"), "a line handed to a shell or a host is read too"
    assert classify("python3 -c 'open(\"f\", \"w\").write(\"x\")'").uncertain and "writes_files" in classify("python3 -c 'open(\"f\", \"w\").write(\"x\")'").effects, "interpreter code is uncertain, its writes read by content"
    assert not classify("./scripts/x.sh").is_write and classify("git checkout main").is_write and classify("git checkout main").uncertain, "unknown is no write, uncertain a write"
    assert classify("cd x && make test").command_type == "test run" and classify("Get-ChildItem -Recurse").command_type == "read" and classify("Frobnicate-Thing -Now").command_type == "unknown", "a chain takes its weightiest part; a PowerShell cmdlet the table knows is read, another unknown"
    assert app.container.get(CommandClassifier) is app.container.get(CommandClassifier), "the table is read once"


def test_the_readers_of_a_call_read_the_classification_it_carries_and_an_entry_written_before_reads_back_as_written(app: App):
    """Task 3773: whether a call writes, its files, its work word, its test runs and the piped test guard are read from each part's classification, an unknown program is no write and gets a mark and a reader like any run, an uncertain form is a write, and a stored call from before the classifier keeps its write flag and files."""
    from journal.features.shell.support.activity_label import ActivityLabel
    from journal.features.shell.support.command_mark_policy import CommandMarkPolicy
    from journal.features.shell.support.piped_test_run import PipedTestRun
    from journal.support.classification import Classification
    from journal.support.command_classifier import CommandClassifier
    from journal.support.recorded_call import RecordedCall
    classifier, labels, policy = app.container.get(CommandClassifier), app.container.get(ActivityLabel), app.container.get(CommandMarkPolicy)
    call = lambda line: Claude().call("Bash", {"command": line}, frozenset(), classifier)
    tests = call("cd src && python3 -m pytest -q | tail -3")
    assert tests.test_runs() == ["python3 -m pytest -q | tail -3"] and not tests.writes and tests.work == "running" and tests.table_version == classifier.version, "a test run is a test run by its classification, never a write"
    assert PipedTestRun.piped_filter(tests.parts, {}) == "tail", "and the guard reads it piped into a filter from the part's classification"
    unknown = call("./scripts/frobnicate.sh")
    assert not unknown.writes and unknown.parts[0].classification.command_type == "unknown", "a program the table does not know is no write"
    assert not policy.takes_no_reader("./scripts/build.sh") and not labels.is_reading("./scripts/build.sh"), "and under the mark rules it is a run like any other, never a quiet read"
    assert call("git checkout main").writes and call("echo a >| f").writes and call("for f in a b; do echo $f; done > out.txt").writes, "an uncertain form, a clobbering redirect and a loop sent into a file are writes"
    old = RecordedCall.parsed({"command": "rm x", "parts": [{"text": "rm x", "is_journal": False, "writes": True, "files": ["x"], "reads_output": False, "read_shape": "rm x"}], "writes": True, "written_paths": ["x"]})
    assert old.writes and old.parts[0].writes and old.parts[0].files == ("x",) and old.parts[0].classification == Classification() and old.table_version == 0, "an entry stored before the classifier reads back with its own write flag and files"


def test_the_classifier_costs_microseconds_a_command_reads_the_table_once_and_a_stored_reader_matches_the_runs_it_did(app: App):
    """Task 3783: the table is read once and shared by the classifier, the shape and the shell runner, whose ChainWorker reads a part's write and merge flags from the parts file split once per chain; a command is classified in microseconds and kept, the cache bounded; a reader stored under the old rules matches the same runs; and a Codex line handed to a shell that is not POSIX is read whole and unknown."""
    from journal.features.shell.support.readers import Readers
    from journal.providers.codex import Codex
    from journal.support.classification_table import ClassificationTable
    from journal.support.command_classifier import CACHE_SIZE, CommandClassifier
    classifier = app.container.get(CommandClassifier)
    assert classifier.table is app.container.get(ClassificationTable) is app.container.get(CommandShape).table, "one table for every reader, read at boot"
    parts = [part for row in map(json.loads, (Path(__file__).parent / "shell_corpus.jsonl").read_text().splitlines()) for part in row["parts"]][:CLASSIFIED_PARTS]
    fresh = CommandClassifier(classifier.table, classifier.shapes)
    began = timing.monotonic()
    for part in parts:
        fresh.classify(part)
    assert (timing.monotonic() - began) / len(parts) < CLASSIFY_SECONDS, "a command is classified in well under a millisecond"
    assert all(fresh.classify(part) is fresh.cache[part] for part in parts[:50]), "and asked again it is the kept reading"
    for n in range(CACHE_SIZE + 10):
        fresh.classify(f"echo {n}")
    assert len(fresh.cache) == CACHE_SIZE, "the kept readings are bounded, so a long-running journal holds no growing cache"
    (app.config.readers).mkdir(parents=True, exist_ok=True)
    (app.config.readers / "old-tests.pattern").write_text("# the tests\n(passed|failed)\ncommands: pytest, npm run build\n")
    readers = app.container.get(Readers)
    stored = readers.found("old-tests")
    assert [line for line in ("timeout 300 python3 -m pytest -q", "cd web && npm run build 2>&1 | tail -3", "REPLAY_FREEZE=1 pytest tests/a.py") if not readers.read_part(stored, line)] == [], "a reader stored under the old rules reads the runs it read"
    assert not readers.read_part(stored, "npm test") and not readers.read_part(stored, "git log"), "and no other"
    powershell = Codex().call("Bash", {"command": ["pwsh", "-c", "Remove-Item a; Set-Content b"]}, frozenset(), classifier)
    assert [part.text for part in powershell.parts] == ["pwsh -c 'Remove-Item a; Set-Content b'"] and powershell.parts[0].classification.command_type == "unknown" and not powershell.writes, "a PowerShell line is carried with its shell, read whole and unknown"
    script = Codex().call("Bash", {"command": ["python3", "-c", "open('a/b', 'w').write('x')"]}, frozenset(), classifier)
    assert script.writes and script.parts[0].classification.is_writing_script, "code handed to python3 is never split as a shell line"


def test_generated_commands_are_read_by_every_command_reader_as_their_forms_say(app: App):
    """Task 3774: a seeded sample of commands built from the forms and chain shapes in tests/generated/forms.json, each with the classification, label and program its forms give it read from the command table; the classifier, the write gate, the splitter, the activity label, the shape, reader matching and alias matching must agree with them, and where one does not the line is frozen in tests/generated/differences.json, a file that only shrinks; CORPUS_FREEZE=1 writes it anew after review."""
    from tests.generated_commands import Generator
    from journal.features.aliases.support.alias_lines import AliasLines
    from journal.features.shell.support.activity_label import ActivityLabel
    from journal.features.shell.support.reader_commands import ReaderCommands
    from journal.models.alias import Alias
    from journal.support.chain import Chain
    from scripts.classification_coverage import labelled
    classifier, labels, shapes, alias_lines = app.container.get(CommandClassifier), app.container.get(ActivityLabel), app.container.get(CommandShape), app.container.get(AliasLines)
    began, generator, found = timing.monotonic(), Generator(seed=7), {}
    for n, command in enumerate(generator.commands(GENERATED_COMMANDS)):
        classification = classifier.classify_line(command.text)
        readings = {"classifier": (classification.command_type, classification.effects, classification.uncertain) == (command.expected.command_type, command.expected.effects, command.expected.uncertain),
                    "writes": Claude().call("Bash", {"command": command.text}, frozenset(), classifier).writes == command.expected.is_write,
                    "splitter": len([part for part in Chain.parts(command.text) if part.recorded]) == command.parts}
        for form, text in command.forms:
            shape = shapes.build(text)
            readings |= {"label": readings.get("label", True) and labels.build(text) == labelled(generator.table, form["program"], form["form"]),
                         "shape": readings.get("shape", True) and (shape.split() or [""])[0].rsplit("/", 1)[-1] == form["program"],
                         "reader": readings.get("reader", True) and ReaderCommands((form["program"],)).reads(shape),
                         "alias": readings.get("alias", True) and alias_lines.matches(Alias(name="generated", line=text), text)}
        found |= {f"{reader}:{n}": command.text for reader, agrees in readings.items() if not agrees}
    assert timing.monotonic() - began < GENERATED_SECONDS, "the generated sample stays quick enough for the suite"
    frozen = Path(__file__).parent / "generated" / "differences.json"
    if os.environ.get("CORPUS_FREEZE"):
        frozen.write_text(json.dumps(found, indent=0, sort_keys=True, ensure_ascii=False) + "\n")
    known = json.loads(frozen.read_text())
    new = {key: found[key] for key in found.keys() - known.keys()}
    assert not new, f"{len(new)} generated commands are read otherwise than their forms say, the first: {list(new.items())[:3]}"
    fixed = sorted(known.keys() - found.keys())
    assert not fixed, f"{len(fixed)} known differences are fixed: write the file anew with CORPUS_FREEZE=1 so it shrinks, the first: {fixed[:5]}"


def test_the_mark_rules_read_the_corpus_as_before_and_the_boot_seed_keeps_every_mark_the_old_rules_kept(app: App, tmp_path):
    """Task 3782: whether a line is git, a pause or a quick read, the readings the boot seed StrayCommandMarkCleanup deletes a mark by, are frozen for the corpus as the old rules read them in mark_readings_before.json, a change frozen in mark_disagreements.json; and stored marks of runs the old rules kept, a wrapped test run, a build, a project's own script, a pause before work, stay through the seed."""
    from datetime import timedelta
    from journal.features.shell.seeds.stray_command_mark_cleanup import StrayCommandMarkCleanup
    from journal.features.shell.support.activity_label import ActivityLabel
    from journal.features.shell.support.command_mark_policy import CommandMarkPolicy
    from journal.features.shell.support.git_commands import GitCommands
    from journal.models.author import Author
    from journal.models.command_output import CommandOutput
    from journal.models.message import Message
    from journal.repositories.command_outputs import CommandOutputs
    from journal.repositories.messages import Messages
    folder = Path(__file__).parent / "shell_corpus_reading"
    rows = [json.loads(line) for line in (Path(__file__).parent / "shell_corpus.jsonl").read_text().splitlines()]
    before = {name: set(numbers) for name, numbers in json.loads((folder / "mark_readings_before.json").read_text()).items()}
    labels, policy, git = app.container.get(ActivityLabel), app.container.get(CommandMarkPolicy), app.container.get(GitCommands)
    readings = {"git": git.is_git_line, "pause": policy.is_pause, "quick_read": labels.is_reading}
    found = {f"{name}:{n}": n in before[name] for name, read in readings.items() for n, row in enumerate(rows, 1) if read(row["line"]) != (n in before[name])}
    frozen = folder / "mark_disagreements.json"
    if os.environ.get("CORPUS_FREEZE"):
        frozen.write_text(json.dumps(found, indent=0, sort_keys=True) + "\n")
    known = json.loads(frozen.read_text())
    changed = {key: rows[int(key.split(":")[1]) - 1]["line"][:100] for key in found.keys() ^ known.keys()}
    assert not changed, f"{len(changed)} mark readings changed from the frozen ones, the first: {list(changed.items())[:3]}"
    assert not any(key.startswith(("git:", "pause:")) for key in known) and all(not old for old in known.values()), "git and pauses read as before; only a read the table now reads through, as \\ls, command ls or a sed of a log, is newly a quick read"
    outputs, messages = app.container.get(CommandOutputs), app.container.get(Messages)
    with app.container.get(Scope).environment(MAIN):
        kept = []
        for number, line in enumerate(("timeout 300 npm test", "sudo make install", "./scripts/build.sh", "sleep 5 && make release", "npx vitest run", "env CI=1 python3 -m pytest -q"), 1):
            output = outputs.save(CommandOutput(chain=line, command=line, folder=str(tmp_path / f"run-{number}"), ended=True, status=0, moved=True), Actor.system())
            output = outputs.save(output.with_(created_at=output.creation_time - timedelta(seconds=40)), Actor.system())
            kept.append(messages.save(Message(environment_id=MAIN, author=Author.SYSTEM, text="A run", data={"kind": "card", "shows": "commands", "output": output.id, "card_type": "process"}), Actor.system()))
        app.container.get(StrayCommandMarkCleanup).run()
        assert all(messages.matching(id=card.id) for card in kept), "every mark of a run the old rules kept stays through the boot seed"
        assert not policy.takes_no_reader("./scripts/build.sh") and not labels.is_reading("./scripts/build.sh"), "a program the table does not know is a run under the mark rules"


def test_a_stored_call_keeps_its_parts_fields_and_its_doing_labels_stay_as_history(app: App):
    """Task 3782: CommandPart keeps writes, files, reads_output and read_shape as stored fields beside the classification, writes and files filled from it and the output read's two from the line; a part stored before reads back with them, and a part's doing label stored by the shell record stays as it was written, whatever the table now names the command."""
    from journal.http.agents.bar_row import BarRow
    from journal.models.entry import Entry
    from journal.support.command_part import CommandPart
    from journal.support.command_text import CommandText
    stored = CommandPart.parsed({"text": "journal output read 7 | tail", "is_journal": True, "writes": False, "files": [], "reads_output": True, "read_shape": "journal output read <output> | tail"})
    assert (stored.writes, stored.files, stored.reads_output, stored.read_shape, stored.classification.command_type, stored.shape) == (False, (), True, "journal output read <output> | tail", "unknown", ""), "a part stored before reads back with its own fields"
    fresh = Claude().call("Bash", {"command": "rm build/x.txt"}, frozenset(), CLASSIFIER).parts[0]
    assert fresh.writes == fresh.classification.is_write and fresh.files == ("build/x.txt",) and fresh.shape == "rm" and not fresh.reads_output, "a new part's writes and files are its classification's, beside it"
    from journal.features.shell.support.activity_label import ActivityLabel
    from journal.features.shell.support.shell_record import PART_START
    entry = Entry(environment_id=MAIN, entry_type=PART_START, data={"chain": "c1", "part": "sudo apt-get install -y curl", "doing": "running sudo", "time": 1.0})
    assert BarRow.build(entry, CommandText(SHAPES)).verb == "running sudo" and app.container.get(ActivityLabel).build("sudo apt-get install -y curl") == "installing", "the label stored then is shown as history, though the table now names the run installing"


def test_the_classifier_reads_through_groups_loops_test_scripts_and_wrappers_and_names_the_files_a_command_writes_or_prints(app: App):
    """Task 3773: the table is the one place a program's meaning lives, so a subshell, a loop's body, a test script by its name, a time limit, a container and npm exec are read through by the classifier, and the files a part writes or prints, and the command a process runs, are read from it too."""
    from journal.features.shell.support.activity_label import ActivityLabel
    from journal.support.command_classifier import CommandClassifier
    classifier, labels = app.container.get(CommandClassifier), app.container.get(ActivityLabel)
    runs = ["(cd x && pytest -q)", "for f in a b; do pytest $f; done", "./scripts/test.sh", "python3 scripts/suite.py", "perl -e 'alarm 60; exec @ARGV' npx vitest run",
            "docker run --rm -v x:/app node:20 npm test", "kubectl exec pod -- pytest", "npm --prefix web exec -- vitest run", "npm test 2>&1 | tee log"]
    assert [line for line in runs if not classifier.classify_line(line).is_test_run] == [], "each is a test run, read through what wraps it"
    assert not classifier.classify_line("perl -e 'print 1' f").is_test_run and labels.build("command -v jq") == "running command", "code that is no time limit, and a lookup, wrap nothing"
    assert classifier.classify_line("(cd x && pytest -q)").label == "testing" and labels.build("sed -i '' s/a/b/ f") == "editing" and labels.build("yarn") == "installing", "labels are rows of the table: a chain's is its weightiest part's"
    assert classifier.target_paths("cp a.py b.py") == ("a.py", "b.py") and classifier.target_paths("echo hi > notes.txt") == ("notes.txt",) and classifier.target_paths("npm run build") == (), "an edit names its files, a build does not"
    assert "x.py" in classifier.read_paths("sed -n 1,5p x.py") and classifier.read_paths("grep -rn x src") == (), "a printing read names its files, a search does not"
    assert classifier.process_command("docker exec -w /src t go test ./...") == "go test ./..." and classifier.process_command("make check") == "", "a process is known by what runs beneath its wrapper"


def test_a_hook_on_a_started_plan_reads_the_plans_tree_once(app: App, monkeypatch):
    """The plans data reader reads the started plan's tasks and phases once per event, whatever their number: a plan of thirty tasks in three phases costs a hook a bounded number of statements."""
    from journal.db.connection import Connection
    console = app.console()
    console.run(["plan", "create", "big", "--brief", "many tasks"], USER)
    for phase in range(1, 4):
        console.run(["plan", "phase", "1", f"phase {phase}", "--when", "done"], USER)
        for number in range(10):
            console.run(["plan", "add", "1", f"task {phase}.{number}"], USER)
        console.run(["plan", "todos", "1", str(phase), *(str(n) for n in range(1 + (phase - 1) * 10, 1 + phase * 10))], USER)
    console.run(["plan", "approve", "1"], USER)
    console.run(["plan", "start", "1"], AGENT)
    hook(app, "SessionStart")
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})
    import threading
    from collections import Counter
    statements = []
    execute = Connection.execute

    def counted(self, sql, params=()):
        if threading.current_thread().name != "deferred":
            statements.append(sql)
        return execute(self, sql, params)
    monkeypatch.setattr(Connection, "execute", counted)
    assert hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})[0] == 200
    selects = Counter(sql for sql in statements if sql.lstrip().upper().startswith("SELECT"))
    assert sum(selects.values()) < 90, f"a hook on a started plan of thirty tasks ran {sum(selects.values())} selects, the plan's tree is read once per event and not once per question; the most frequent: {selects.most_common(6)}"


def test_a_return_after_a_send_back_is_no_first_report_and_its_load_item_is_a_repeat(app: App, monkeypatch):
    from journal.features.workers.support.load_items import LoadItems
    from journal.features.workers.support.worker_runner import WorkerRunner
    from journal.repositories.agents import Agents
    from journal.repositories.workers import Workers
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, actor: None)
    kept_conversation(app, monkeypatch)
    console = app.console()
    hook(app, "SessionStart")
    console.run(["task", "create", "the parser", "--brief", "the parser reads the grammar"], AGENT)
    console.run(["worker", "dispatch", "Lady Lovelace", "--task", "1", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet"], AGENT)
    workers = app.container.get(Workers)
    with app.container.get(Scope).environment(MAIN):
        workers.save(workers.find(1).with_(token_hash="h", session="w-1", resume="w-1").ready(1.0), Actor.system())
    lovelace = Caller.worker("main", 1, "w-1", "claude")
    console.run(["proof", "1", "parser.py:12, test_reads passes"], lovelace)
    assert console.run(["clock-out", "the parser is done"], lovelace).code == 0
    app.runtime().deferred.drain()
    assert console.run(["worker", "check", "1", "1", "--short", "the rules are not named"], AGENT).code == 0
    app.runtime().deferred.drain()
    with app.container.get(Scope).environment(MAIN):
        workers.save(workers.find(1).ready(2.0), Actor.system())
    console.run(["proof", "1", "parser.py:14, test_names passes"], lovelace)
    assert console.run(["clock-out", "the rules are named"], lovelace).code == 0
    app.runtime().deferred.drain()
    with app.container.get(Scope).environment(MAIN):
        items, _ = app.container.get(LoadItems).read(0.0)
        reports = app.container.get(Agents).session_agent("s1").first_reports
    worker_items = [item for item in items if item.ref == "workers:1"]
    assert [task for _, task in reports] == [1], "the clock-out that ends the job sent is a first report; the return after the send-back is not"
    assert [item.is_repeat for item in worker_items] == [False, True], "the load holds both clock-outs, the second marked a repeat"


def test_only_a_merge_a_checked_proof_or_a_reply_clears_a_waiting_item(app: App):
    from journal.features.workers.support.load_item import LoadItem
    from journal.features.workers.support.load_items import LoadItems
    from journal.features.workers.support.load_series import LoadSeries
    from journal.models.worker import Worker
    from journal.models.support.worker_moves import WorkerMoves
    from journal.repositories.workers import Workers
    workers = app.container.get(Workers)
    moves = lambda *steps: WorkerMoves(tuple(steps))
    with app.container.get(Scope).environment(MAIN):
        merged = workers.save(Worker(environment_id=1, name="Mr. Merged", brief="m", moves=moves(("dispatched", 10.0), ("clocked out", 100.0), ("merged", 200.0))), Actor.system())
        sent_back = workers.save(Worker(environment_id=1, name="Mr. Back", brief="b", moves=moves(("dispatched", 10.0), ("clocked out", 100.0), ("sent back", 150.0))), Actor.system())
        released = workers.save(Worker(environment_id=1, name="Mr. Gone", brief="g", moves=moves(("dispatched", 10.0), ("clocked out", 100.0), ("released", 160.0))), Actor.system())
        items = {item.ref: item for worker in (merged, sent_back, released) for item in app.container.get(LoadItems).worker_items(worker)}
    assert items[f"workers:{merged.id}"].cleared_at == 200.0, "a merge clears the item"
    assert items[f"workers:{sent_back.id}"].cleared_at == 0.0 and items[f"workers:{sent_back.id}"].ended_at == 150.0, "a send-back ends it without a clearing"
    assert items[f"workers:{released.id}"].ended_at == 160.0 and not items[f"workers:{released.id}"].is_waiting(170.0)
    load = LoadSeries(30, 10, 0.8, 0.3).measured(list(items.values()), [], 300.0)
    assert (load.clearings_counted, load.removals) == (1, 2), "the load counts the merge as a clearing and the send-back and the release as removals"
    replied = LoadItem("messages:1", 50.0, 1.0, 60.0)
    assert replied.is_cleared_in(0.0, 100.0) and not LoadItem("messages:2", 50.0, 1.0).is_cleared_in(0.0, 100.0), "a reply clears a message; one with only a reaction stays waiting"


def test_a_codex_main_agents_patch_and_commit_land_in_its_own_series(app: App):
    from journal.events.announcer import Announcer
    from journal.events.moments.git_committed import GitCommitted
    from journal.repositories.agents import Agents
    from tests.agent_hooks import hook_as
    hook_as(app, "codex", "SessionStart", "c1", source="startup")
    patch = "*** Begin Patch\n*** Add File: src/footer.py\n+FOOTER = 1\n+SHOP = 2\n*** End Patch"
    hook_as(app, "codex", "PreToolUse", "c1", tool_name="apply_patch", tool_input={"command": patch})
    hook_as(app, "codex", "PostToolUse", "c1", tool_name="apply_patch", tool_input={"command": patch}, tool_response={"output": "Success"})
    app.runtime().deferred.drain()
    with app.container.get(Scope).environment(MAIN):
        app.container.get(Announcer).announce(GitCommitted(environment_id=1, session="c1", sha="c0ffee", branch="main", subject="the footer", files=1, lines=(("src/footer.py", 2),)))
        row = app.container.get(Agents).session_agent("c1")
    assert sum(lines for _, lines in row.edited_lines) == 2, "a Codex agent's patch counts as its provisional lines, as a Claude agent's edit does"
    assert [lines for _, lines in row.committed_lines] == [2], "and its commit counts once as its own"


def test_a_workers_edit_reaches_the_plugin_that_asks_for_workers_and_not_the_one_that_does_not(app: App):
    from journal.models.worker import Worker
    from journal.repositories.workers import Workers
    from journal.support.listener_queue import ListenerQueue
    echo(app, "asks", hears=["file_edited"], reaches={"file_edited": ["workers"]})
    echo(app, "silent", hears=["file_edited"])
    hook(app, "SessionStart")
    app.console().run(["environment", "overview"], AGENT)
    with app.container.get(Scope).environment(1):
        app.container.get(Workers).save(Worker(environment_id=1, name="Mr. Babbage", brief="b", session="w1"), Actor.system())
    edit = {"file_path": str(app.config.root / "a.py"), "old_string": "x", "new_string": "y"}
    patch = {"structuredPatch": [{"oldStart": 1, "newStart": 1, "lines": ["-x", "+y"]}]}
    worker = lambda type_name, **body: posted(app, "/hooks/claude", {"hook_event_name": type_name, "session_id": "w1", **body}, {"X-Journal-Env": "main"})
    worker("PreToolUse", tool_name="Edit", tool_input=edit)
    worker("PostToolUse", tool_name="Edit", tool_input=edit, tool_response=patch)
    app.container.get(ListenerQueue).drain()
    assert echo_heard(app, "asks") == ["file_edited"], "the plugin whose manifest says file_edited reaches workers hears the worker's edit"
    assert echo_heard(app, "silent") == [], "the one that does not ask is left out"
    hook(app, "PreToolUse", tool_name="Edit", tool_input=edit)
    hook(app, "PostToolUse", tool_name="Edit", tool_input=edit, tool_response=patch)
    app.container.get(ListenerQueue).drain()
    assert echo_heard(app, "silent") == ["file_edited"] and echo_heard(app, "asks") == ["file_edited", "file_edited"], "the main agent's edit reaches both, as before"
    from journal.events.agent.tool_starting import ToolStarting
    from journal.features.plugins.support.plugin_relay import PluginRelay
    from journal.models.agent import Agent
    from journal.repositories.agents import Agents
    from journal.repositories.plugins import Plugins
    from journal.support.agent_role import AgentRole
    from journal.features.registry import Registry
    plugins, relay = app.container.get(Plugins), app.container.get(PluginRelay)
    reaching = lambda role: [plugin.name for plugin in plugins.hearers("file_edited", None, lambda manifest: app.container.get(Registry).role_file(role).reaches_plugin(manifest, "file_edited"))]
    assert reaching(AgentRole.WORKER) == ["asks"] and reaching(AgentRole.REVIEWER) == reaching(AgentRole.VERIFIER) == reaching(AgentRole.SUBAGENT) == [], "a manifest that reaches workers reaches no reviewer, verifier or researcher"
    with app.container.get(Scope).environment(1):
        app.container.get(Agents).save(Agent(environment_id=1, session="rv", provider="claude", state="reviewing", role=AgentRole.REVIEWER), Actor.system())
        app.container.get(Agents).save(Agent(environment_id=1, session="s1:a1", provider="claude", state="researching", role=AgentRole.SUBAGENT), Actor.system())
    read = ToolCall(tool="Read", input={}, operation=Claude().operation("Read", {}))
    assert relay.helper_role(ToolStarting(agent=agent_row(app), call=read).placed(Agent(environment_id=1, session="rv", provider="claude", role=AgentRole.REVIEWER), None, 1.0)) == AgentRole.REVIEWER and relay.helper_role(ToolStarting(agent=agent_row(app), call=read).placed(Agent(environment_id=1, session="s1:a1", provider="claude", role=AgentRole.SUBAGENT), None, 1.0)) == AgentRole.SUBAGENT, "a reviewer's and a subagent's events are known as theirs, never the main agent's"


def test_a_workers_sinful_edit_is_answered_with_the_plugins_mark_where_the_plugin_holds_the_edit_or_only_hears_it(app: App):
    from journal.models.worker import Worker
    from journal.repositories.workers import Workers
    from journal.support.listener_queue import ListenerQueue
    user_set(app, "plugins.hold_window_ms", PARALLEL_HOLD_WINDOW_MS)
    echo(app, "judge", hears=["file_edited"], holds=["file_edited"], reaches={"file_edited": ["workers"]})
    echo(app, "watcher", hears=["file_edited"], reaches={"file_edited": ["workers"]})
    hook(app, "SessionStart")
    app.console().run(["environment", "overview"], AGENT)
    from journal.models.support.ref import Ref
    from journal.models.task import Task
    from journal.repositories.tasks import Tasks
    with app.container.get(Scope).environment(1):
        babbage = app.container.get(Workers).save(Worker(environment_id=1, name="Mr. Babbage", brief="b", session="w1"), Actor.system())
        tasks = app.container.get(Tasks)
        tasks.handover(tasks.save(Task(environment_id=1, title="the parser", brief="the parser reads"), Actor.system()), Ref.build(babbage), Actor.system())
        app.container.get(Workers).save(babbage.ready(1.0), Actor.worker(babbage.id))
    edit = {"file_path": str(app.config.root / "sinful.py"), "old_string": "x", "new_string": "y"}
    patch = {"structuredPatch": [{"oldStart": 1, "newStart": 1, "lines": ["-x", "+y"]}]}
    worker = lambda type_name, **body: posted(app, "/hooks/claude", {"hook_event_name": type_name, "session_id": "w1", **body}, {"X-Journal-Env": "main"})
    worker("PreToolUse", tool_name="Edit", tool_input=edit)
    _, finished = worker("PostToolUse", tool_name="Edit", tool_input=edit, tool_response=patch)
    app.container.get(ListenerQueue).drain()
    _, next_tool = worker("PreToolUse", tool_name="Read", tool_input={"file_path": str(app.config.root / "a.py")})
    said = json.dumps([finished, next_tool])
    assert "[plugin judge] echo found a sin in" in said, "the plugin that holds the edit has its mark in the worker's answer"
    assert "[plugin watcher] echo found a sin in" in said, "and the one that only hears it has its mark at the worker's next tool"


def test_a_manifest_says_who_an_event_reaches_only_for_an_event_it_hears_and_only_workers_or_subagents(app: App):
    from journal.features.plugins.support.manifest_reader import ManifestReader
    from journal.support.agent_role import AgentRole
    from journal.support.rejection import Rejection
    reader = app.container.get(ManifestReader)
    folder = app.config.root / "reach"
    folder.mkdir()
    (folder / "run").write_text("#!/bin/sh\n")
    base = {"name": "reach", "version": "1", "program": "run", "journal": "0.0.1", "hears": ["file_edited"]}
    for reaches, refused in (({"file_edited": ["workers"]}, False), ({"idle": ["workers"]}, True), ({"file_edited": ["everyone"]}, True)):
        (folder / "journal-plugin.json").write_text(json.dumps({**base, "reaches": reaches}))
        if refused:
            with pytest.raises(Rejection):
                reader.read(folder)
        else:
            assert reader.read(folder).reaches_role("file_edited", AgentRole.WORKER)


def test_a_brief_reads_as_its_points_and_proofs_and_to_do_items_are_rows_of_their_task(app: App):
    from journal.events.rows.worker_delivered import WorkerDelivered
    from journal.events.rows.worker_merged import WorkerMerged
    from journal.events.rows.worker_ready import WorkerReady
    from journal.events.rows.worker_released import WorkerReleased
    from journal.models.proof import Proof
    from journal.models.proof_state import ProofState
    from journal.models.task import Task
    from journal.models.worker import Worker
    from journal.repositories.proofs import Proofs
    from journal.repositories.tasks import Tasks
    from journal.repositories.worker_todos import WorkerTodos
    assert Task(brief="The parser:\n- reads the grammar\n- names each rule\n2. passes its test").points() == ("reads the grammar", "names each rule", "passes its test"), "a brief's bullets are its points"
    assert Task(brief="the parser reads the grammar").points() == ("the parser reads the grammar",), "a brief with no bullets is one point"
    with app.container.get(Scope).environment(MAIN):
        task = app.container.get(Tasks).save(Task(environment_id=1, title="the parser", brief="- reads\n- names"), Actor.system())
        proofs, todos = app.container.get(Proofs), app.container.get(WorkerTodos)
        proofs.added(Proof(environment_id=1, point=2, text="test_names passes"), task, Actor.worker(1))
        proofs.added(Proof(environment_id=1, point=1, text="it reads the sample", state=ProofState.UNFINISHED), task, Actor.worker(1))
        assert [(p.point, p.text, p.state) for p in proofs.task_proofs(task)] == [(1, "it reads the sample", ProofState.UNFINISHED), (2, "test_names passes", ProofState.SHOWN)], "a proof is saved and read back with its task, by point"
        for text in ("write the grammar", "write the test", "run it"):
            todos.appended(task, text, Actor.worker(1))
        assert [(item.position, item.text) for item in todos.task_items(task)] == [(1, "write the grammar"), (2, "write the test"), (3, "run it")], "the to-do items are kept in order"
    worker = Worker(id=7, environment_id=1, name="Lady Lovelace")
    moves = [(worker.ready(1.0), WorkerReady, "clocked in"), (worker.delivered(2.0), WorkerDelivered, "clocked out"), (worker.merged(7, 3.0), WorkerMerged, "merged"), (worker.released(4.0), WorkerReleased, "released")]
    assert all(isinstance(moved.events[-1], type_name) and moved.state == state for moved, type_name, state in moves), "each state change of a worker carries its event"


def test_a_clock_out_naming_no_test_is_refused_with_the_changed_files_and_the_tests_its_change_touches_run_too(app: App, monkeypatch):
    from journal.repositories.task_logs import TaskLogs
    from journal.repositories.tasks import Tasks
    console = app.console()
    for argv in (["init", "-q", "-b", "main"], ["-c", "user.email=t@example.com", "-c", "user.name=T", "commit", "-q", "--allow-empty", "-m", "start"]):
        subprocess.run(["git", *argv], cwd=app.config.root, capture_output=True, timeout=30)
    hook(app, "SessionStart")
    assert console.run(["tests", "command", "test", "--proof", "1 = 1"], AGENT).code == 0
    _, folder, caller = worktree_worker(app, monkeypatch, "the job")
    committed(folder, "notes.md", "note\n")
    assert console.run(["proof", "1", "notes.md:1, test 1 = 1 passes"], caller).code == 0
    bare = console.run(["clock-out", "done", "--tests=-q"], caller)
    assert bare.code != 0 and "name the tests for" in bare.error and "notes.md" in bare.error, f"a --tests naming no test is refused, naming the files changed: {bare.error}"
    user_set(app, "workers.affected_tests_command", "sh -c 'echo 2 = 2' affected")
    out = console.run(["clock-out", "done", "--tests", "1 = 1"], caller)
    assert out.code == 0 and "you did not name too: 2 = 2" in out.text, out.error
    with app.container.get(Scope).environment(MAIN):
        logs = [log.line for log in app.container.get(TaskLogs).logs(app.container.get(Tasks).find(1))]
    assert "tests passed at clock-out: test 1 = 1 && test '2 = 2'" in logs, f"the tests the change touches run beside the worker's own: {logs}"


def test_the_journal_runs_a_workers_named_tests_at_clock_out_and_only_a_passing_run_lets_it_stand(app: App, monkeypatch):
    from journal.models.worker_state import WorkerState
    from journal.repositories.messages import Messages
    from journal.repositories.task_logs import TaskLogs
    from journal.repositories.tasks import Tasks
    from journal.repositories.workers import Workers
    settings, console = app.container.get(SettingRows), app.console()
    for argv in (["init", "-q", "-b", "main"], ["-c", "user.email=t@example.com", "-c", "user.name=T", "commit", "-q", "--allow-empty", "-m", "start"]):
        subprocess.run(["git", *argv], cwd=app.config.root, capture_output=True, timeout=30)
    hook(app, "SessionStart")
    console.run(["task", "create", "the job 1", "--brief", "the job"], AGENT)
    failed_proof = console.run(["tests", "command", "test", "--proof", "1 = 2"], AGENT)
    assert failed_proof.code != 0 and "is not set" in failed_proof.error and not settings.option(WorkersOptions.TEST_COMMAND), "a test command whose proof run fails is not set"
    assert console.run(["tests", "command", "test", "--proof", "1 = 1"], AGENT).code == 0
    assert (settings.option(WorkersOptions.TEST_COMMAND), settings.option(WorkersOptions.TEST_COMMAND_PROOF)) == ("test", "1 = 1"), "a passing proof sets the command and keeps what proved it"
    worker, folder, caller = worktree_worker(app, monkeypatch, "the job")
    assert console.run(["proof", "1", "a.py:1, test_a passes"], caller).code == 0
    assert "--tests" in console.run(["clock-out", "done"], caller).error, "a clock-out names the tests the journal is to run"
    red = console.run(["clock-out", "done", "--tests", "1 = 2"], caller)
    with app.container.get(Scope).environment(MAIN):
        assert red.code != 0 and "did not pass" in red.error and app.container.get(Workers).find(worker.id).state != WorkerState.DELIVERED, "a failing run refuses the clock-out in the worker's own session, and nothing is reported"
    assert console.run(["clock-out", "done", "--tests", "1 = 1"], caller).code == 0
    app.runtime().deferred.drain()
    with app.container.get(Scope).environment(MAIN):
        assert app.container.get(Workers).find(worker.id).state == WorkerState.DELIVERED, "a passing run lets the clock-out stand"
        assert any(log.line == "tests passed at clock-out: test 1 = 1" for log in app.container.get(TaskLogs).logs(app.container.get(Tasks).find(1))), "the task records the run that passed, for the agent checking the proofs"
        cards = [message for message in app.container.get(Messages).all() if str(message.data.get("key", "")).startswith("test-run:")]
    assert [(card.text, card.data["active"], card.session) for card in cards] == [("1 of its tests failed", False, "s1"), ("Its tests passed", False, "s1")], "each run is a card in the chat of the agent that sent the worker, ending failed or passed"
    assert [(card.data["line"], card.data["summary"], card.data["proof_task"]) for card in cards] == [("test 1 = 2", "1 failed", 1), ("test 1 = 1", "passed", 1)], "each card opens to the command it ran and how it ended, its run's output when one was kept, and drafts the worker's task with its proofs"
    assert {card.data["shows"] for card in cards} == {"worker_tests"}, "a worker's test run is a kind of mark of its own, which the chat shows until the user hides it"
    from journal.features.workers.feature import Workers as WorkersFeature
    assert next(type_name for type_name in WorkersFeature.card_types if type_name.key == "worker_tests").shown is True


def test_a_worker_stopped_at_the_usage_limit_waits_for_it_and_goes_on_by_itself_when_it_resets(app: App, monkeypatch):
    from journal.events.bus import Bus
    from journal.events.clock_ticked import ClockTicked
    from journal.features.workers.listeners.limit_resumes import RESUME_JOB
    from journal.features.workers.support.worker_runner import WorkerRunner
    from journal.repositories.entries import Entries
    from journal.repositories.workers import Workers
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, actor: None)
    kept_conversation(app, monkeypatch)
    console = app.console()
    hook(app, "SessionStart")
    console.run(["task", "create", "the parser", "--brief", "the parser is written"], AGENT)
    console.run(["worker", "dispatch", "Lady Lovelace", "--task", "1", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet"], AGENT)
    runner = app.container.get(WorkerRunner)
    with app.container.get(Scope).environment(MAIN):
        workers = app.container.get(Workers)
        worker = workers.save(workers.find(1).with_(token_hash="h", resume="lovelace-session"), Actor.system())
        started_run(runner, app.container.get(Workers), worker, ["sh", "-c", "echo \"You've hit your session limit · resets 8:10am\""], Actor.agent("s1"))
        waiting = workers.find(1)
        assert waiting.state == WorkerState.LIMITED and waiting.resumes_at > timing.time(), "the run is marked waiting for the usage limit, never ended without clocking out"
        assert timing.strftime("%H:%M", timing.localtime(waiting.resumes_at)) == "08:10", "the reset time is read from the provider's line"
        told = [entry.data["line"] for entry in app.container.get(Entries).kind_entries("nudge") if entry.data["key"] == "workers.worker_waits_for_the_usage_limit"]
        assert told == [WorkersNudges.WORKER_LIMITED.create(n=1, at="08:10").rendered()], told
        assert not [entry for entry in app.container.get(Entries).kind_entries("nudge") if entry.data["key"] == "workers.run_unfinished"], "nor is it told as a run that ended unfinished"
    app.container.get(Bus).dispatch_guarded(ClockTicked(time=waiting.resumes_at - 60))
    with app.container.get(Scope).environment(MAIN):
        assert app.container.get(Workers).find(1).state == WorkerState.LIMITED, "before the reset it waits"
    app.container.get(Bus).dispatch_guarded(ClockTicked(time=waiting.resumes_at))
    with app.container.get(Scope).environment(MAIN):
        sent = app.container.get(Workers).find(1)
        assert sent.state == WorkerState.DISPATCHED and RESUME_JOB in sent.brief and sent.resume == "lovelace-session", "at the reset time it is sent on in its own session"


def test_a_worker_whose_run_ends_without_clocking_out_keeps_its_task_held_until_released(app: App, monkeypatch):
    from journal.features.workers.support.worker_runner import TIMEOUT_STATUS, WorkerRunner
    from journal.models.support.ref import Ref
    from journal.models.worker import Worker
    from journal.repositories.tasks import Tasks
    from journal.repositories.workers import Workers
    from journal.repositories.entries import Entries
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, actor: None)
    console = app.console()
    hook(app, "SessionStart")
    for title in ("the parser", "the lexer"):
        console.run(["task", "create", title, "--brief", f"{title} is written"], AGENT)
    console.run(["worker", "dispatch", "Lady Lovelace", "--task", "1", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet"], AGENT)
    console.run(["worker", "dispatch", "Mr. Babbage", "--task", "2", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet"], AGENT)
    runner, tasks = app.container.get(WorkerRunner), app.container.get(Tasks)
    with app.container.get(Scope).environment(MAIN):
        workers = app.container.get(Workers)
        started_run(runner, app.container.get(Workers), workers.find(1), ["sh", "-c", "echo I gave up early"], Actor.agent("s1"))
        lovelace = workers.find(1)
        assert lovelace.state == WorkerState.UNFINISHED and "I gave up early" in lovelace.run_end, "a run that ends before clock in keeps what it printed as the end of its run"
        assert tasks.holder(tasks.find(1)) == Ref(Worker.table(), 1), "and its task stays held"
        babbage = workers.save(workers.find(2).with_(token_hash="h"), Actor.system())
        runner.finish(babbage, TIMEOUT_STATUS, Actor.agent("s1"))
        assert workers.find(2).state == WorkerState.UNFINISHED and tasks.holder(tasks.find(2)) == Ref(Worker.table(), 2), "a run past its time keeps its task held too"
    with app.container.get(Scope).environment(MAIN):
        told = [entry for entry in app.container.get(Entries).kind_entries("nudge") if entry.data["key"] == "workers.run_unfinished"]
    assert [entry.data["session"] for entry in told] == ["s1", "s1"], "the main agent is told each time"
    assert console.run(["worker", "release", "1"], AGENT).code == 0
    with app.container.get(Scope).environment(MAIN):
        assert tasks.holder(tasks.find(1)) is None and app.container.get(Workers).find(1).state == WorkerState.RELEASED, "a release frees the task"
    assert "Mr. Babbage" in console.run(["worker", "open"], AGENT).text, "a worker that ended without clocking out is listed to act on"
    assert console.run(["worker", "complete", "2", "--why", "the lexer is dropped"], AGENT).code == 0
    assert "Mr. Babbage" not in console.run(["worker", "open"], AGENT).text, "once completed it is retired and leaves the open list"


def test_the_worker_profiles_teach_the_turn_and_a_custom_one_starts_with_it(app: App):
    from journal.features.profiles.support.profile_files import JOURNAL_TESTING_INSTRUCTION, TURN, ProfileFiles
    from journal.providers.support.profile import Profile
    from journal.providers.support.profile_type import ProfileType
    files = app.container.get(ProfileFiles)
    files.write_all()
    for name in ("journal-senior", "journal-medior"):
        body = files.read(name)["body"]
        assert "journal clock-in" in body and "journal todo add" in body and "journal proof <point>" in body and "journal clock-out" in body and "Commit nothing" not in body, f"{name} teaches the turn"
    files.save(Profile("cartographer", "Draws maps", "Read, Edit", "You draw the map the brief asks for.", ProfileType.WORKER), "sonnet", "")
    assert files.worker_instructions("cartographer").startswith(TURN + "\n\nYou draw the map"), "a worker on a custom profile is told the turn first"
    assert files.worker_instructions("journal-medior") == f"{files.read('journal-medior')['body']}\n\n{JOURNAL_TESTING_INSTRUCTION}", "a shipped one says it once, then that its tests and builds are queued with the journal"
    assert "journal tests turn" in files.worker_instructions("cartographer") and "journal build" in files.worker_instructions("cartographer"), "and so does a custom one"
    assert [(o.key, o.default) for o in (WorkersOptions.TEST_RUNS, WorkersOptions.TEST_WAITING, WorkersOptions.TEST_ID_LIMIT, WorkersOptions.TEST_RUN_MINUTES, WorkersOptions.FAILING_RUNS)] == [("workers.test_runs", 3), ("workers.test_waiting", ""), ("workers.tests_per_run", 20), ("workers.test_run_minutes", 10), ("workers.failing_runs", 3)]


def test_a_new_workers_run_that_ends_never_merges_its_work(app: App, monkeypatch):
    import subprocess
    from journal.features.workers.support.worker_runner import WorkerRunner
    from journal.repositories.workers import Workers
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, actor: None)
    root = app.config.root
    git = lambda *argv, cwd=root: subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", *argv], cwd=cwd, capture_output=True, text=True, timeout=30)
    git("init", "-q", "-b", "main")
    (root / ".gitignore").write_text(".journal/\n")
    git("add", ".gitignore")
    git("commit", "-qm", "start")
    head = git("rev-parse", "HEAD").stdout.strip()
    hook(app, "SessionStart")
    console = app.console()
    for n in (1, 2):
        console.run(["task", "create", f"piece {n}", "--brief", f"piece {n} is written"], AGENT)
        console.run(["worker", "dispatch", f"worker {n}", "--task", str(n), "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet", "--worktree", "--no-libraries"], AGENT)
    runner, branch = app.container.get(WorkerRunner), app.container.get(WorkerBranch)
    commit = ["sh", "-c", "echo x > piece.txt && git add piece.txt && git -c user.email=t@t -c user.name=t commit -qm piece && echo written"]
    with app.container.get(Scope).environment(MAIN):
        workers = app.container.get(Workers)
        started_run(runner, app.container.get(Workers), workers.find(1), commit, Actor.agent("s1"))
        subprocess.run(commit, cwd=app.container.get(WorkerBranch).place(workers.find(2)), capture_output=True, timeout=30)
        runner.finish(workers.save(workers.find(2).with_(token_hash="h").delivered(1.0), Actor.system()), 0, Actor.agent("s1"))
        assert git("rev-parse", "HEAD").stdout.strip() == head and not (root / "piece.txt").exists(), "neither run's end, unfinished or clocked out, moves the project's head"
        assert all(git("rev-parse", "--verify", "-q", branch.name(workers.find(n))).returncode == 0 for n in (1, 2)), "and each keeps its branch for its merge"


def test_saving_a_proof_a_check_or_a_to_do_item_moves_its_tasks_updated_at(app: App):
    import time as clock
    from journal.models.proof import Proof
    from journal.models.task import Task
    from journal.repositories.proofs import Proofs
    from journal.repositories.tasks import Tasks
    from journal.repositories.worker_todos import WorkerTodos
    with app.container.get(Scope).environment(MAIN):
        tasks, proofs, todos = app.container.get(Tasks), app.container.get(Proofs), app.container.get(WorkerTodos)
        task = tasks.save(Task(environment_id=1, title="the parser", brief="the parser reads"), Actor.system())
        stamps = [tasks.find(task.id).updated_at]
        def moved() -> bool:
            app.runtime().deferred.drain()
            stamps.append(tasks.find(task.id).updated_at)
            return stamps[-1] > stamps[-2]
        clock.sleep(0.01)
        proof = proofs.added(Proof(environment_id=1, point=1, text="parser.py:1"), task, Actor.worker(1))
        assert moved(), "a new proof moves the task"
        clock.sleep(0.01)
        proofs.save(proof.checked(), Actor.agent("s1"))
        assert moved(), "so does its check"
        clock.sleep(0.01)
        todos.appended(task, "write the test", Actor.worker(1))
        assert moved(), "and a to-do item"


def test_a_worker_is_started_with_hook_settings_of_its_own(app: App):
    import subprocess
    from journal.features.workers.support.worker_runner import WorkerRunner
    from journal.models.worker import Worker
    from journal.providers.claude import Claude
    from journal.providers.codex import Codex
    from journal.repositories.workers import Workers
    with app.container.get(Scope).environment(MAIN):
        worker = app.container.get(Workers).save(Worker(environment_id=1, name="Mr. Babbage", brief="b", worktree=True), Actor.system())
    path = app.container.get(WorkerRunner).hook_settings(worker)
    hooks = json.loads(path.read_text())["hooks"]
    commands = {block["hooks"][0]["command"] for blocks in hooks.values() for block in blocks}
    assert commands == {Claude().hook_command(app.config.root)} and "PreToolUse" in hooks, "every hook kind runs the journal's hook script for the project, whatever the worktree commits"
    assert Claude().worker_settings_flags(path) == ["--settings", str(path)], "Claude takes the file on its command line"
    subprocess.run(["git", "init", "-q"], cwd=app.config.root, capture_output=True, timeout=30)
    with app.container.get(Scope).environment(MAIN):
        codex = app.container.get(Workers).save(Worker(environment_id=1, name="Ada Lovelace", brief="b", provider="codex", worktree=True), Actor.system())
    runner = app.container.get(WorkerRunner)
    written = runner.hook_settings(codex)
    assert written == app.container.get(WorkerBranch).place(codex) / ".codex" / "hooks.json" and {block["hooks"][0]["command"] for blocks in json.loads(written.read_text())["hooks"].values() for block in blocks} == {Codex().hook_command(app.config.root)}, "Codex reads its hooks from the worktree's own file"
    assert "/.codex/hooks.json" in (app.config.root / ".git" / "info" / "exclude").read_text().splitlines(), "which git never sees, so the worker cannot commit it"
    assert Codex().worker_settings_flags(written) == ["--dangerously-bypass-hook-trust"], "and Codex runs the journal's hooks without asking to trust them"


def test_a_workers_agent_row_is_never_the_main_agent_and_ends_with_its_process(app: App):
    from journal.features.workers.support.worker_runner import WorkerRunner
    from journal.models.agent import Agent
    from journal.support.agent_role import AgentRole
    from journal.models.worker import Worker
    from journal.repositories.agents import Agents
    from journal.repositories.workers import Workers
    hook(app, "SessionStart")
    agents = app.container.get(Agents)
    for session in ("w-1", "w-2"):
        agents.save(Agent(environment_id=1, session=session, provider="claude", state="void", role=AgentRole.WORKER), Actor.system())
    with app.container.get(Scope).environment(MAIN):
        assert agents.current().session == "s1", "the newest worker row never becomes the current agent"
        main = agents.session_agent("s1")
        assert agents.running_peers(agents.session_agent("w-2")) == [] and [a.session for a in agents.running_peers(main)] == [], "sessions end each other only among main agents"
        assert [a.session for a in agents.main_scoped(1)] == ["s1"], "the main agent's walks leave workers out"
        worker = app.container.get(Workers).save(Worker(environment_id=1, name="Mr. Babbage", brief="b", session="w-1"), Actor.system())
        app.container.get(WorkerRunner).session_ended(worker)
        assert agents.session_agent("w-1").state == "ended" and agents.session_agent("w-2").state != "ended", "a worker's row ends with its process, and no other"


def test_every_caller_names_its_kind_and_a_subagent_is_told_by_its_agents_session(app: App):
    from journal.support.announced_commands import AnnouncedCommands
    from journal.support.agent_role import AgentRole
    from journal.http.support.subagent_commands import SubagentCommands
    callers = (Caller.user("main"), Caller.agent("main", "s1", "claude"), Caller.shell("main", "claude"), Caller.plugin("main", "echo"), Caller.worker("main", 3, "w-1", "claude"))
    assert [c.role for c in callers] == [AgentRole.MAIN, AgentRole.MAIN, AgentRole.MAIN, AgentRole.PLUGIN, AgentRole.WORKER] and [c.is_main_agent() for c in callers] == [False, True, True, False, False]
    subagent = Caller.worker("main", 3, "w-1", "claude").subagent_caller()
    assert subagent.role == AgentRole.SUBAGENT and subagent.session_role == AgentRole.WORKER, "a subagent of a worker is a subagent first, in its worker's session"
    announced, subagents = app.container.get(AnnouncedCommands), app.container.get(SubagentCommands)
    announced.note("main", "w-1", ("journal task list",))
    assert subagents.subagent_session(Caller.agent("main", "s1", "claude"), ["task", "list"], None, None) is None, "a worker's subagent's announcement never claims the main agent's command"
    assert subagents.subagent_session(Caller.worker("main", 3, "w-1", "claude"), ["task", "list"], None, None) == "", "it claims the command posted from the worker's session"
    from journal.models.agent import Agent
    from journal.repositories.agents import Agents
    app.container.get(Agents).save(Agent(session="thread-1", provider="codex"), Actor.system())
    assert subagents.subagent_session(Caller.worker("main", 4, "thread-9", "codex"), ["task", "list"], None, "thread-9") is None, "a Codex worker's own thread is its own, not a subagent's"
    assert subagents.subagent_session(Caller.shell("main", "codex"), ["task", "list"], None, "thread-9") == "thread-9", "another thread in the main agent's Codex shell is a subagent's"


def test_a_commit_whose_own_hook_was_lost_is_spotted_at_the_next_tool_use_and_closes_its_task(app: App, monkeypatch):
    import subprocess
    from journal.repositories.messages import Messages
    from journal.repositories.tasks import Tasks
    woken_capture(app, monkeypatch, [])
    root = app.config.root
    subprocess.run(["git", "init", "-q"], cwd=root, check=True)
    commit = lambda message, moment: subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", message], cwd=root, check=True, env={**os.environ, "GIT_COMMITTER_DATE": moment, "GIT_AUTHOR_DATE": moment})
    commit("Old", "2020-01-01T00:00:00")
    hook(app, "SessionStart")
    looked = dict(tool_name="Bash", tool_input={"command": "ls"}, tool_response={"stdout": "", "stderr": ""})
    hook(app, "PostToolUse", **looked)
    cards = lambda: [m.text for m in app.container.get(Messages).scoped() if m.text.startswith("Committed ")]
    assert cards() == [], "the head as first seen is no commit of this session's"
    app.console().run(["task", "create", "footer", "--start"], AGENT)
    hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "git commit -qm 'the footer' && sh install.sh"})
    from datetime import datetime, timezone
    two_minutes_ago = datetime.fromtimestamp(timing.time() - 120, timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")
    commit("The footer\n\nJournal: tasks done 1", two_minutes_ago)
    hook(app, "PostToolUse", **looked)
    assert len(cards()) == 1 and app.container.get(Tasks).find(1).state == "completed", "the head moved since the last look and the session's own tool start held the commit, so it is carded and its task closed"
    hook(app, "PostToolUse", **looked)
    assert len(cards()) == 1, "once"


def test_the_shipped_pytest_and_vitest_readers_pick_each_failed_test_its_assertion_line_and_the_summary():
    from journal.features.shell.seeds.default_readers import SHIPPED
    reader = lambda name: next(r for r in SHIPPED if r.name == name)
    pytest_output = ["collected 3 items", "tests/x.py .F.", "=== FAILURES ===", "def test_a():", ">   assert 1 == 2", "E   assert 1 == 2", "E    +  where 1 = f()", "FAILED tests/x.py::test_a - assert 1 == 2", "=== 1 failed, 2 passed in 0.1s ==="]
    assert reader("pytest").card_lines(pytest_output) == ["E   assert 1 == 2", "FAILED tests/x.py::test_a - assert 1 == 2", "=== 1 failed, 2 passed in 0.1s ==="]
    vitest_output = [" RUN  v1.0.0", " FAIL  tests/x.test.js > suite > adds", "AssertionError: expected 1 to be 2 // Object.is equality", " ❯ tests/x.test.js:5:20", " Test Files  1 failed (1)", "      Tests  1 failed | 2 passed (3)"]
    assert reader("vitest").card_lines(vitest_output) == [" FAIL  tests/x.test.js > suite > adds", "AssertionError: expected 1 to be 2 // Object.is equality", " Test Files  1 failed (1)", "      Tests  1 failed | 2 passed (3)"]


def test_a_pytest_runs_bar_moves_with_each_test_between_the_percentages_it_prints_once_a_row():
    from journal.features.shell.seeds.default_readers import SHIPPED
    pytest = next(reader for reader in SHIPPED if reader.name == "pytest")
    rows = ["." * 72 + "                                       [ 12%]", "." * 72 + "                                       [ 24%]"]
    assert pytest.progress(rows).count == 24, "at a row's end the bar is its percentage"
    assert pytest.progress([*rows, "." * 36]).count == 30, "half a row on, it is half the row's share past it"
    assert pytest.progress(["." * 36]).count == 0, "before the first percentage nothing is known"
    assert pytest.progress([rows[0], "..F" * 12]).count == 18, "a failure is a step as a dot is"
    assert pytest.progress([*rows, "." * 500]).count == 100, "never past the whole"


def test_a_workers_session_is_kept_as_it_prints_it_and_never_taken_from_the_dispatchers_transcript(app: App, tmp_path, monkeypatch):
    import threading
    from journal.providers.claude import Claude
    from journal.repositories.workers import Workers
    home = tmp_path / "home"
    monkeypatch.setattr(Path, "home", staticmethod(lambda: home))
    monkeypatch.delenv("CLAUDE_CONFIG_DIR", raising=False)
    dispatcher = home / ".claude" / "projects" / Claude.folder_name(app.config.root) / "dispatcher-session.jsonl"
    dispatcher.parent.mkdir(parents=True)
    hook(app, "SessionStart")
    console, workers, runner = app.console(), app.container.get(Workers), app.container.get(WorkerRunner)
    dispatched(console, ["Lady Lovelace", "say hello", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet"], AGENT)
    said = tmp_path / "said"
    os.mkfifo(said)
    printed = f"""echo '{{"type": "system", "session_id": "worker-session"}}'; {fifo_line(said)}; echo '{{"type": "result", "result": "hello said", "session_id": "worker-session"}}'"""
    running = threading.Thread(target=started_run, args=(runner, workers, workers.find(1), ["sh", "-c", printed], Actor.agent("s1")))
    running.start()
    end = timing.monotonic() + 3
    while timing.monotonic() < end and workers.find(1).resume != "worker-session":
        timing.sleep(0.01)
    assert workers.find(1).resume == "worker-session" and workers.find(1).is_running(), "the session is kept the moment the worker prints it, while it still works"
    said.write_text("\n")
    running.join(10)
    assert workers.find(1).state == WorkerState.UNFINISHED and workers.find(1).resume == "worker-session", "its session is kept when its run ends"
    dispatched(console, ["Mr. Babbage", "say nothing", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet"], AGENT)
    started_run(runner, app.container.get(Workers), workers.find(2), ["sh", "-c", f"echo '{{}}' >> '{dispatcher}'; echo plain words"], Actor.agent("s1"))
    assert workers.find(2).resume == "" and dispatcher.is_file(), "a worker in the project's own folder never takes the newest transcript there, which is the dispatcher's"


def kept_conversation(app: App, monkeypatch) -> Path:
    """Every worker's session has a conversation file still there, so a send can resume it."""
    from journal.providers.claude import Claude
    conversation = app.config.root / "conversation.jsonl"
    conversation.write_text("{}\n")
    monkeypatch.setattr(Claude, "transcript", lambda self, project, session: conversation)
    return conversation


def listening_session(home: Path, pid: int, session: str) -> list[dict]:
    """A Claude Code session's registry file, key and inbox socket, laid out as Claude Code publishes them; the lines it is sent are gathered."""
    import socket
    import tempfile
    import threading
    folder = home / ".claude" / "sessions"
    folder.mkdir(parents=True, exist_ok=True)
    address = str(Path(tempfile.mkdtemp(prefix="inbox-", dir="/tmp")) / "s.sock")
    (folder / f"{pid}.json").write_text(json.dumps({"pid": pid, "sessionId": session, "messagingSocketPath": address}))
    (folder / f"{pid}.0a1b.key").write_text(json.dumps({"peerToken": "token-1"}))
    server = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    server.bind(address)
    server.listen(4)
    server.settimeout(10)
    received: list[dict] = []

    def serve() -> None:
        while True:
            try:
                connection, _ = server.accept()
            except OSError:
                return
            with connection:
                received.extend(json.loads(line) for line in connection.makefile().read().splitlines() if line)

    threading.Thread(target=serve, daemon=True).start()
    return received


def arrived(received: list, count: int) -> list:
    end = timing.time() + 3
    while timing.time() < end and len(received) < count:
        timing.sleep(0.02)
    return received


def test_a_notify_reaches_only_a_running_claude_worker_and_moves_no_wait(app: App, tmp_path, monkeypatch):
    import subprocess
    from journal.repositories.workers import Workers
    home = tmp_path / "home"
    monkeypatch.setattr(Path, "home", staticmethod(lambda: home))
    monkeypatch.delenv("CLAUDE_CONFIG_DIR", raising=False)
    hook(app, "SessionStart")
    console, workers, sessions = app.console(), app.container.get(Workers), app.container.get(SessionAgents)
    console.run(["task", "create", "t"], AGENT)
    dispatched(console, ["Lady Lovelace", "write the parser", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "fast"], AGENT)
    process = subprocess.Popen(["sleep", "30"])
    try:
        workers.save(workers.find(1).running_as(process.pid, timing.time()).with_(resume="w-1"), Actor.system())
        received = listening_session(home, process.pid, "w-1")
        waiting, row = sessions.top("s1"), workers.find(1)
        assert waiting.name == "awaiting"
        assert "journal worker notify 1" in console.run(["worker", "send", "1", "now the lexer"], AGENT).error, "a send to a running worker points at notify"
        assert console.run(["worker", "notify", "1", "the lexer too"], AGENT).code == 0
        assert arrived(received, 2)[-1]["message"]["content"] == '<cross-session-message from-name="the agent that dispatched you" from-mode="bypass">\nthe lexer too\n</cross-session-message>'
        assert sessions.top("s1") == waiting and workers.find(1).brief == row.brief, "a notify changes nothing the worker was sent and leaves the dispatcher's wait as it was"
        from journal.support.agent_role import AgentRole
        from journal.repositories.messages import Messages
        messages = app.container.get(Messages)
        unread = len(messages.unread())
        urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/workers/1/message", data=json.dumps({"text": "and the tests"}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        assert arrived(received, 4)[-1]["message"]["content"].startswith('<cross-session-message from-name="the user"') and "and the tests" in received[-1]["message"]["content"], "the user's message in the worker's chat goes to the worker's own session"
        app.runtime().deferred.drain()
        chat = [m for m in messages.all() if m.thread == MessageThread.WORKER and m.session == "w-1" and m.text in ("the lexer too", "and the tests")]
        assert [(m.text, m.creator.actor_type.value) for m in chat] == [("the lexer too", "agent"), ("and the tests", "user")] and len(messages.unread()) == unread, "both are messages of the worker's chat, each by its sender, and neither reaches the main agent's inbox"
        from journal.models.reaction import Reaction
        main = messages.recent(1)[-1]
        assert not Reaction(environment_id=1, emoji="👍").reacted_message(chat[0]).events and Reaction(environment_id=1, emoji="👍").reacted_message(main).events, "a face on a worker's message raises nothing for the main agent; one on the main chat's does"
        workers.save(workers.find(1).with_(provider="codex"), Actor.system())
        assert "runs Codex, which takes no message while it runs" in console.run(["worker", "notify", "1", "x"], AGENT).error
        workers.save(workers.find(1).with_(provider="claude"), Actor.system())
        process.kill()
        process.wait(5)
        assert "has ended and its report is being filed" in console.run(["worker", "notify", "1", "x"], AGENT).error, "the row is read again at delivery, its process found gone"
        workers.save(workers.find(1).stopped(timing.time(), ""), Actor.system())
        assert "revives it in its last session" in console.run(["worker", "notify", "1", "x"], AGENT).error
        workers.save(workers.find(1).with_(state=WorkerState.REPORTED), Actor.system())
        assert "has reported and runs no more" in console.run(["worker", "notify", "1", "x"], AGENT).error
        assert len(received) == 4
    finally:
        process.kill()
        process.wait(5)


def test_two_jobs_sent_to_one_worker_at_once_start_one_run(app: App, monkeypatch):
    import threading
    from journal.repositories.workers import Workers
    started = []

    def slow_start(self, worker, actor):
        started.append(worker.id)
        timing.sleep(0.3)

    monkeypatch.setattr(WorkerRunner, "start", slow_start)
    kept_conversation(app, monkeypatch)
    hook(app, "SessionStart")
    console, workers = app.console(), app.container.get(Workers)
    dispatched(console, ["Lady Lovelace", "the parser", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "fast"], AGENT)
    console.run(["worker", "report", "1", "parser done"], Caller.agent("main", "w1", "claude"))
    workers.save(workers.find(1).with_(resume="sess-1"), USER.actor)
    started.clear()
    gate, codes = threading.Barrier(2), []

    def send(brief: str) -> None:
        gate.wait()
        codes.append(console.run(["worker", "send", "1", brief], AGENT).code)

    sends = [threading.Thread(target=send, args=(brief,)) for brief in ("the lexer", "the printer")]
    for thread in sends:
        thread.start()
    for thread in sends:
        thread.join(10)
    assert started == [1] and sorted(codes) == [0, 1], "the second send finds the worker out and is refused"


def test_stop_and_send_find_a_workers_process_after_a_restart(app: App, monkeypatch):
    import subprocess
    from journal.repositories.messages import Messages
    from journal.repositories.workers import Workers
    started = []
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, actor: started.append(worker.id))
    kept_conversation(app, monkeypatch)
    hook(app, "SessionStart")
    console, workers = app.console(), app.container.get(Workers)
    dispatched(console, ["Mr. Brunel", "the bridge", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "fast"], AGENT)
    dispatched(console, ["Mr. Telford", "the canal", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "fast"], AGENT)
    out_before = subprocess.Popen(["sleep", "30"], start_new_session=True)
    try:
        workers.save(workers.find(1).running_as(out_before.pid, timing.time()), Actor.system())
        assert console.run(["worker", "stop", "1"], AGENT).code == 0
        assert out_before.wait(5) is not None and workers.find(1).state == WorkerState.STOPPED, "the saved pid's group is ended though this runner never started it"
    finally:
        if out_before.poll() is None:
            out_before.kill()
            out_before.wait(5)
    ended = subprocess.Popen(["true"])
    ended.wait(5)
    workers.save(workers.find(2).running_as(ended.pid, timing.time()).with_(resume="sess-2"), Actor.system())
    assert console.run(["worker", "send", "2", "now the locks"], AGENT).code == 0, "a worker whose process died unreported is revived, not refused as still out"
    reports = [m.text for m in app.container.get(Messages).scoped() if m.text.startswith("Mr. Telford reports: ")]
    assert len(reports) == 1 and started[-1] == 2 and workers.find(2).brief == "now the locks", "its missing outcome is filed first, then the job goes out"


def test_a_revived_worker_goes_on_in_its_own_worktree_and_branch_and_keeps_its_work(app: App, monkeypatch):
    import shutil
    import subprocess
    from journal.providers.claude import Claude
    from journal.repositories.workers import Workers
    kept_conversation(app, monkeypatch)
    root = app.config.root
    git = lambda *argv, cwd=root: subprocess.run(["git", *argv], cwd=cwd, capture_output=True, text=True, timeout=30)
    git("init", "-q", "-b", "main")
    git("config", "user.email", "t@example.com")
    git("config", "user.name", "T")
    (root / ".gitignore").write_text(".journal/\n")
    git("add", ".gitignore")
    git("commit", "-qm", "start")
    hook(app, "SessionStart")
    console, workers = app.console(), app.container.get(Workers)
    dispatched(console, ["Lady Lovelace", "write the parser", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet", "--worktree", "--no-libraries"], AGENT)
    folder = app.config.home / "worktrees" / "1-Lady-Lovelace"
    (folder / "parser.py").write_text("committed\n")
    git("add", "parser.py", cwd=folder)
    git("commit", "-qm", "the parser", cwd=folder)
    (folder / "notes.txt").write_text("not committed\n")

    def reported_again() -> None:
        console.run(["worker", "report", "1", "done"], Caller.agent("main", "w1", "claude"))
        workers.save(workers.find(1).with_(resume="sess-1"), USER.actor)

    reported_again()
    assert console.run(["worker", "send", "1", "now the lexer"], AGENT).code == 0
    assert (folder / "notes.txt").read_text() == "not committed\n", "a revive in the folder still there keeps what was not committed"
    reported_again()
    shutil.rmtree(folder)
    assert console.run(["worker", "send", "1", "now the printer"], AGENT).code == 0
    assert (folder / "parser.py").read_text() == "committed\n" and git("rev-parse", "--abbrev-ref", "HEAD", cwd=folder).stdout.strip() == "worker/1-Lady-Lovelace", "a folder gone is made again on the branch it kept"
    reported_again()
    shutil.rmtree(folder)
    git("worktree", "prune")
    git("branch", "-D", "worker/1-Lady-Lovelace")
    assert console.run(["worker", "send", "1", "now the tests"], AGENT).code == 0
    assert folder.is_dir() and not (folder / "parser.py").exists(), "only with both gone is it cut again from the tip"
    reported_again()
    monkeypatch.setattr(Claude, "transcript", lambda self, project, session: None)
    refused = console.run(["worker", "send", "1", "now the docs"], AGENT)
    assert refused.code == 1 and "its session sess-1 is gone" in refused.error


def test_a_stopped_worker_is_revived_by_send_in_its_last_session_and_its_own_worktree(app: App, monkeypatch):
    import subprocess
    from journal.providers.claude import Claude
    from journal.repositories.messages import Messages
    from journal.repositories.workers import Workers
    started = []
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, actor: started.append(worker))
    kept_conversation(app, monkeypatch)
    root = app.config.root
    git = lambda *argv: subprocess.run(["git", *argv], cwd=root, capture_output=True, text=True, timeout=30)
    for argv in (["init", "-q", "-b", "main"], ["-c", "user.email=t@example.com", "-c", "user.name=T", "commit", "-q", "--allow-empty", "-m", "start"]):
        git(*argv)
    hook(app, "SessionStart")
    console, workers, runner = app.console(), app.container.get(Workers), app.container.get(WorkerRunner)
    dispatched(console, ["Mr. Watt", "the governor", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet", "--worktree", "--no-libraries"], AGENT)
    console.run(["worker", "stop", "1"], AGENT)
    assert "left no session to resume: dispatch the job again" in console.run(["worker", "send", "1", "the boiler"], AGENT).error
    workers.save(workers.find(1).with_(resume="sess-1"), USER.actor)
    assert console.run(["worker", "send", "1", "the boiler"], AGENT).code == 0
    revived = started[-1]
    command = Claude().worker_command(runner.instructed(revived), revived.model, revived.resume, revived.session)
    assert revived.is_running() and command[2] == "the boiler" and command[-2:] == ["--resume", "sess-1"], "the new job is the first turn of its last session"
    started_run(runner, app.container.get(Workers), revived, ["sh", "-c", "pwd -P"], Actor.agent("s1"))
    assert str(app.container.get(WorkerBranch).place(revived).resolve()) in workers.find(1).run_end, "it runs again in the same worktree"


def test_a_resumed_run_starts_its_clock_again_and_is_given_the_job_alone(app: App, monkeypatch):
    from journal.features.workers.feature import Workers as WorkersFeature
    from journal.providers.codex import Codex
    from journal.repositories.messages import Messages
    from journal.repositories.workers import Workers
    from journal.features.profiles.support.profile_files import ProfileFiles
    started = []
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, actor: started.append(worker))
    kept_conversation(app, monkeypatch)
    app.container.get(ProfileFiles).write_all()
    hook(app, "SessionStart")
    console, workers, runner = app.console(), app.container.get(Workers), app.container.get(WorkerRunner)
    dispatched(console, ["Mr. Harrison", "the clock", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet"], AGENT)
    profile = app.container.get(ProfileFiles).read("journal-medior")["body"]
    assert runner.instructed(started[-1]).startswith(profile), "a fresh worker is told its profile first"
    console.run(["worker", "report", "1", "the clock runs"], Caller.agent("main", "w1", "claude"))
    workers.save(workers.find(1).with_(resume="sess-1", began=timing.time() - 3600, pid=99999), USER.actor)
    console.run(["worker", "send", "1", "the escapement"], AGENT)
    resumed = workers.find(1)
    assert (resumed.began, resumed.pid) == (0.0, 0) and runner.instructed(resumed) == "the escapement", "the old run's clock and process go with it, and the resumed prompt is the job alone"
    user_set(app, WorkersOptions.TIMEOUT.key, 0.05)
    started_run(runner, app.container.get(Workers), resumed, ["sh", "-c", "echo the escapement ticks"], Actor.agent("s1"))
    assert workers.find(1).run_end == "the escapement ticks", "the time limit counts from the new run, not the first"


def test_a_worker_is_idle_by_one_rule_old_rows_and_dead_processes_included(app: App):
    from journal.models.worker import Worker
    from journal.repositories.workers import Workers
    workers = app.container.get(Workers)
    rows = {
        "out": Worker(name="out", state=WorkerState.DISPATCHED, pid=1),
        "ended unreported": Worker(name="ended unreported", state=WorkerState.DISPATCHED, pid=999999),
        "idle": Worker(name="idle", state=WorkerState.REPORTED),
        "acted on": Worker(name="acted on", state=WorkerState.REPORTED, adopted=True),
        "old stop": Worker(name="old stop", state=WorkerState.STOPPED, adopted=True),
        "stopped": Worker(name="stopped", state=WorkerState.STOPPED),
    }
    for row in rows.values():
        workers.save(row, Actor.system())
    assert [w.name for w in workers.scoped() if w.is_running()] == ["out", "ended unreported"], "a dispatched worker is out whatever its process, until its report is filed"
    assert [w.name for w in workers.scoped() if w.is_idle()] == ["idle"], "idle is reported and not yet acted on; a stopped row, old or new, is retired"


def test_a_dispatch_names_the_idle_worker_whose_branch_touched_the_briefs_files_never_its_old_brief(app: App):
    from journal.models.worker import Worker
    from journal.repositories.workers import Workers
    hook(app, "SessionStart")
    app.console().run(["environment", "overview"], AGENT)
    workers = app.container.get(Workers)
    workers.save(Worker(name="Mr. Babbage", brief="the engine in src/engine.py", state=WorkerState.REPORTED, touched_paths=("src/journal/features/shell/chain.py", "docs/chain.md")), Actor.system())
    workers.save(Worker(name="Mr. Brunel", brief="fix src/journal/features/shell/chain.py", state=WorkerState.REPORTED, touched_paths=None), Actor.system())
    workers.save(Worker(name="Mr. Telford", brief="", state=WorkerState.REPORTED, adopted=True, touched_paths=("src/journal/features/shell/chain.py",)), Actor.system())
    said = lambda brief: json.dumps(hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": f"journal worker dispatch 'Ada' '{brief}' --profile journal-medior"})[1])
    refused = said("make shell/chain.py faster")
    assert "1 idle workers" in refused and "worker 1, Mr. Babbage, last on src/journal/features/shell/chain.py, docs/chain.md: `journal worker send 1" in refused, "a path the brief names by its end matches the file the branch touched"
    assert "Mr. Brunel" not in refused and "Mr. Telford" not in refused, "an old brief naming the file is no evidence, and a worker acted on is retired"
    assert "idle workers" not in said("look at src/engine.py"), "the old brief's own files are not what it touched"


def test_retiring_a_worker_the_dispatcher_waits_on_stops_it_and_ends_the_wait(app: App):
    import subprocess
    from journal.repositories.workers import Workers
    hook(app, "SessionStart")
    console, workers, sessions = app.console(), app.container.get(Workers), app.container.get(SessionAgents)
    console.run(["task", "create", "t"], AGENT)
    dispatched(console, ["Mr. Fulton", "the steamboat", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet"], AGENT)
    dispatched(console, ["Mr. Watt", "the engine", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet"], AGENT)
    assert sessions.top("s1").targets() == ["workers:1", "workers:2"]
    process = subprocess.Popen(["sleep", "30"], start_new_session=True)
    try:
        workers.save(workers.find(1).running_as(process.pid, timing.time()), Actor.system())
        console.run(["worker", "complete", "1", "--why", "the steamboat is dropped"], AGENT)
        assert process.wait(5) is not None and workers.find(1).state == WorkerState.STOPPED, "a worker retired while out is stopped"
    finally:
        if process.poll() is None:
            process.kill()
            process.wait(5)
    assert sessions.top("s1").targets() == ["workers:2"], "the wait shrinks to the workers still out"
    console.run(["worker", "stop", "2", "--why", "the engine waits on the boiler"], AGENT)
    assert sessions.top("s1").name != "awaiting", "and ends with the last"


def queue_plan(app: App, titles: tuple[str, ...]) -> list[int]:
    """A started plan of one phase with these tasks, by their numbers."""
    console = app.console()
    made = lambda argv: int(console.run(argv, USER).text.split()[1].rstrip(":"))
    plan = made(["plan", "create", "the parser", "--brief", "the parser is done"])
    console.run(["plan", "phase", str(plan), "phase 1", "--when", "its tasks are done"], USER)
    ids = [made(["plan", "add", str(plan), title, "--brief", f"{title} is done"]) for title in titles]
    for argv, caller in ((["plan", "todos", str(plan), "1", *map(str, ids)], USER), (["plan", "ready", str(plan)], USER), (["plan", "approve", str(plan)], USER), (["plan", "start", str(plan)], AGENT)):
        out = console.run(argv, caller)
        assert out.code == 0, out.error
    return ids


def queue_lines_said(app: App, command: str) -> list[str]:
    from journal.repositories.entries import NUDGE, Entries
    status, body = hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": command})
    assert status == 200, body
    app.runtime().deferred.drain()
    return [entry.data["line"] for entry in app.container.get(Entries).all_matching(entry_type=NUDGE) if entry.data.get("key") == "workers.queue_the_related_tasks"]


def test_a_worker_whose_processes_pass_the_memory_warning_is_named_once_and_one_past_the_limit_is_stopped_with_the_reason(app: App, monkeypatch):
    from journal.features.workers.jobs.worker_memory_watch import MEGABYTE, WorkerMemoryWatch
    from journal.models.worker import Worker
    from journal.repositories.entries import NUDGE, Entries
    from journal.repositories.workers import Workers
    hook(app, "SessionStart")
    monkeypatch.setattr(WorkerRunner, "stop", lambda self, worker: None)
    memory: dict[int, int] = {}
    monkeypatch.setattr(SupervisorLink, "memory", lambda self, environment_id: dict(memory))
    workers = app.container.get(Workers)
    with app.container.get(Scope).environment(MAIN):
        worker = workers.save(Worker(environment_id=MAIN, name="Mr. Babbage", brief="b", state=WorkerState.DISPATCHED, pid=424242, dispatcher="s1"), Actor.system())
    watch = app.container.get(WorkerMemoryWatch)
    warned = lambda: [entry.data["line"] for entry in app.container.get(Entries).all_matching(entry_type=NUDGE) if entry.data.get("key") == "workers.worker_uses_much_memory"]

    def measured(megabytes: int) -> Worker:
        memory[424242] = megabytes * MEGABYTE
        watch.tick(1000.0)
        app.runtime().deferred.drain()
        with app.container.get(Scope).environment(MAIN):
            return workers.find(worker.id)
    assert measured(1000).state == WorkerState.DISPATCHED and warned() == [], "a tree inside its budget is left alone"
    assert measured(5000).state == WorkerState.DISPATCHED and measured(6000).state == WorkerState.DISPATCHED
    assert warned() == [WorkersNudges.MEMORY_WARNING.create(n=worker.id, megabytes=5000, budget=4096).rendered()], f"past the warning the agent that sent it is told once: {warned()}"
    stopped = measured(9000)
    assert stopped.state == WorkerState.STOPPED and "its processes used 9000 MB, past the limit of 8192 MB" in stopped.retire_reason, "past the limit it is stopped, the reason written on it"


def test_a_worker_is_sent_its_next_job_on_another_model_in_the_same_worktree_and_an_opus_worker_spending_much_on_settled_work_is_named_once(app: App, monkeypatch):
    from journal.features.workers.support.worker_branch import WorkerBranch
    from journal.providers.claude import Claude
    from journal.repositories.entries import NUDGE, Entries
    from journal.repositories.workers import Workers
    started = []
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, actor: started.append(worker))
    kept_conversation(app, monkeypatch)
    console, settings = app.console(), app.container.get(SettingRows)
    hook(app, "SessionStart")
    user_set(app, "workers.mode", "orchestrator")
    import subprocess
    for argv in (["init", "-q", "-b", "main"], ["-c", "user.email=t@example.com", "-c", "user.name=T", "commit", "-q", "--allow-empty", "-m", "start"]):
        subprocess.run(["git", *argv], cwd=app.config.root, capture_output=True, timeout=30)
    console.run(["task", "create", "the parser", "--brief", "reads the grammar"], AGENT)
    out = console.run(["worker", "dispatch", "Lady Lovelace", "--task", "1", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--worktree", "--no-libraries"], AGENT)
    assert out.code == 0, out.error
    workers, branch = app.container.get(Workers), app.container.get(WorkerBranch)
    console.run(["worker", "report", "1", "parser done"], Caller.agent("main", "w1", "claude"))
    workers.save(workers.find(1).with_(resume="w-1"), USER.actor)
    dispatched = workers.find(1)
    assert dispatched.model == "sonnet" and dispatched.worktree, "a medior runs on its profile's model, here in a worktree"
    sent = console.run(["worker", "send", "1", "the next part", "--model", "opus"], AGENT)
    assert sent.code == 0, sent.error
    again = started[-1]
    assert again.model == "opus" and again.profile == "journal-medior" and again.resume == "w-1", "the next job runs on the model named, in its last session"
    assert branch.place(again) == branch.place(dispatched) and again.branch == dispatched.branch, "in the same worktree"
    listed = console.run(["worker", "list"], AGENT).text
    assert "on opus, $0.00 at API prices, sent back 0 times on this task" in listed, listed
    costly = lambda: [entry.data["line"] for entry in app.container.get(Entries).all_matching(entry_type=NUDGE) if entry.data.get("key") == "workers.worker_costly_on_shaped_work"]
    runner = app.container.get(WorkerRunner)
    runner.cost_recorded(workers.find(1), 1.5, Actor.system())
    app.runtime().deferred.drain()
    assert costly() == [], "under the setting's dollars nothing is said"
    runner.cost_recorded(workers.find(1), 0.75, Actor.system())
    app.runtime().deferred.drain()
    assert costly() == [WorkersNudges.COSTLY_SHAPED_WORK.create(n=1, dollars="2.25", model="opus").rendered()], costly()
    runner.cost_recorded(workers.find(1), 3.0, Actor.system())
    app.runtime().deferred.drain()
    assert len(costly()) == 1, "it is said once"
    assert "on opus, $5.25 at API prices" in console.run(["worker", "list"], AGENT).text, "the status names the spend so far"
    assert Claude().worker_outcome('{"type":"result","result":"done","session_id":"w-1","total_cost_usd":0.42}\n', "").cost_dollars == 0.42, "the spend is read from the run's result line"
    refused = console.run(["worker", "send", "1", "more", "--profile", "journal-researcher"], AGENT)
    assert refused.code != 0 and "no worker profile" in refused.error, "a send names a worker profile"


def test_a_merge_whose_worker_is_sampled_for_its_model_fit_is_clean_and_the_sample_judges_the_worker_with_no_reader_report_looked_up(app: App, monkeypatch):
    from journal.features.verification.support.verifier_dispatch import VERIFIES
    from journal.features.verification.support.verifier_runner import VerifierRunner
    from journal.models.support.ref import Ref
    from journal.repositories.links import Links
    from journal.repositories.messages import Messages
    from journal.repositories.reader_reports import ReaderReports
    from journal.repositories.tasks import Tasks
    from journal.repositories.verifiers import Verifiers
    from journal.repositories.workers import Workers
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, actor: None)
    monkeypatch.setattr(VerifierRunner, "start", lambda self, verifier, resume="": verifier)
    console, settings = app.console(), app.container.get(SettingRows)
    hook(app, "SessionStart")
    user_set(app, "workers.mode", "orchestrator")
    user_set(app, "workers.model_fit_sample", 1)
    console.run(["task", "create", "the parser", "--brief", "reads the grammar"], AGENT)
    assert console.run(["worker", "dispatch", "Lady Lovelace", "--task", "1", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet"], AGENT).code == 0
    workers = app.container.get(Workers)
    assert not app.container.get(ReaderReports).all(), "no reader report has the worker's number"
    workers.save(workers.find(1).with_(token_hash="h", session="w-1", resume="w-1").ready(1.0), Actor.system())
    lovelace = Caller.worker("main", 1, "w-1", "claude")
    assert console.run(["proof", "1", "parser.py:3, test_reads_the_grammar passes"], lovelace).code == 0
    assert console.run(["clock-out", "the parser reads the grammar"], lovelace).code == 0
    assert console.run(["worker", "check", "1", "1"], AGENT).code == 0
    merged = console.run(["worker", "merge", "1"], AGENT)
    app.runtime().deferred.drain()
    assert merged.code == 0, merged.error
    worker, task = workers.find(1), app.container.get(Tasks).find(1)
    assert worker.state == WorkerState.MERGED and task.is_closed(), f"the work is in, the task closed and the worker merged, never released: {worker.state}"
    verifiers = app.container.get(Verifiers).all()
    assert len(verifiers) == 1 and app.container.get(Links).targets(verifiers[0], VERIFIES) == [Ref.build(worker)], "the model-fit sample sent a verifier on the merged worker"
    app.container.get(Verifiers).save(verifiers[0].with_(session="v-1"), Actor.system())
    cards = [message for message in app.container.get(Messages).all() if message.data.get("shows") == "verifiers"]
    assert cards and cards[-1].data["row"] == "workers:1" and "checking whether Lady Lovelace's model fit its work" in cards[-1].text, [message.text for message in cards]


def test_a_worker_messages_only_its_own_dispatchers_other_workers_and_starts_no_loop(app: App, tmp_path, monkeypatch):
    import subprocess
    from journal.models.worker import Worker
    from journal.repositories.workers import Workers
    kept_conversation(app, monkeypatch)
    home = tmp_path / "home"
    monkeypatch.setattr(Path, "home", staticmethod(lambda: home))
    monkeypatch.delenv("CLAUDE_CONFIG_DIR", raising=False)
    hook(app, "SessionStart")
    console, workers = app.console(), app.container.get(Workers)
    for name, dispatcher, state in (("Mr. Watt", "s1", WorkerState.DISPATCHED), ("Mr. Boulton", "s1", WorkerState.REPORTED), ("Mr. Other", "s2", WorkerState.REPORTED), ("Mr. Retired", "s1", WorkerState.STOPPED)):
        workers.save(Worker(name=name, brief="a job", dispatcher=dispatcher, state=state, resume=f"sess-{name}", adopted=state == WorkerState.STOPPED), Actor.system())
    watt = Caller.worker("main", 1, None, "claude")
    refused = lambda *argv: console.run(["worker", *argv], watt).error
    assert "worker 1 is you" in refused("send", "1", "x") and "worker 1 is you" in refused("notify", "1", "x")
    assert "is another agent's" in refused("send", "3", "x") and "is another agent's" in refused("notify", "3", "x")
    assert "is retired" in refused("send", "4", "x") and "is retired" in refused("notify", "4", "x"), "a peer never revives a retired worker"
    assert "has no task" in refused("send", "2", "the separate condenser"), "a peer that works on no task takes no message"
    from journal.models.support.ref import Ref
    from journal.repositories.tasks import Tasks
    tasks = app.container.get(Tasks)
    for number, title in ((1, "the engine"), (2, "the condenser")):
        console.run(["task", "create", title], AGENT)
        tasks.handover(tasks.find(number), Ref(Worker.table(), number), Actor.system())
    assert console.run(["worker", "send", "2", "the separate condenser"], watt).code == 0
    boulton = workers.find(2)
    assert boulton.dispatcher == "s1" and boulton.updater == Actor.worker(1) and boulton.is_running(), "the send names the sending worker and keeps the target's dispatcher"
    assert "is out on a job" in console.run(["worker", "send", "1", "back to you"], Caller.worker("main", 2, None, "claude")).error, "a worker out takes no job from a peer, so two workers sending to each other start no loop"
    process = subprocess.Popen(["sleep", "30"])
    try:
        workers.save(workers.find(1).running_as(process.pid, timing.time()).with_(resume="w-1"), Actor.system())
        received = listening_session(home, process.pid, "w-1")
        assert console.run(["worker", "notify", "1", "the condenser is cold"], Caller.worker("main", 2, None, "claude")).code == 0
        assert 'from-name="worker 2, Mr. Boulton"' in arrived(received, 2)[-1]["message"]["content"]
    finally:
        process.kill()
        process.wait(5)


def test_a_long_worker_report_keeps_its_start_and_its_end():
    from journal.features.workers.support.worker_runner import WorkerRunner
    report = "Summary: the suite takes 9 s.\n" + "x" * 20000 + "\nlast line"
    shortened = WorkerRunner.shortened_report(report)
    assert shortened.startswith("Summary: the suite takes 9 s.") and shortened.endswith("last line") and "characters left out" in shortened, "a report's opening is its summary and is never cut"
    assert WorkerRunner.shortened_report("short") == "short"


def wrapped_line(command: str) -> str:
    """The line Claude Code hands the runner: its own set-up, the command in an eval, and a pwd into a file."""
    return f"true && eval '{command.replace(chr(39), chr(39) + chr(34) + chr(39) + chr(34) + chr(39))}' < /dev/null && pwd -P >| /dev/null"


BARE_COMMANDS = {
    "python3 -m pytest -q tests/a.py": "pytest", "npx vitest run tests/": "vitest run", "$S/calibrate5.sh --fast": "calibrate5.sh",
    "sh install.sh": "install.sh", "(cd src/web && npx vitest run tests/)": "vitest run", "REPLAY_FREEZE=1 python3 -m pytest -q": "pytest",
    "go test ./...": "go test", "npm run build": "npm run build", "timeout 60 cargo test": "cargo test", "uv run pytest -x": "pytest",
    "docker compose exec app php artisan test": "php artisan test", "cd src && make -j8": "make", "pytest -k chat": "pytest",
    "bash -c \"make test\"": "make test", "env FOO=1 node x.js": "x.js", "nohup ./server.sh &": "server.sh",
}


def test_a_command_is_known_by_its_bare_command_with_its_setup_launchers_variables_and_arguments_seen_through():
    for line, bare in BARE_COMMANDS.items():
        assert SHAPES.command_name(line) == bare, line
    parts = [part for row in map(json.loads, (Path(__file__).parent / "shell_corpus.jsonl").read_text().splitlines()) for part in row["parts"]]
    assert len(parts) > 10000
    for part in parts:
        bare = SHAPES.command_name(part)
        first = bare.split()[0] if bare else ""
        assert not first.startswith("(") and "=" not in first and (first not in SHAPES.launchers or bare == first), (part, bare)
        assert first not in SETUP_COMMANDS or not ("&&" in part or ";" in part) or "<<" in part, ("a chain is known by the command past its setup", part, bare)


def test_a_readers_command_run_with_three_different_arguments_tells_the_agent_to_give_the_reader_a_topic(app: App):
    """A command a reader reads, run here with three or more argument sets, does different things, so the reader is asked for a topic that says which."""
    from journal.features.shell.support.shell_request import ShellRequest
    from journal.features.shell.support.shell_runner import ShellRunner
    console, runner, link = app.console(), app.container.get(ShellRunner), app.container.get(SupervisorLink)
    hook(app, "SessionStart")
    assert console.run(["reader", "add", "naps", "--pattern", "slept", "--about", "the naps", "--commands", "sleep", "--label", "Taking a nap"], AGENT).code == 0
    for seconds in ("0.1", "0.2", "0.3"):
        hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": f"sleep {seconds}"})
    link.working(MAIN)
    request = lambda line: ShellRequest(line=wrapped_line(line), cwd=str(app.config.root), shell="/bin/sh", environment=dict(os.environ))
    user_set(app, "shell.foreground", 1)
    b"".join(runner.run(request("sleep 1.5"), AGENT, MAIN))
    said = link.pending_lines(MAIN)
    import time as clock
    from journal.repositories.command_outputs import CommandOutputs
    outputs = app.container.get(CommandOutputs)
    with app.container.get(Scope).environment(MAIN):
        ended = lambda: all(o.ended for o in outputs.reader_outputs("naps"))
        for _ in range(50):
            if ended():
                break
            clock.sleep(0.1)
    assert "sleep ran with 3 different arguments" in said and "give reader naps a `--topic`" in said, said


def test_a_plugins_alias_and_reader_come_with_it_a_taken_name_is_skipped_and_both_go_with_it(app: App, tmp_path):
    from journal.repositories.aliases import Aliases
    from journal.features.shell.support.shell_request import ShellRequest
    from journal.features.shell.support.shell_runner import ShellRunner
    folder = tmp_path / "judging"
    (folder / ".journal-plugin" / "readers").mkdir(parents=True)
    (folder / "journal-plugin.json").write_text(json.dumps({"name": "judging", "version": "1.0.0", "program": "run.py", "aliases": [
        {"name": "judge", "line": "bin/judge {args} --plain", "env": {"PLAIN": "1"}, "args": ["--changes", "<path>"], "reader": "verdicts", "background": True},
        {"name": "task", "line": "bin/judge"}]}))
    (folder / "run.py").write_text("")
    (folder / ".journal-plugin" / "readers" / "verdicts.pattern").write_text("# the verdict\n^verdict\n")
    console, aliases = app.console(), app.container.get(Aliases)
    installed = console.run(["plugin", "install", str(folder), "--yes"], USER)
    assert installed.code == 0 and "brings the alias judge: bin/judge {args} --plain" in installed.text and "skipped its alias task: the name is taken" in installed.text, installed.text + installed.error
    judge = aliases.single(name="judge")
    assert judge.plugin == "judging" and judge.command("--changes") == f"PLAIN=1 {folder.resolve() / 'bin' / 'judge'} --changes --plain" and judge.description == "takes --changes, <path>"
    assert (app.config.readers / "verdicts.pattern").read_text().startswith("# the verdict\n^verdict\n")
    refused = console.run(["reader", "remove", "verdicts"], AGENT)
    assert refused.code != 0 and "belongs to the plugin judging" in refused.error and (app.config.readers / "verdicts.pattern").exists(), "a reader a plugin ships goes only with its plugin"
    assert judge.background, "a plugin's alias declares that a run moves to the background at once"
    refused = console.run(["reader", "add", "judge-lines", "--commands", "judge", "--pattern", "^judged", "--about", "the judge's lines"], AGENT)
    assert refused.code != 0 and "journal judge" in refused.error, "a reader of the project may not read a plugin's alias (message 69349)"
    (app.config.readers / "own-verdicts.pattern").write_text("# the verdicts\n^verdict\ncommands: judge\n")
    b"".join(app.container.get(ShellRunner).run(ShellRequest(line=wrapped_line("journal judge --changes"), cwd=str(app.config.root), shell="/bin/sh", environment=dict(os.environ)), AGENT, MAIN))
    assert not (app.config.readers / "own-verdicts.pattern").exists(), "a reader of the project that reads a plugin's alias is deleted when the alias runs (message 69440)"
    (folder / "journal-plugin.json").write_text(json.dumps({"name": "judging", "version": "1.0.1", "program": "run.py", "aliases": [{"name": "judge", "line": "bin/judge --strict {args}"}]}))
    (folder / ".journal-plugin" / "readers" / "verdicts.pattern").write_text("# the verdict\n^judged\n")
    upgraded = console.run(["plugin", "upgrade", "judging", "--yes"], USER)
    assert upgraded.code == 0, upgraded.text + upgraded.error
    judge = aliases.single(name="judge")
    assert "--strict" in judge.line and not judge.background and "^judged" in (app.config.readers / "verdicts.pattern").read_text(), "an upgrade writes the plugin's aliases and readers again from its new manifest"
    assert console.run(["plugin", "remove", "judging"], USER).code == 0
    assert aliases.matching(name="judge") == [] and not (app.config.readers / "verdicts.pattern").exists(), "the plugin's alias and reader go with it"


def test_the_shim_runs_an_aliases_line_typed_at_a_terminal(app: App):
    import subprocess
    assert app.console().run(["alias", "add", "hello", "echo hi from"], USER).code == 0
    environ = {**os.environ, "JOURNAL_ROOT": str(app.config.root), "JOURNAL_ENV": "main"}
    (app.config.home / "port").write_text(str(app.server().port))
    typed = subprocess.run(["sh", str(Path(__file__).resolve().parents[1] / "src" / "journal.sh"), "hello", "the terminal"], env=environ, capture_output=True, text=True, timeout=10)
    assert typed.returncode == 0 and typed.stdout == "hi from the terminal\n", typed.stdout + typed.stderr


def test_the_viewers_plugin_install_names_the_aliases_it_skipped(app: App, tmp_path):
    folder = tmp_path / "judging"
    folder.mkdir()
    (folder / "journal-plugin.json").write_text(json.dumps({"name": "judging", "version": "1.0.0", "program": "run.py", "aliases": [{"name": "judge", "line": "run.py"}, {"name": "task", "line": "run.py"}]}))
    (folder / "run.py").write_text("")
    installed = viewer(app, "plugins", {"source": str(folder)})
    assert installed["name"] == "judging" and installed["skipped_aliases"] == ["task"]


def git_run(cwd: Path, *argv: str):
    import subprocess
    return subprocess.run(["git", *argv], cwd=cwd, capture_output=True, text=True, timeout=30)


def repository_made(folder: Path, files: dict[str, str]) -> Path:
    """A git repository at the folder with one commit of the files given, on main, with a user to commit and merge as."""
    folder.mkdir(parents=True, exist_ok=True)
    git_run(folder, "init", "-q", "-b", "main")
    git_run(folder, "config", "user.email", "t@example.com")
    git_run(folder, "config", "user.name", "T")
    for name, text in files.items():
        (folder / name).parent.mkdir(parents=True, exist_ok=True)
        (folder / name).write_text(text)
    git_run(folder, "add", "-A")
    git_run(folder, "commit", "-qm", "start")
    return folder


def committed(folder: Path, name: str, text: str) -> str:
    (folder / name).parent.mkdir(parents=True, exist_ok=True)
    (folder / name).write_text(text)
    git_run(folder, "add", name)
    git_run(folder, "-c", "user.email=t@example.com", "-c", "user.name=T", "commit", "-qm", f"the {name}")
    return git_run(folder, "rev-parse", "HEAD").stdout.strip()


def workspace_made(app: App, inner: tuple[str, ...] = ("platform", "mobile"), unignored: tuple[str, ...] = ()) -> Path:
    """A workspace of repositories: the project's own repository ignoring each inner one held at its top, each inner one a repository of its own with a commit."""
    root = app.config.root
    ignored = "".join(f"/{name}/\n" for name in inner)
    repository_made(root, {".gitignore": f".journal/\n{ignored}", "README.md": "the workspace\n"})
    for name in (*inner, *unignored):
        repository_made(root / name, {"app.php": "<?php\n// the first line\n"})
    return root


def worktree_worker(app: App, monkeypatch, brief: str, n: int = 1, libraries: tuple[str, ...] = ("--no-libraries",)):
    """A worker dispatched with a worktree on a task of the brief given, its library folders as named, clocked in; its row, its folder and its caller."""
    from journal.repositories.workers import Workers
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, actor: None)
    kept_conversation(app, monkeypatch)
    console = app.console()
    if n == 1:
        hook(app, "SessionStart")
    console.run(["task", "create", f"the job {n}", "--brief", brief], AGENT)
    dispatched_line = console.run(["worker", "dispatch", f"Worker {n}", "--task", str(n), "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet", "--worktree", *libraries], AGENT)
    assert dispatched_line.code == 0, dispatched_line.error
    with app.container.get(Scope).environment(MAIN):
        workers = app.container.get(Workers)
        worker = workers.save(workers.find(n).with_(token_hash="h", session=f"w-{n}", resume=f"w-{n}").ready(1.0), Actor.system())
        return worker, app.container.get(WorkerBranch).folder(worker), Caller.worker("main", n, f"w-{n}", "claude")


def worker_row(app: App, n: int = 1):
    from journal.repositories.workers import Workers
    with app.container.get(Scope).environment(MAIN):
        return app.container.get(Workers).find(n)


def proved_and_out(app: App, caller, proof: str = "app.php:1") -> object:
    console = app.console()
    console.run(["proof", "1", proof], caller)
    return console.run(["clock-out", "the work is in"], caller)


def checked_and_merged(app: App, n: int = 1):
    console = app.console()
    console.run(["worker", "check", str(n), "1"], AGENT)
    return console.run(["worker", "merge", str(n)], AGENT)


def test_a_workers_report_names_its_task_and_its_clock_out_writes_no_second_mark(app: App, monkeypatch):
    from journal.repositories.messages import Messages
    repository_made(app.config.root, {".gitignore": ".journal/\n", "README.md": "one\n"})
    _, worktree, caller = worktree_worker(app, monkeypatch, "the readme")
    committed(worktree, "notes.md", "the notes\n")
    assert proved_and_out(app, caller, "notes.md:1").code == 0
    app.runtime().deferred.drain()
    with app.container.get(Scope).environment(MAIN):
        messages = app.container.get(Messages).all()
        reports = [m for m in messages if m.data.get("kind") == "report"]
        assert reports and reports[-1].data["task"] == 1 and reports[-1].data["worker_id"] == 1, "the report names the worker and the task it reports on"
        assert not [m for m in messages if m.text.endswith("finished, ready to check")], "the clock-out writes no second mark beside the report's card"


def test_a_queue_reported_at_its_end_is_timed_from_its_dispatch_not_from_its_last_move(app: App):
    from journal.models.support.worker_moves import WorkerMoves
    from journal.models.worker import Worker
    worker = Worker(name="w", brief="b", moves=WorkerMoves((("dispatched", 100.0), ("clocked in", 110.0), ("moved on to task 2", 900.0), ("moved on to task 3", 1500.0))))
    assert worker.job_start_time() == 100.0, "a move inside the queue is the same job going on, so a report at the queue's end is never a quick or tiny one for its last task alone"


def test_a_finished_task_sent_back_short_puts_the_worker_back_on_it_and_one_merge_then_takes_all_three(app: App, monkeypatch):
    from journal.models.support.ref import Ref
    from journal.repositories.tasks import Tasks
    from journal.repositories.workers import Workers
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, actor: None)
    repository_made(app.config.root, {".gitignore": ".journal/\n", "README.md": "one\n"})
    _, worktree, caller = worktree_worker(app, monkeypatch, "the readme")
    console = app.console()
    for title in ("the second job", "the third job"):
        console.run(["task", "create", title, "--brief", f"{title}: done when it is in"], AGENT)
    assert console.run(["worker", "queue", "1", "2", "3"], AGENT).code == 0
    for n in (1, 2, 3):
        committed(worktree, f"notes{n}.md", f"note {n}\n")
        proved_and_out(app, caller, f"notes{n}.md:1")
    short = console.run(["worker", "check", "1", "1", "--task", "1", "--short", "note 1 names no section"], AGENT)
    assert short.code == 0 and "point 1 of task 1 sent back short" in short.text, short.error
    with app.container.get(Scope).environment(MAIN):
        tasks = app.container.get(Tasks)
        assert tasks.holder_task_ids(Ref("workers", 1)) == (1,) and set(tasks.finished_task_ids(Ref("workers", 1))) == {2, 3}, "the worker is back on the task sent back, and the others wait for the merge"
        app.container.get(Workers).save(worker_row(app).with_(token_hash="h").ready(2.0), Actor.system())
    committed(worktree, "notes1.md", "note 1, its section\n")
    out = proved_and_out(app, caller, "notes1.md:1")
    assert out.code == 0 and "clocked out of task 1" in out.text, out.error
    for task in (1, 2, 3):
        assert console.run(["worker", "check", "1", "1", "--task", str(task)], AGENT).code == 0
    merged = console.run(["worker", "merge", "1"], AGENT)
    assert merged.code == 0, merged.error
    with app.container.get(Scope).environment(MAIN):
        assert [tasks.find(n).state for n in (1, 2, 3)] == ["completed", "completed", "completed"], "one merge closes all three"


def test_a_test_run_going_in_the_checkout_a_merge_lands_in_is_stopped_and_marked_invalid_counting_neither_passed_nor_failed(app: App, monkeypatch, tmp_path):
    from journal.features.shell.support.output_process_card import OutputProcessCard
    from journal.features.workers.support.worker_branch import WorkerBranch
    from journal.repositories.command_outputs import CommandOutputs
    from journal.support.card_outcome import CardOutcome
    repository_made(app.config.root, {".gitignore": ".journal/\n", "README.md": "one\n"})
    _, worktree, caller = worktree_worker(app, monkeypatch, "the readme")
    committed(worktree, "notes1.md", "note 1\n")
    assert proved_and_out(app, caller, "notes1.md:1").code == 0
    ShellVerbs(app).split("pytest tests", str(tmp_path / "suite"))
    with app.container.get(Scope).environment(MAIN):
        outputs = app.container.get(CommandOutputs)
        checkout = app.container.get(WorkerBranch).checkout(worker_row(app))
        running = outputs.save(outputs.chain_output("suite").with_(ran_in=str(checkout)), Actor.system())
    assert checked_and_merged(app).code == 0
    app.runtime().deferred.drain()
    with app.container.get(Scope).environment(MAIN):
        run = outputs.find(running.id)
        assert run.ended and run.invalid_reason == "worker 1's merge of task 1", "the run going when the merge landed is stopped and names the merge"
        assert not run.is_success() and app.container.get(OutputProcessCard).outcome(run) == CardOutcome.WARNED, "it counts as neither passed nor failed"
        assert "the code changed under it" in run.ending(), "its card says why"


def queue_sent_back_short(app: App, monkeypatch):
    """A worker that went through a queue of two tasks, the first checked and the second sent back short; its caller."""
    repository_made(app.config.root, {".gitignore": ".journal/\n", "README.md": "one\n"})
    _, worktree, caller = worktree_worker(app, monkeypatch, "the readme")
    console = app.console()
    console.run(["task", "create", "the second job", "--brief", "the second job: done when it is in"], AGENT)
    assert console.run(["worker", "queue", "1", "2"], AGENT).code == 0
    for n in (1, 2):
        committed(worktree, f"notes{n}.md", f"note {n}\n")
        proved_and_out(app, caller, f"notes{n}.md:1")
    assert console.run(["worker", "check", "1", "1", "--task", "1"], AGENT).code == 0
    short = console.run(["worker", "check", "1", "1", "--task", "2", "--short", "note 2 names no section"], AGENT)
    assert short.code == 0 and "point 1 of task 2 sent back short" in short.text, short.error
    app.runtime().deferred.drain()
    return caller


def test_the_second_task_of_a_queue_sent_back_short_stays_in_its_workers_hands_and_the_worker_clocks_in_on_it(app: App, monkeypatch):
    from journal.models.support.ref import Ref
    from journal.repositories.tasks import Tasks
    caller = queue_sent_back_short(app, monkeypatch)
    with app.container.get(Scope).environment(MAIN):
        tasks = app.container.get(Tasks)
        assert tasks.holder_task_ids(Ref("workers", 1)) == (2,) and tasks.finished_task_ids(Ref("workers", 1)) == (1,), "the task sent back is the worker's current task, and the first waits for the merge"
    arrived = app.console().run(["clock-in"], caller)
    assert arrived.code == 0 and "clocked in on task 2" in arrived.text, arrived.error
    with app.container.get(Scope).environment(MAIN):
        assert app.container.get(Tasks).find(2).state == "started", "its task is started under it"


def test_a_worker_sent_back_whose_runs_end_twice_without_clocking_out_is_named_to_the_agent_and_not_sent_again(app: App, monkeypatch):
    from journal.features.workers.listeners.unfinished_clock_out import CLOCK_OUT_REQUEST
    from journal.repositories.entries import Entries
    from journal.repositories.workers import Workers
    queue_sent_back_short(app, monkeypatch)
    runner = app.container.get(WorkerRunner)

    def ended():
        with app.container.get(Scope).environment(MAIN):
            for path in runner.outputs(worker_row(app)):
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text("")
            app.container.get(Workers).save(worker_row(app).with_(token_hash="h"), Actor.system())
            runner.finish(worker_row(app), 0, Actor.system())
        app.runtime().deferred.drain()
        return worker_row(app)

    first = ended()
    assert first.state == "dispatched" and CLOCK_OUT_REQUEST in first.brief and "Go on with your task" not in first.brief, "a run sent back that ends without moving on in its queue is no turn of the queue: the journal asks it once to clock out"
    second = ended()
    assert second.state == WorkerState.UNFINISHED and CLOCK_OUT_REQUEST in second.brief, "its second run ended the same way, so it is not sent again"
    with app.container.get(Scope).environment(MAIN):
        told = [entry.data["values"]["n"] for entry in app.container.get(Entries).kind_entries("nudge") if entry.data["key"] == "workers.run_unfinished"]
    assert told == ["1"], "the agent that dispatched it is told once, naming it"


def test_npm_exec_is_labelled_by_the_program_it_runs_and_one_title_given_to_different_work_raises_a_report(app: App, tmp_path):
    from types import SimpleNamespace
    from journal.features.shell.support.activity_label import ActivityLabel
    labels = app.container.get(ActivityLabel)
    from journal.features.shell.support.reader import Reader
    from journal.features.shell.support.reader_judge import MIXED_TITLE, ReaderJudge
    from journal.features.shell.support.readers import Readers
    assert labels.line_label("npm --prefix src/web exec -- vitest run tests/a.test.js") == "testing" and labels.line_label("npm exec -- vitest run") == "testing", "npm exec runs the program after it"
    assert labels.line_label("npm --prefix src/web run build") == "building", "and npm --prefix <folder> run build is still a build"

    def run(number: int, command: str, text: str) -> SimpleNamespace:
        folder = tmp_path / f"run-{number}"
        folder.mkdir()
        (folder / "parts").write_text("R-\n")
        (folder / "0.part").write_text(command)
        (folder / "0.out").write_text(text)
        return SimpleNamespace(command=command, ended=True, folder=str(folder), watch_title="Building the viewer")

    reader = Reader("viewer-build", "the viewer", label="Building the viewer")
    same = [run(1, "npm run build", "built in 3s\n"), run(2, "npm --prefix src/web run build", "built in 4s\n")]
    mixed = [run(3, "npm --prefix src/web exec -- vitest run", " Tests  4 passed\n"), *same]
    judge = lambda runs, aliases={}: ReaderJudge(app.container.get(Readers), None, None, None, None, SimpleNamespace(reader_ended=lambda name, last: runs), None, None, SimpleNamespace(index=lambda: aliases), None, None, SHAPES)
    assert judge(same).mixed_title(reader, same[0]) == [], "runs of one program under one title raise nothing"
    found = judge(mixed).mixed_title(reader, mixed[0])
    assert len(found) == 1 and MIXED_TITLE in found[0][0] and "vitest" in found[0][0] and "npm" in found[0][0], "one title on a test run and a build is raised as a report"
    from journal.models.alias import Alias
    aliases = {"suite": Alias(name="suite", line="python3 -m pytest")}
    tests = [run(4, "journal suite", "3 passed\n"), run(5, "timeout 60 python3 -m pytest -q", "3 passed\n")]
    assert judge(tests, aliases).mixed_title(reader, tests[0]) == [], "an alias is judged by the line it runs, so journal suite and python3 -m pytest are one program"
    assert judge([run(6, "npm run build", "built in 3s\n"), run(7, "journal suite", "3 passed\n")], aliases).mixed_title(reader, tests[0]), "a build and an aliased test run still raise one"
    from journal.features.shell.support.reader_commands import ReaderCommands
    install = Reader("install-run", "an install", label="Installing the journal", commands=ReaderCommands.parsed("install.sh, sh install.sh"))
    chained = run(8, "git checkout -q main && sh install.sh", "installed commit 942b841\n")
    (Path(chained.folder) / "parts").write_text("R-\nR-\n")
    (Path(chained.folder) / "0.part").write_text("git checkout -q main")
    (Path(chained.folder) / "1.part").write_text("sh install.sh")
    (Path(chained.folder) / "1.out").write_text("installed commit 942b841\n")
    assert judge([chained, run(9, "sh install.sh", "installed commit 942b841\n")]).mixed_title(install, chained) == [], "a chain is named by the part its reader reads, so git before the install is not a second program (reader reports 196 and 197)"


@pytest.mark.parametrize("lines, fraction", [
    (["starting", "12/40 files", "13/40 files"], 13 / 40),
    (["[3/10] building", "[4/10] building"], 4 / 10),
    (["Step 3/10: installing"], 3 / 10),
    (["working: 3 of 10"], 3 / 10),
    (["done (3 of 10)"], 3 / 10),
    (["item 3 out of 10 done"], 3 / 10),
    (["collected 40 items", "PASSED tests/a", "PASSED tests/b", "PASSED tests/c", "PASSED tests/d"], 4 / 40),
    (["Found 12 servers", "Deployed web-1", "Deployed web-2", "Deployed web-3"], 3 / 12),
    (["Deploying to 8 hosts", "host-a ok", "host-b ok"], 2 / 8),
])
def test_a_run_printing_a_count_of_a_total_in_any_common_form_gets_a_progress_pattern_that_reads_its_fraction(lines, fraction):
    from journal.features.shell.support.reader import Reader
    from journal.features.shell.support.reader_judge import ReaderJudge
    from journal.features.shell.support.starting_readers import StartingReaders
    progress, step = StartingReaders.progress_patterns(lines)
    reader = Reader("counted", "the counted runs", ".", progress_pattern=progress, step_pattern=step)
    assert reader.progress(lines).fraction() == pytest.approx(fraction), "the guessed pattern reads the run's own fraction"
    assert "--progress" in ReaderJudge.progress_fix("a command", lines), "and the report's fix suggests a --progress pattern"


def test_a_workspace_worker_gets_worktrees_of_the_repositories_its_brief_names_as_whole_words_in_any_case(app: App, monkeypatch):
    workspace_made(app, ("platform", "mobile", "docs"))
    worker, folder, _ = worktree_worker(app, monkeypatch, "fix the Platform invoices and their docstrings")
    assert worker.repositories == ("platform",), "Platform names platform in any case, and docstrings does not name docs"
    assert (folder / "platform" / ".git").is_file() and not (folder / "mobile").exists() and not (folder / "docs").exists()
    assert git_run(app.config.root / "platform", "branch", "--list", "worker/1-Worker-1").stdout.strip(), "the inner worktree is on the worker's branch in its own repository"


def test_a_workspace_worker_whose_brief_names_no_repository_gets_a_worktree_of_each(app: App, monkeypatch):
    workspace_made(app, ("platform", "mobile"))
    worker, folder, _ = worktree_worker(app, monkeypatch, "tidy the shared settings everywhere")
    assert worker.repositories == ("mobile", "platform")
    assert (folder / "platform" / ".git").is_file() and (folder / "mobile" / ".git").is_file()


def test_a_nested_repository_the_project_does_not_ignore_and_one_with_no_commit_are_no_inner_repositories(app: App, monkeypatch):
    root = workspace_made(app, ("platform",), unignored=("loose",))
    empty = root / "empty"
    empty.mkdir()
    git_run(empty, "init", "-q")
    (root / ".gitignore").write_text(".journal/\n/platform/\n/empty/\n")
    committed(root, ".gitignore", ".journal/\n/platform/\n/empty/\n/loose-not/\n")
    worker, folder, caller = worktree_worker(app, monkeypatch, "work on loose, empty and platform")
    assert worker.repositories == ("platform",), "an unignored nested repository and one with no commit get no worktree"
    committed(folder, "notes.md", "notes\n")
    assert proved_and_out(app, caller, "notes.md:1").code == 0, "and the outer worktree's clock-out is not blocked by either"


def test_commits_in_the_project_and_two_inner_repositories_each_merge_into_their_own_branch(app: App, monkeypatch):
    from journal.repositories.tasks import Tasks
    root = workspace_made(app, ("platform", "mobile"))
    worker, folder, caller = worktree_worker(app, monkeypatch, "the totals in platform and mobile")
    committed(folder, "README.md", "the workspace, with totals\n")
    committed(folder / "platform", "totals.php", "<?php // totals\n")
    committed(folder / "mobile", "totals.php", "<?php // totals on the phone\n")
    assert worker_row(app).repositories == ("mobile", "platform")
    assert proved_and_out(app, caller, "platform/totals.php:1").code == 0
    merged = checked_and_merged(app)
    assert merged.code == 0, merged.error
    assert (root / "platform" / "totals.php").is_file() and (root / "mobile" / "totals.php").is_file() and "with totals" in (root / "README.md").read_text()
    with app.container.get(Scope).environment(MAIN):
        outcome = app.container.get(Tasks).find(1).outcome
    assert "platform " in outcome and "mobile " in outcome, f"the outcome names each repository's commit: {outcome}"


def test_touched_files_across_repositories_carry_their_repository_folder(app: App, monkeypatch):
    workspace_made(app, ("platform",))
    worker, folder, _ = worktree_worker(app, monkeypatch, "platform totals")
    committed(folder, "README.md", "changed\n")
    committed(folder / "platform", "totals.php", "<?php\n")
    assert set(app.container.get(WorkerBranch).touched(worker_row(app))) == {"README.md", "platform/totals.php"}


def test_an_uncommitted_file_in_an_inner_worktree_is_committed_by_the_journal_at_clock_out_whatever_the_users_git_config(app: App, monkeypatch):
    workspace_made(app, ("platform",))
    _, folder, caller = worktree_worker(app, monkeypatch, "platform totals")
    git_run(folder / "platform", "config", "status.branch", "true")
    git_run(folder / "platform", "config", "color.status", "always")
    (folder / "platform" / "draft.php").write_text("<?php\n")
    out = proved_and_out(app, caller)
    assert out.code == 0, out.error
    assert git_run(folder / "platform", "status", "--porcelain").stdout == "" and "draft.php" in git_run(folder / "platform", "show", "--name-only", "--format=").stdout, "the journal committed the worker's file under its task"


def test_files_written_into_a_repository_folder_the_worker_has_no_worktree_of_refuse_clock_out(app: App, monkeypatch):
    workspace_made(app, ("platform", "mobile"))
    _, folder, caller = worktree_worker(app, monkeypatch, "platform totals")
    (folder / "mobile").mkdir()
    (folder / "mobile" / "lost.php").write_text("<?php\n")
    out = proved_and_out(app, caller)
    assert out.code != 0 and "mobile/" in out.error, "rather than lose them when the worktree is removed"


def test_a_rebase_conflict_in_an_inner_repository_merges_nothing_anywhere(app: App, monkeypatch):
    root = workspace_made(app, ("platform",))
    _, folder, caller = worktree_worker(app, monkeypatch, "platform totals")
    committed(folder, "README.md", "changed by the worker\n")
    committed(folder / "platform", "app.php", "<?php\n// the worker's line\n")
    assert proved_and_out(app, caller).code == 0
    committed(root / "platform", "app.php", "<?php\n// the user's line\n")
    project_head, platform_head = git_run(root, "rev-parse", "HEAD").stdout.strip(), git_run(root / "platform", "rev-parse", "HEAD").stdout.strip()
    refused = checked_and_merged(app)
    assert refused.code != 0 and "conflict in platform/app.php" in refused.error, refused.error
    assert git_run(root, "rev-parse", "HEAD").stdout.strip() == project_head and git_run(root / "platform", "rev-parse", "HEAD").stdout.strip() == platform_head


def test_a_merge_refused_on_a_clash_records_the_files_for_the_orchestrator_and_sends_the_worker_back_by_itself(app: App, monkeypatch):
    import json as json_module
    from journal.db.connection import Connection
    from journal.repositories.proofs import Proofs
    from journal.repositories.tasks import Tasks
    root = workspace_made(app, ("platform",))
    _, folder, caller = worktree_worker(app, monkeypatch, "platform totals")
    committed(folder / "platform", "app.php", "<?php\n// the worker's line\n")
    assert proved_and_out(app, caller, "platform/app.php:1").code == 0
    committed(root / "platform", "app.php", "<?php\n// the user's line\n")
    def proofs():
        with app.container.get(Scope).environment(MAIN):
            return [(proof.point, proof.state, proof.text) for proof in app.container.get(Proofs).task_proofs(app.container.get(Tasks).find(1))]

    def task_state():
        with app.container.get(Scope).environment(MAIN):
            return app.container.get(Tasks).find(1).state

    app.console().run(["worker", "check", "1", "1"], AGENT)
    checked = proofs()
    refused = app.console().run(["worker", "merge", "1"], AGENT)
    line = "worker 1's work was not merged: its branch clashes\nrebased onto the branch of"
    assert refused.code != 0 and refused.error.startswith(line) and "conflict in platform/app.php" in refused.error and 'went back to the worker to rebase by itself' in refused.error and refused.error.count("\n") == 3, refused.error
    cards = [(row["text"], json_module.loads(row["data"])) for row in app.container.get(Connection).all("SELECT text, data FROM messages WHERE text LIKE '%merge of task 1 refused%'")]
    assert len(cards) == 1 and cards[0][1]["lines"][1] == refused.error.splitlines()[0] and "platform/app.php" in cards[0][1]["lines"][0], "the line is recorded for the orchestrator as a card in its chat"
    app.runtime().deferred.drain()
    assert proofs() == checked and task_state() != "done", "the worker's proofs and task are kept"
    assert worker_row(app).state == WorkerState.DISPATCHED and "conflict in platform/app.php" in worker_row(app).brief and worker_row(app).clashes == 1, "and the branch went back to the worker to rebase, with no send by hand"


def test_a_merge_tells_the_orchestrator_to_run_the_whole_suite_and_a_failing_suite_after_it_names_the_merged_worker(app: App, monkeypatch):
    from journal.models.command_output import CommandOutput
    from journal.repositories.command_outputs import CommandOutputs
    from journal.repositories.entries import NUDGE, Entries
    root = workspace_made(app, ("platform",))
    _, folder, caller = worktree_worker(app, monkeypatch, "platform totals")
    user_set(app, "workers.mode", "orchestrator")
    committed(folder / "platform", "app.php", "<?php\n// the worker's line\n")
    assert proved_and_out(app, caller, "platform/app.php:1").code == 0
    merged = checked_and_merged(app)
    assert merged.code == 0 and "run the whole suite now: it has not passed since the merges of worker 1, Worker 1 (task 1)" in merged.text, merged.text + merged.error

    def ran(command: str, status: int) -> None:
        with app.container.get(Scope).environment(MAIN):
            app.container.get(CommandOutputs).save(CommandOutput(environment_id=MAIN, chain=f"chain-{command}-{status}", command=command, session="s1", ended=True, status=status), Actor.agent("s1"))

    broken = lambda: [entry.data["line"] for entry in app.container.get(Entries).all_matching(entry_type=NUDGE) if entry.data.get("key") == "workers.suite_failed_after_merges"]
    ran("journal suite tests/test_data.py -k unrelated", 1)
    hook(app, "Stop")
    assert broken() == [], "a failed run of part of the suite names nobody"
    ran("journal suite", 1)
    hook(app, "Stop")
    hook(app, "Stop")
    [line] = broken()
    assert nudge_reached(app, line, WorkersNudges.SUITE_BROKEN, workers="worker 1, Worker 1 (task 1)", n=1), "a failing whole suite after the merge names the merged worker once, with the send-back"
    ran("journal suite", 0)
    ran("journal suite", 1)
    hook(app, "Stop")
    assert len(broken()) == 1, "once the whole suite has passed, a later failure names no merge it passed after"


def test_an_orchestrators_stop_is_let_through_while_it_awaits_a_test_run_in_a_clocked_out_workers_worktree(app: App, monkeypatch):
    from journal.models.command_output import CommandOutput
    from journal.repositories.command_outputs import CommandOutputs
    workspace_made(app, ("platform",))
    _, folder, caller = worktree_worker(app, monkeypatch, "platform totals")
    user_set(app, "workers.mode", "orchestrator")
    committed(folder / "platform", "app.php", "<?php\n// the worker's line\n")
    assert proved_and_out(app, caller, "platform/app.php:1").code == 0
    with app.container.get(Scope).environment(MAIN):
        run = app.container.get(CommandOutputs).save(CommandOutput(environment_id=MAIN, chain="chain-worker-tests", command="python3 -m pytest tests", session="s1", ran_in=str(folder / "platform")), Actor.agent("s1"))
    awaited = app.console().run(["await", "begin", "the worker's tests", "--output", str(run.id)], AGENT)
    assert awaited.code == 0, awaited.error
    body = hook(app, "Stop")[1]
    assert "clocked out and their work waits" not in body.get("reason", ""), "while it awaits a test run in the worker's worktree the stop is let through"
    with app.container.get(Scope).environment(MAIN):
        outputs = app.container.get(CommandOutputs)
        outputs.save(outputs.find(run.id).ended_with(1, timing.time()), Actor.agent("s1"))
    app.runtime().deferred.drain()
    again = hook(app, "Stop", stop_hook_active=True)[1]
    assert again.get("decision") == "block" and nudge_reached(app, again["reason"], WorkersNudges.DELIVERED_WAITING, workers="worker 1 (Worker 1)"), again


def test_an_orchestrators_stop_is_let_through_while_it_awaits_a_run_started_by_a_cd_into_a_clocked_out_workers_worktree(app: App, monkeypatch):
    from journal.models.command_output import CommandOutput
    from journal.repositories.command_outputs import CommandOutputs
    workspace_made(app, ("platform",))
    _, folder, caller = worktree_worker(app, monkeypatch, "platform totals")
    user_set(app, "workers.mode", "orchestrator")
    committed(folder / "platform", "app.php", "<?php\n// the worker's line\n")
    assert proved_and_out(app, caller, "platform/app.php:1").code == 0
    with app.container.get(Scope).environment(MAIN):
        run = app.container.get(CommandOutputs).save(CommandOutput(environment_id=MAIN, chain="chain-cd-tests", command=f'(cd "{folder}" && python3 scripts/suite.py)', session="s1", ran_in=str(folder.parent)), Actor.agent("s1"))
    awaited = app.console().run(["await", "begin", "the worker's suite", "--output", str(run.id)], AGENT)
    assert awaited.code == 0, awaited.error
    body = hook(app, "Stop")[1]
    assert "clocked out and their work waits" not in body.get("reason", ""), "a run started by a cd into the worker's worktree counts as a run in it"


def test_a_worker_sent_a_new_job_naming_another_repository_gets_its_worktree_and_records_it(app: App, monkeypatch):
    root = workspace_made(app, ("platform", "mobile"))
    _, folder, caller = worktree_worker(app, monkeypatch, "platform totals")
    committed(folder / "platform", "totals.php", "<?php\n")
    assert proved_and_out(app, caller, "platform/totals.php:1").code == 0
    assert app.console().run(["worker", "send", "1", "now show the totals in mobile too"], AGENT).code == 0
    assert worker_row(app).repositories == ("platform", "mobile") and (folder / "mobile" / ".git").is_file()
    committed(folder / "mobile", "totals.php", "<?php // phone\n")
    assert git_run(root / "mobile", "log", "--oneline", "main..worker/1-Worker-1").stdout.strip(), "its commit is on the worker's branch of mobile"


def test_a_resumed_worker_whose_worktree_was_removed_gets_every_inner_worktree_back_and_merges_their_commits(app: App, monkeypatch):
    import shutil
    root = workspace_made(app, ("platform",))
    _, folder, caller = worktree_worker(app, monkeypatch, "platform totals")
    committed(folder / "platform", "totals.php", "<?php\n")
    assert proved_and_out(app, caller, "platform/totals.php:1").code == 0
    shutil.rmtree(folder)
    assert app.console().run(["worker", "send", "1", "finish the job"], AGENT).code == 0
    assert (folder / "platform" / "totals.php").is_file(), "the inner worktree is back on its branch, with its commit"
    assert proved_and_out(app, caller, "platform/totals.php:1").code == 0
    merged = checked_and_merged(app)
    assert merged.code == 0 and (root / "platform" / "totals.php").is_file(), merged.error


def test_a_worktree_worker_s_run_is_handed_the_worker_with_its_repositories_already_stored(app: App, monkeypatch):
    """GitHub issue 44: the run's thread saved the worker it was handed, taken before the repositories were stored, and a lost race left them empty."""
    workspace_made(app, ("platform",))
    handed = []
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, actor: handed.append((worker.repositories, worker.branch)))
    hook(app, "SessionStart")
    console = app.console()
    console.run(["task", "create", "the job", "--brief", "platform totals"], AGENT)
    dispatched = console.run(["worker", "dispatch", "Worker 1", "--task", "1", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet", "--worktree", "--no-libraries"], AGENT)
    assert dispatched.code == 0, dispatched.error
    assert handed == [(("platform",), handed[0][1])] and handed[0][1], f"the run was handed {handed}"
    assert worker_row(app).repositories == ("platform",)


def test_after_a_merge_every_repository_keeps_the_worker_branch_and_worktree_moved_up_to_the_merged_tip(app: App, monkeypatch):
    root = workspace_made(app, ("platform", "mobile"))
    _, folder, caller = worktree_worker(app, monkeypatch, "platform and mobile totals")
    committed(folder / "platform", "totals.php", "<?php\n")
    assert proved_and_out(app, caller, "platform/totals.php:1").code == 0
    assert checked_and_merged(app).code == 0
    app.runtime().deferred.drain()
    for checkout in (root, root / "platform", root / "mobile"):
        assert git_run(checkout, "branch", "--list", "worker/1-Worker-1").stdout.strip(), f"the worker branch stays in {checkout.name}"
        assert "1-Worker-1" in git_run(checkout, "worktree", "list").stdout, f"the worktree stays in {checkout.name}"
        assert git_run(checkout, "merge-base", "--is-ancestor", "HEAD", "worker/1-Worker-1").returncode == 0, f"moved up to the merged tip in {checkout.name}"
    assert (folder / "platform" / "totals.php").is_file()


def test_a_single_repository_worker_knows_no_files_once_its_branch_is_gone(app: App, monkeypatch):
    root = repository_made(app.config.root, {".gitignore": ".journal/\n", "README.md": "one\n"})
    worker, folder, _ = worktree_worker(app, monkeypatch, "the readme")
    assert worker.repositories == ()
    git_run(root, "worktree", "remove", "--force", str(folder))
    git_run(root, "branch", "-D", "worker/1-Worker-1")
    assert app.container.get(WorkerBranch).touched(worker_row(app)) is None


def libraries_made(root: Path, *folders: str) -> None:
    """Installed library folders in a checkout, ignored by its git as installed ones are, each with a file in it."""
    ignore = root / ".gitignore"
    ignore.write_text((ignore.read_text() if ignore.is_file() else "") + "".join(f"/{folder}/\n" for folder in folders))
    git_run(root, "add", ".gitignore")
    git_run(root, "commit", "-qm", "ignore the libraries")
    for folder in folders:
        (root / folder / "package").mkdir(parents=True)
        (root / folder / "package" / "index.js").write_text("module.exports = 1;\n")


def library_dispatch(app: App, monkeypatch, *flags: str):
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, actor: None)
    hook(app, "SessionStart")
    console = app.console()
    console.run(["task", "create", "the job", "--brief", "platform totals"], AGENT)
    return console.run(["worker", "dispatch", "Worker 1", "--task", "1", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet", *flags], AGENT)


def test_linked_and_copied_library_folders_reach_the_worktree_and_every_inner_one_and_leave_it_clean(app: App, monkeypatch):
    root = workspace_made(app, ("platform", "mobile"))
    libraries_made(root, "node_modules")
    libraries_made(root / "platform", "vendor", "node_modules")
    worker, folder, caller = worktree_worker(app, monkeypatch, "platform and mobile totals", libraries=("--libraries", "node_modules", "--copies", "vendor"))
    assert worker.library_links == ("node_modules",) and worker.library_copies == ("vendor",)
    assert (folder / "node_modules").is_symlink() and (folder / "node_modules").resolve() == (root / "node_modules").resolve()
    assert (folder / "platform" / "node_modules").is_symlink() and (folder / "platform" / "node_modules").resolve() == (root / "platform" / "node_modules").resolve()
    copy = folder / "platform" / "vendor"
    assert copy.is_dir() and not copy.is_symlink() and (copy / "package" / "index.js").read_text() == "module.exports = 1;\n", "vendor is a copy of its own"
    assert not (folder / "mobile" / "node_modules").exists(), "a folder the checkout does not hold is not made"
    (copy / "package" / "index.js").write_text("changed\n")
    assert (root / "platform" / "vendor" / "package" / "index.js").read_text() == "module.exports = 1;\n", "and changing the copy leaves the main checkout's alone"
    assert app.container.get(WorkerBranch).remaining(worker_row(app)) == [], "the links and copies are kept out of git, so clock-out counts none of them"
    committed(folder / "platform", "totals.php", "<?php\n")
    assert proved_and_out(app, caller, "platform/totals.php:1").code == 0
    assert checked_and_merged(app).code == 0
    assert (root / "node_modules" / "package" / "index.js").is_file() and (root / "platform" / "vendor" / "package" / "index.js").is_file(), "removing the worktree leaves the main checkout's libraries whole"


def test_a_worker_is_told_which_library_folders_are_links_and_how_to_change_one(app: App, monkeypatch):
    root = repository_made(app.config.root, {".gitignore": ".journal/\n", "README.md": "one\n"})
    libraries_made(root, "node_modules", "vendor")
    worker, _, _ = worktree_worker(app, monkeypatch, "the readme", libraries=("--libraries", "node_modules", "--copies", "vendor"))
    told = app.container.get(WorkerRunner).instructed(worker.with_(resume=""))
    assert "node_modules: links to the main checkout's folders" in told and "`rm <folder>`" in told and "vendor: copies of your own" in told


def test_a_renewed_worktree_gets_its_library_links_back_and_keeps_a_folder_the_worker_installed_itself(app: App, monkeypatch):
    import shutil
    root = repository_made(app.config.root, {".gitignore": ".journal/\n", "README.md": "one\n"})
    libraries_made(root, "node_modules", "vendor")
    _, folder, caller = worktree_worker(app, monkeypatch, "the readme", libraries=("--libraries", "node_modules,vendor"))
    (folder / "vendor").unlink()
    (folder / "vendor").mkdir()
    (folder / "vendor" / "own.php").write_text("<?php\n")
    assert proved_and_out(app, caller, "README.md:1").code == 0
    shutil.rmtree(folder / "node_modules") if not (folder / "node_modules").is_symlink() else (folder / "node_modules").unlink()
    assert app.console().run(["worker", "send", "1", "the next part"], AGENT).code == 0
    assert (folder / "node_modules").is_symlink(), "the link is made again"
    assert not (folder / "vendor").is_symlink() and (folder / "vendor" / "own.php").is_file(), "a folder the worker installed itself stays"


def test_the_messages_of_the_releases_an_update_crossed_are_kept_until_the_projects_first_agent_reads_them(app: App, monkeypatch):
    from journal.features.updates.seeds.version_change import VersionChange
    from journal.features.updates.support import release_texts
    from journal.repositories.journal_versions import JournalVersions
    from journal.repositories.release_messages import ReleaseMessages
    monkeypatch.setitem(release_texts.MESSAGES, "4.5.1", "the old news")
    monkeypatch.setitem(release_texts.MESSAGES, "99.0.0", "not crossed yet")
    versions, rows = app.container.get(JournalVersions), app.container.get(ReleaseMessages)
    booted = lambda previous: (versions.save(versions.current().with_(version=previous), Actor.system()), app.container.get(VersionChange).run())
    booted("4.6.0")
    booted("4.5.0")
    assert sorted(row.version for row in rows.unread()) == sorted(["4.5.1", "4.6.0", "4.13.0"]), "two updates with no agent between keep the messages of both, each once, and none past the version run now"
    told = json.dumps(hook(app, "SessionStart")[1])
    assert "3 unread release messages" in told and "journal update messages" in told, told
    assert "release messages" not in json.dumps(hook(app, "SessionStart")[1]), "pointed at them once a session"
    shown = app.console().run(["update", "messages"], AGENT).text
    assert "4.5.1: the old news" in shown and "4.13.0: a worker's worktree can be set up your project's way" in shown and "workers.preparation_commands" in shown and "--copies" in shown, shown
    assert rows.unread() == [] and app.console().run(["update", "messages"], AGENT).text == "no release message is unread\n", "read once, for the whole project"
    other = {"session_id": "s2"}
    assert "release messages" not in json.dumps(hook(app, "SessionStart", **other)[1]), "another agent is told nothing"


def test_a_plugin_card_raised_on_a_workers_merge_is_kept_in_the_merges_record_and_not_written_to_the_chat(app: App, tmp_path):
    import shutil
    from journal.events.clock_ticked import ClockTicked
    from journal.events.worker_merge_event import WorkerMergeEvent
    from journal.features.plugins.support.plugin_answer import PluginAnswer
    from journal.features.plugins.support.plugin_card import PluginCard
    from journal.features.plugins.support.plugin_relay import MERGE_CARDS, PluginRelay
    from journal.repositories.entries import Entries
    from journal.repositories.messages import Messages
    from journal.repositories.plugins import Plugins
    folder = tmp_path / "echo"
    shutil.copytree(Path(__file__).parent / "plugins" / "echo", folder)
    from journal.models.plugin import Plugin
    manifest = PluginManifest.parsed(json.loads((folder / "journal-plugin.json").read_text()))
    plugin = app.container.get(Plugins).save(Plugin(name="echo", source=str(folder), linked=True, manifest=manifest), Actor.user(1))
    relay = app.container.get(PluginRelay)
    answer = PluginAnswer(cards=(PluginCard(card_type="sin-found", label="1 sin in src/a.py", key="sins:src/a.py"),))
    shown = lambda: [m for m in app.container.get(Messages).rows() if m.data.get("plugin") == "echo"]
    merge = WorkerMergeEvent(environment_id=MAIN, worker=1, name="Mr Faraday", task=1, branch="worker/1", worktree="w")
    with app.container.get(Scope).environment(MAIN):
        relay.applied(plugin, merge, answer, "main", MAIN)
        app.runtime().deferred.drain()
        assert not shown() and [e.data["cards"][0]["label"] for e in app.container.get(Entries).kind_entries(MERGE_CARDS)] == ["1 sin in src/a.py"], "a card raised on a worker's merge is kept in the merge's record, never written to the chat"
        relay.applied(plugin, ClockTicked(time=0.0), answer, "main", MAIN)
        app.runtime().deferred.drain()
        assert len(shown()) == 1, "a card raised on any other moment still lands in the chat"


def test_a_keyed_plugin_card_answered_again_unchanged_stays_where_it_is_and_a_changed_one_moves(app: App, tmp_path):
    import shutil
    from journal.features.plugins.support.plugin_answer import PluginAnswer
    from journal.features.plugins.support.plugin_answers import PluginAnswers
    from journal.features.plugins.support.plugin_card import PluginCard
    from journal.repositories.messages import Messages
    from journal.repositories.plugins import Plugins
    folder = tmp_path / "echo"
    shutil.copytree(Path(__file__).parent / "plugins" / "echo", folder)
    from journal.models.message import Message
    from journal.models.plugin import Plugin
    manifest = PluginManifest.parsed(json.loads((folder / "journal-plugin.json").read_text()))
    plugin = app.container.get(Plugins).save(Plugin(name="echo", source=str(folder), linked=True, manifest=manifest), Actor.user(1))
    answers = app.container.get(PluginAnswers)
    cards = lambda: [m for m in app.container.get(Messages).rows() if m.data.get("plugin") == "echo"]
    raised = lambda label, detail="line 3": answers.apply(plugin, PluginAnswer(cards=(PluginCard(card_type="echoed", label=label, detail=detail, key="sins:a.py"),)), "main", MAIN, "")
    with app.container.get(Scope).environment(MAIN):
        raised("1 sin in a.py")
        app.runtime().deferred.drain()
        [first] = cards()
        app.container.get(Messages).save(Message(environment_id=MAIN, text="hello"), Actor.user(1))
        raised("1 sin in a.py")
        app.runtime().deferred.drain()
        assert [m.id for m in cards()] == [first.id], "the same card answered again, with the user's message between, stays at its first place"
        raised("2 sins in a.py", "lines 3, 4")
        app.runtime().deferred.drain()
        assert len(cards()) == 1 and cards()[0].id > first.id and cards()[0].text == "2 sins in a.py", "a changed card moves to the bottom"


def test_a_scoped_suite_run_counts_its_finished_tests_against_the_total_it_collected(tmp_path):
    import importlib.util
    spec = importlib.util.spec_from_file_location("suite_script", Path(__file__).parents[1] / "scripts" / "suite.py")
    suite = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(suite)
    output = tmp_path / "run.txt"
    output.write_text("collected 2 items\n.")
    assert suite.shard_progress(output) == (1, 2) and suite.progress_line(1, 2) == "running tests [ 50%] 1 of 2 finished", "one of the two tests counted, as the pytest reader's percentage reads it"
    output.write_text("collected 2 items\n..                                                                       [100%]\n2 passed in 0.6s\n")
    assert suite.progress_line(*suite.shard_progress(output)) == "running tests [100%] 2 of 2 finished", "and both once they ran"



def test_a_run_of_chosen_tests_is_sharded_unless_it_names_only_a_few_single_tests(tmp_path):
    import importlib.util
    spec = importlib.util.spec_from_file_location("suite_script", Path(__file__).parents[1] / "scripts" / "suite.py")
    suite = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(suite)
    assert suite.is_sharded(["tests/stories/worker", "tests/test_features.py", "-k", "worker", "-q"]), "folders, files and a filter run in shards"
    assert suite.is_sharded(["tests/test_features.py", "-q"]), "a whole file runs in shards"
    assert not suite.is_sharded(["tests/test_features.py::test_a", "tests/test_engine.py::test_b", "-q"]), "a few single tests start quicker as one process"
    assert suite.is_sharded([f"tests/test_features.py::test_{n}" for n in range(suite.FEW_TESTS + 1)]), "more than a few single tests run in shards"

# how long the team test waits for a change to travel between journals; under the sharded suite's load it can take far longer than alone
TEAM_SYNC_WAIT_SECONDS = 40
# the sync's retries back off to 30 seconds while the server is away, so a reconnect is waited on longer
RECONNECT_WAIT_SECONDS = 90


def synced(check) -> bool:
    deadline = timing.monotonic() + TEAM_SYNC_WAIT_SECONDS
    while timing.monotonic() < deadline:
        if check():
            return True
        timing.sleep(0.05)
    return False


def test_every_nudge_to_an_orchestrator_follows_the_short_line_rules_of_report_1066():
    import importlib
    from journal.engine.nudge import Nudge
    features = Path(__file__).resolve().parents[1] / "src" / "journal" / "features"
    nudges = {}
    for module in sorted(features.glob("*/*_nudges.py")):
        loaded = importlib.import_module(f"journal.features.{module.parent.name}.{module.stem}")
        for holder in vars(loaded).values():
            if isinstance(holder, type) and holder.__module__ == loaded.__name__:
                nudges.update({nudge.key: nudge for nudge in vars(holder).values() if isinstance(nudge, Nudge)})
    assert len(nudges) > 100, "every nudge of every feature is looked at"
    named = [key for key, nudge in nudges.items() if key.startswith("workers.") and "{{n}}" in nudge.title and "{{name}}" in nudge.title + nudge.brief]
    assert not named, f"a worker is named by its number alone, never also by its name: {named}"
    titled = [key for key, nudge in nudges.items() if "{{title}}" in nudge.title + nudge.brief and not key.startswith("triggers.")]
    assert not titled, f"a task, a plan or a check is given by its number, its title dropped; a trigger's words, which are the user's own, are the one exception: {titled}"
    short = {"workers.work_ready": 40, "workers.worker_quiet": 80, "workers.worker_sent_back": 40, "workers.run_unfinished": 50, "workers.worker_reported": 30, "workers.worker_test_run_failed": 45, "workers.worker_keeps_failing": 50, "workers.now_orchestrating": 75,
             "shell.reader_report_raised": 100, "tasks.wait_over": 70, "plans.the_user_approved_the_plan": 40}
    values = dict(n=1113, task=3128, count=12, tasks="3175, 3178, 3189", minutes=20, reports=93, failed=3, runs=2, last="Read src/a.py", point=2, cause="", outcome="output 19248 passed")
    for key, limit in short.items():
        line = nudges[key].create(**values).rendered()
        assert len(line) <= limit and "Lady" not in line and "{{" not in line, f"{key} is said short: {line!r}"
    assert "workers.worker_clocked_in" not in nudges, "an arrival the orchestrator dispatched is not told back to it"


def test_on_a_shared_journal_a_worker_branches_from_and_merges_into_its_environments_worktree_and_main_is_untouched(app: App):
    import subprocess
    from journal.features.workers.support.worker_branch import WorkerBranch
    from journal.features.workers.support.worker_runner import WorkerRunner
    from journal.models.worker import Worker
    from journal.repositories.environments import Environments
    from journal.repositories.workers import Workers
    from journal.support.worktree import Worktree
    from journal.sync.team_account import TEAM_FILE, TeamAccount

    root = app.config.root

    def git(*arguments, cwd=root):
        return subprocess.run(["git", *arguments], cwd=cwd, capture_output=True, text=True, check=True, timeout=30).stdout.strip()

    git("init", "-q")
    git("-c", "user.name=Ada", "-c", "user.email=ada@example.com", "commit", "-q", "--allow-empty", "-m", "first")
    main_before = git("rev-parse", "HEAD")
    environment = app.container.get(Environments).find(MAIN)
    own = Worktree(root, environment.name).created()
    (own / "env.txt").write_text("the environment's own work\n")
    git("add", "env.txt", cwd=own)
    git("-c", "user.name=Ada", "-c", "user.email=ada@example.com", "commit", "-q", "-m", "environment work", cwd=own)
    try:
        app.container.get(TeamAccount).write({"account_id": 1, "device": "d1"})
        worker = Worker(environment_id=MAIN, name="Mr Faraday", worktree=True, id=9001)
        branch = app.container.get(WorkerBranch)
        assert branch.checkout(worker) == own, "on a shared journal a worker's checkout is its environment's worktree"
        app.container.get(WorkerRunner).workplace(worker)
        folder = branch.folder(worker)
        assert (folder / "env.txt").is_file(), "the worker's branch is cut from the environment's branch, with its unmerged work"
        (folder / "worker.txt").write_text("the worker's work\n")
        git("add", "worker.txt", cwd=folder)
        git("-c", "user.name=Worker", "-c", "user.email=w@example.com", "commit", "-q", "-m", "worker work", cwd=folder)
        repository = branch.repositories(worker)[0]
        branch.merged(repository, worker)
        assert (own / "worker.txt").is_file(), "the worker's work is merged into the environment's worktree"
        assert git("rev-parse", "main" if git("branch", "--list", "main") else "master") == main_before, "and main is untouched"
    finally:
        (app.config.home / TEAM_FILE).unlink(missing_ok=True)


def updates_joined() -> None:
    import threading
    for thread in threading.enumerate():
        if thread.name == "updates":
            thread.join(10)


def came_back(updater: Updater, monkeypatch, version: str) -> None:
    """The journal booted on the version an update went to: the version it runs and the card the update left."""
    import time as timing
    from journal.features.updates.support import updater as updater_module
    from journal.features.updates.support.update_pause import UpdatePause
    monkeypatch.setattr(updater_module, "VERSION", version)
    updater.card.write(UpdatePause("4.0.0", version, "Restarting the journal", timing.time(), -1))
    updater.reconcile(timing.time())
    updates_joined()


def test_the_reader_judge_weighs_only_a_run_whose_output_the_card_could_read(app: App):
    from journal.features.shell.support.reader_commands import ReaderCommands
    from journal.features.shell.support.reader import Reader
    from journal.features.shell.support.reader_judge import ReaderJudge
    reader, judge = Reader("pytest", "the tests", pattern=".", commands=ReaderCommands(("pytest",))), app.container.get(ReaderJudge)
    assert judge.is_shown_run(judge.readers.read_part(reader, "python3 -m pytest -p no:warnings tests/test_x.py 2>&1")), "a plain run, its errors joined to its output, is shown"
    assert not judge.is_shown_run(judge.readers.read_part(reader, "S=/tmp/x\npython3 -m pytest -s tests/test_x.py > $S/out.txt 2>&1\nrm -f tests/test_x.py")), "a run whose output goes to a file shows nothing on the card"
    assert not judge.is_shown_run(judge.readers.read_part(reader, "command -v uv\npython3 -m pytest --version")), "asking the tool its version is no run of it"
    from journal.features.shell.support.card_line import CardLine
    assert not CardLine.is_poor("FAILED tests/test_supervisor.py::test_the_boot_menu_is_left_quietly_with_escape_or_ctrl_c_and_says_so_in_one_plain_line"), "a failed test's name is the line a person reads, however long"
    assert CardLine.is_poor("x" * 300), "any other long line still reads poorly"
    assert not CardLine.is_poor("ba2703f07 The Go facts the contract lacks, each with the rule that reads it (plan 4, task 101)"), "a commit subject is prose, however long"
    assert CardLine.is_poor('{"id": 12, "name": "' + "a" * 180 + '", "tags": ["x", "y"]}') and CardLine.is_poor('  File "/home/app/src/journal/features/shell/support/card_line.py", line 42, in is_poor'), "a long JSON line and a stack frame stay flagged"
    vitest = "   × the telephone rings at most once in two minutes, gathering every worker given work into one call that names each in turn 32ms"
    assert not CardLine.is_poor(CardLine.plain(vitest)) and not CardLine.is_poor(CardLine.plain(" FAIL  tests/figureVisor.test.js > the crosses and the ticks are the pixel pictures on the visor's screen in the run's colour")), "a test vitest or jest marks failed is named however long, as pytest's are"


def test_a_run_counts_as_running_while_its_heartbeat_is_fresh_and_one_that_stopped_beating_is_ended_and_holds_no_restart(app: App, monkeypatch):
    import os
    from journal.events.agent.ticked import Ticked
    from journal.features.shell.listeners.stopped_output_end import StoppedOutputEnd
    from journal.features.shell.support.restart_queue import RestartQueue
    from journal.models.command_output import CommandOutput
    from journal.repositories.command_outputs import CommandOutputs
    from journal.support.heartbeat import Heartbeat
    from journal.support.time_source import TimeSource
    sent = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda link, environment_id, verb, fields: sent.append((environment_id, verb, fields.get("name"))))
    monkeypatch.setattr(SupervisorLink, "hosting", lambda link: MAIN)
    monkeypatch.setattr(SupervisorLink, "running", lambda link, environments: [e for e in environments if e.row_id == MAIN])
    clock = app.container.get(TimeSource)
    clock.pin(timing.time())
    folder = app.config.root / "cut-run"
    folder.mkdir()
    (folder / "line").write_text("python3 scripts/suite.py -k x")
    outputs = app.container.get(CommandOutputs)
    with app.container.get(Scope).environment(MAIN):
        output = outputs.save(CommandOutput(chain="cut-run", command="python3 scripts/suite.py -k x", session="s1", folder=str(folder)).backgrounded(), Actor.system())
        assert [o.id for o in outputs.running(MAIN)] == [output.id], "a run that has not beaten yet counts as running for its first 30 seconds"
        before = clock.seconds() - 120
        os.utime(folder, (before, before))
        assert outputs.running(MAIN) == [], "a run that never beat 30 seconds after it began is not running"
        Heartbeat(folder).write(clock.seconds() - 10)
        assert [o.id for o in outputs.running(MAIN)] == [output.id] and [o.id for o in outputs.background("s1")] == [output.id], "a beat ten seconds ago keeps it running, in the background list too, however long since it began"
        clock.pin(clock.seconds() + 25)
        assert outputs.running(MAIN) == [] and outputs.background("s1") == [], "35 seconds after its last beat it is not running"
    assert app.container.get(RestartQueue).restart(MAIN, "") == [] and sent == [(MAIN, "restart", "journal")], "it never holds a restart"
    with app.container.get(Scope).environment(MAIN):
        app.container.get(StoppedOutputEnd).handle(Ticked(agent=agent_row(app), session="s1", environment_id=MAIN, time=clock.seconds(), silence_seconds=0.0))
        ended = outputs.find(output.id)
    assert ended.ended and ended.is_interrupted, "the next tick ends it as cut off"


def test_the_run_strip_lists_every_process_running_and_none_once_it_ends(app: App):
    import threading
    raw = "JOURNAL_ENV=main\0\0sleep 2\n"
    request = HttpRequest(f"http://127.0.0.1:{app.server().port}/shell/run", data=raw.encode(), method="POST", headers={"Content-Type": "application/octet-stream", "X-Journal-Env": "main", "X-Journal-Cwd": str(app.config.root), "X-Journal-Shell": "sh"})
    running = threading.Thread(target=lambda: urlopen(request, timeout=10).read(), daemon=True)
    running.start()
    listed = []
    for _ in range(40):
        listed = get_answer(app, "/journal/outputs/running", {"X-Journal-Env": "main"})[1]["outputs"]
        if listed:
            break
        timing.sleep(0.05)
    assert [(entry["command"], entry["docked"], entry["card"]) for entry in listed] == [("sleep 2", False, 0)], "a process running is listed, not docked, before it has a card"
    running.join(timeout=10)
    assert get_answer(app, "/journal/outputs/running", {"X-Journal-Env": "main"})[1]["outputs"] == [], "a process that ended is no longer listed"


def test_a_silent_command_beats_while_it_runs(app: App):
    import threading
    from journal.support.heartbeat import Heartbeat
    raw = "JOURNAL_ENV=main\0\0sleep 2\n"
    request = HttpRequest(f"http://127.0.0.1:{app.server().port}/shell/run", data=raw.encode(), method="POST", headers={"Content-Type": "application/octet-stream", "X-Journal-Env": "main", "X-Journal-Cwd": str(app.config.root), "X-Journal-Shell": "sh"})
    running = threading.Thread(target=lambda: urlopen(request, timeout=10).read(), daemon=True)
    running.start()
    outputs, beats = app.config.home / "runtime" / "outputs", []
    for _ in range(40):
        beats = [Heartbeat(folder).last_seconds() for folder in outputs.glob("*") if (folder / "heartbeat").is_file()] if outputs.is_dir() else []
        if beats:
            break
        timing.sleep(0.05)
    running.join(timeout=10)
    assert beats and abs(beats[0] - timing.time()) < 5, "the chain's watcher beats while the command prints nothing"


def project_copy_of_the_pytest_reader(app: App) -> None:
    """The reader judge weighs only the project's own readers, so a test of its reports reads with a project copy of the locked pytest reader."""
    from dataclasses import replace as replaced
    from journal.features.shell.support.readers import Readers
    readers = app.container.get(Readers)
    readers.add(replaced(readers.lookup("pytest"), name="dots-run"))


def test_a_commit_offers_an_update_at_most_once_an_hour_and_recap_docks_one_over_the_gathered_rows(app: App):
    import subprocess
    from datetime import datetime, timedelta, timezone
    from journal.repositories.messages import Messages
    from journal.repositories.reports import Reports
    root = app.config.root
    subprocess.run(["git", "init", "-q"], cwd=root, check=True, timeout=30)
    hook(app, "SessionStart")
    console, messages, reports = app.console(), app.container.get(Messages), app.container.get(Reports)

    def commit(subject):
        subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", subject], cwd=root, check=True, timeout=30)
        reply = json.dumps(hook(app, "PostToolUse", tool_name="Bash", tool_input={"command": "git commit -m x"}, tool_response={"stdout": "", "stderr": ""})[1])
        app.runtime().deferred.drain()
        return "then tell the user" in reply

    assert not commit("Start the parser"), "the first commit only starts the clock"
    with app.container.get(Scope).environment(MAIN):
        first = [m for m in messages.all() if m.data.get("shows") == "commits"][0]
        messages.save(first.with_(created_at=datetime.now(timezone.utc) - timedelta(hours=2)), Actor.system())
    assert commit("Finish the parser"), "an hour after the clock started, a commit drafts an update"
    assert not commit("Tidy the parser"), "the draft starts the clock again"
    console.run(["task", "create", "the parser", "--start"], AGENT)
    console.run(["task", "complete", "1", "--how", "it reads the grammar"], AGENT)
    told = console.run(["report", "changes"], AGENT).text
    assert "done" in told and "tasks:1" in told and "commits" in told, told
    assert console.run(["report", "recap", "The parser reads the grammar."], AGENT).code == 0
    app.runtime().deferred.drain()
    with app.container.get(Scope).environment(MAIN):
        update = reports.latest_update()[0]
        card = messages.with_key(f"made:report:{update.id}")
    assert update.abstract == "The parser reads the grammar." and {"done", "commits"} <= {item["section"] for item in update.items}, update.items
    assert card and card[0].data.get("docked"), "the update is docked at the bottom of the chat"
    with app.container.get(Scope).environment(MAIN):
        messages.save(messages.earliest_commit(datetime.fromtimestamp(0, timezone.utc))[0].with_(created_at=datetime.now(timezone.utc) - timedelta(hours=3)), Actor.system())
    assert not commit("Speed up the parser"), "nothing is offered while the update waits unread"
    assert console.run(["report", "note", "1", "the slow part"], AGENT).code == 0 and console.run(["report", "drop", "99"], AGENT).code != 0


def test_the_developer_profile_names_the_function_a_busy_thread_spends_its_time_in(app: App):
    import threading

    from journal.features.faults.support.thread_sampler import ThreadSampler

    stopping = threading.Event()

    def spinning_for_the_profile():
        while not stopping.is_set():
            sum(range(1000))

    worker = threading.Thread(target=spinning_for_the_profile, name="busy", daemon=True)
    worker.start()
    try:
        sample = ThreadSampler().sampled(0.3)
    finally:
        stopping.set()
        worker.join()
    assert sample.sample_count > 5 and any("spinning_for_the_profile" in place for place in sample.stack_functions), "a thread that works is seen in the function it works in"
    assert not any(place.startswith("MainThread: ") and "sampled" in place for place in sample.busy_functions), "the sampler never counts itself"


def test_a_watched_run_is_told_once_to_drop_its_time_limit_wrapper_from_its_alias_or_its_line(app: App):
    from journal.features.shell.support.shell_runner import ShellRunner
    from journal.support.command_classifier import CommandClassifier
    from journal.models.alias import Alias
    unlimited = app.container.get(CommandClassifier).time_unlimited
    assert unlimited("perl -e 'alarm 590; exec @ARGV' python3 -m pytest -q") == "python3 -m pytest -q" and unlimited("perl -e 'print 1' x") == "perl -e 'print 1' x"
    assert unlimited("timeout 600 npm test") == "npm test" and unlimited("gtimeout --signal=KILL 10m make") == "make" and unlimited("env CI=1 npm test") == "env CI=1 npm test", "only a wrapper that limits the time comes off"
    runner = app.container.get(ShellRunner)
    suite = Alias(name="suite", line="perl -e 'alarm 590; exec @ARGV' python3 -m pytest -q")
    told = [line.rendered() for line in runner.alias_wrapper_lines(suite)]
    assert len(told) == 1 and "alias suite" in told[0] and "python3 -m pytest -q" in told[0], "an alias that wraps itself is told to drop the wrapper, with its line without it"
    assert runner.alias_wrapper_lines(suite) == [], "once"
    assert len(runner.line_wrapper_lines("timeout 600 npm test")) == 1 and runner.line_wrapper_lines("timeout 300 npm test") == [], "a plain line likewise, once for its command"
    assert runner.line_wrapper_lines("python3 -m pytest -q") == [] and runner.alias_wrapper_lines(Alias(name="plain", line="make")) == [], "a run without a wrapper is told nothing"


def test_a_workers_chat_edits_terminal_and_outputs_are_read_by_its_session_and_its_row_names_its_agent(app: App, tmp_path):
    from journal.models.agent import Agent
    from journal.support.agent_role import AgentRole
    from journal.models.command_output import CommandOutput
    from journal.models.message import Message
    from journal.models.worker import Worker
    from journal.repositories.agents import Agents
    from journal.repositories.command_outputs import CommandOutputs
    from journal.repositories.messages import Messages
    from journal.repositories.workers import Workers
    hook(app, "SessionStart")
    agent = app.container.get(Agents).save(Agent(environment_id=1, session="w-1", provider="claude", state="void", role=AgentRole.WORKER), Actor.system())
    worker = app.container.get(Workers).save(Worker(environment_id=1, name="Mr. Babbage", brief="b", session="w-1"), Actor.system())
    messages = app.container.get(Messages)
    messages.save(Message(environment_id=1, author="agent", text="Reading the lexer.", session="w-1", thread=MessageThread.WORKER), Actor.agent("w-1"))
    messages.save(Message(environment_id=1, author="user", text="mind the tests", session="w-1", thread=MessageThread.WORKER), Actor.user(1))
    patch = [{"oldStart": 3, "newStart": 3, "lines": [" a", "-b", "+c", " d"]}]

    def as_worker(type_name: str, **body):
        return posted(app, "/hooks/claude", {"hook_event_name": type_name, "session_id": "w-1", **body}, {"X-Journal-Env": "main"})
    as_worker("PreToolUse", tool_name="Edit", tool_input={"file_path": str(app.config.root / "lex.py"), "old_string": "b", "new_string": "c"}, tool_use_id="e1")
    as_worker("PostToolUse", tool_name="Edit", tool_input={"file_path": str(app.config.root / "lex.py"), "old_string": "b", "new_string": "c"}, tool_response={"structuredPatch": patch}, tool_use_id="e1")
    as_worker("PreToolUse", tool_name="Bash", tool_input={"command": "pytest -q"}, tool_use_id="b1")
    as_worker("PostToolUse", tool_name="Bash", tool_input={"command": "pytest -q"}, tool_response="ok", tool_use_id="b1")
    app.runtime().deferred.drain()
    folder = tmp_path / "out"
    folder.mkdir()
    output = app.container.get(CommandOutputs).save(CommandOutput(environment_id=1, session="w-1", command="pytest -q", folder=str(folder)), Actor.agent("w-1"))

    def read(path: str):
        with urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/journal/{path}", headers={"X-Journal-Env": "main"}), timeout=5) as reply:
            return json.loads(reply.read())
    [row] = read(f"workers?ids={worker.id}")["rows"]
    assert row["agent"] == agent.id and row["session"] == "w-1", "a worker's row names the agent row that runs it"
    assert [m["text"] for m in read("chats/w-1")["rows"]] == ["Reading the lexer.", "mind the tests"], "the worker's own chat is read by its session"
    assert "Reading the lexer." not in [m["text"] for m in read("messages")["rows"]], "and never reaches the main chat"
    assert [(e["path"], e["added"], e["removed"]) for e in read(f"agents/{agent.id}/edits")["edits"]] == [("lex.py", 1, 1)], "its edits are read by its agent row"
    assert [line["command"] for line in read(f"agents/{agent.id}/terminal")] == ["pytest -q"], "its terminal shows its shell commands"
    assert [o.row_id for o in app.container.get(CommandOutputs).backgrounded("w-1")] in ([], [output.row_id]) and read(f"outputs/{output.row_id}")["command"] == "pytest -q", "its outputs are kept by its session"


def test_a_message_names_its_kind_and_its_agents_chat_and_a_workers_mark_never_reaches_the_main_chat(app: App):
    from journal.chat.moment_cards import MomentCards
    from journal.models.agent import Agent
    from journal.support.agent_role import AgentRole
    from journal.models.author import Author
    from journal.models.message import Message
    from journal.repositories.agents import Agents
    from journal.repositories.messages import Messages
    from journal.support.card_type import CardType
    from journal.support.rejection import Rejection
    messages = app.container.get(Messages)
    with app.container.get(Scope).environment(MAIN):
        app.container.get(Agents).save(Agent(environment_id=MAIN, session="worker-s", provider="claude", role=AgentRole.WORKER, state="void"), Actor.system())
        with pytest.raises(Rejection, match="has its kind"):
            messages.save(Message(environment_id=MAIN, author=Author.SYSTEM, text="something happened"), Actor.system())
        mark = app.container.get(MomentCards).show(MAIN, "worker-s", 'Searched for "base"', "search", shows=CardType.CREATED)
        main_chat = messages.selected(messages.main_chat())
    assert mark.thread == MessageThread.WORKER, "a mark in a worker's session lands in the worker's own chat"
    assert all(message.id != mark.id for message in main_chat), "and never in the main chat"


def test_a_kept_sessions_first_prompt_is_its_users_own_words_past_the_injected_lines(tmp_path):
    from journal.providers.claude import Claude
    path = tmp_path / "kept.jsonl"
    rows = [
        {"type": "user", "message": {"content": "[journal] introduce yourself to the user in the chat. one or two lines"}, "timestamp": "2026-10-01T10:00:00Z"},
        {"type": "user", "message": {"content": "<task-notification> <task-id>abc</task-id> </task-notification>"}, "timestamp": "2026-10-01T10:00:01Z"},
        {"type": "user", "message": {"content": "# AGENTS.md instructions for /home/me/project\\n\\nread this first"}, "timestamp": "2026-10-01T10:00:02Z"},
        {"type": "user", "message": {"content": "Fix the login page\\nand the footer too"}, "timestamp": "2026-10-01T10:00:03Z"},
    ]
    path.write_text("".join(json.dumps(row) + "\n" for row in rows))
    assert Claude().past_session(path).first_prompt.startswith("Fix the login page"), "the journal's lines, a notice and injected instructions are not the user's prompt"


def test_a_subshell_commands_mark_is_titled_by_its_working_command_and_written_once(app: App):
    import threading
    from journal.chat.process_cards import ProcessCards
    from journal.chat.process_card_contents import ProcessCardContents
    from journal.features.shell.support.activity_label import ActivityLabel
    labels = app.container.get(ActivityLabel)
    from journal.repositories.messages import Messages
    from journal.support.card_type import CardType
    assert labels.build("(cd src/web && npx vitest run 2>&1 | grep -E x | head -5)") == "testing", "a subshell is read through to the command doing the work"
    assert labels.build("cd src") == "moving"
    cards, scope = app.container.get(ProcessCards), app.container.get(Scope)

    def show():
        with scope.environment(MAIN):
            cards.show(ProcessCardContents("output", MAIN, "watch:77", "Running tests", {"kind": "card"}, Actor.system(), CardType.COMMANDS, True))

    shows = [threading.Thread(target=show) for _ in range(8)]
    for each in shows:
        each.start()
    for each in shows:
        each.join()
    with scope.environment(MAIN):
        assert len(app.container.get(Messages).keyed("watch:77", Actor.system())) == 1, "shows of one output at once leave one mark"


def test_filling_an_environment_reports_how_far_it_has_come(app: App, tmp_path, monkeypatch):
    import re
    from journal.features.hydration.support.session_hydration import SessionHydration
    from journal.repositories.messages import Messages
    config = tmp_path / "claude-config"
    monkeypatch.setenv("CLAUDE_CONFIG_DIR", str(config))
    folder = config / "projects" / re.sub(r"[^A-Za-z0-9]", "-", str(app.config.root.resolve()))
    folder.mkdir(parents=True)
    rows = [{"type": "user" if n % 2 == 0 else "assistant", "message": {"content": f"prompt {n}"} if n % 2 == 0 else {"content": [{"type": "text", "text": f"reply {n}"}]}, "timestamp": f"2026-10-01T10:{n // 60:02d}:{n % 60:02d}Z"} for n in range(40)]
    (folder / "long-session.jsonl").write_text("".join(json.dumps(row) + "\n" for row in rows))
    hydration = app.container.get(SessionHydration)
    steps = []
    imported = Messages.imported
    monkeypatch.setattr(Messages, "imported", lambda self, *args: (steps.append(hydration.filled_percent("long")), imported(self, *args))[1])
    hydration.created("long", "claude", "long-session", Actor.user(1))
    assert steps[0] == 0 and steps[-1] == 100 and steps == sorted(steps) and len(set(steps)) > 10, "the percentage climbs from 0 to 100 as the chat fills"
    assert hydration.filled_percent("long") == 0, "and is back to nothing once the environment is filled"


def test_the_journal_sees_the_test_processes_a_watched_run_started_and_says_when_its_bar_counts_suites_not_tests(app: App):
    from journal.support.command_classifier import CommandClassifier
    from types import SimpleNamespace
    from journal.features.shell.support.process_tree import ProcessTree
    from journal.features.shell.support.reader_judge import SUITES_COUNTED, ReaderJudge
    from journal.features.shell.support.run_processes import RunProcesses
    from journal.features.shell.support.progress import Progress
    shell = "100 1 /bin/bash scripts/tested\n"
    cases = {
        "one slow package": (shell + "101 100 go test ./pkg\n102 101 /tmp/go-build1/b001/pkg.test -test.v\n", Progress(0, 1), "go test ./pkg", 1),
        "pytest shards": (shell + "101 100 make test\n102 101 python3 -m pytest tests/a\n103 101 python3 -m pytest tests/b\n104 101 python3 -m pytest tests/c\n", Progress(1, 3), "pytest tests/a", 3),
        "xdist workers": (shell + "101 100 python3 -m pytest -n 4\n" + "".join(f"{102 + n} 101 python -c import sys;exec(eval(sys.stdin.readline()))\n" for n in range(4)), Progress(50, 100), "pytest -n 4", 5),
        "docker exec around go test": (shell + "101 100 docker exec -w /src tester go test ./...\n102 101 go test ./...\n103 102 /tmp/a.test\n104 102 /tmp/b.test\n105 102 /tmp/c.test\n", Progress(1, 3), "go test ./...", 3),
        "make around several runners": (shell + "101 100 make check\n102 101 go test ./...\n103 102 /tmp/a.test\n104 102 /tmp/b.test\n105 101 vitest run\n", Progress(2, 3), "go test ./...", 3),
        "a run that counts tests": (shell + "101 100 go test -v ./pkg\n102 101 /tmp/pkg.test -test.v\n", Progress(40, 400), "go test -v ./pkg", 1),
        "children that are no tests": (shell + "101 100 sleep 30\n102 100 node server.js\n", Progress(1, 3), "sleep 30", 0),
    }
    judge = ReaderJudge(None, None, None, None, None, None, processes := RunProcesses(), None, None, None, None, SHAPES)
    for number, (name, (listing, progress, inner, count)) in enumerate(cases.items(), 1):
        processes.sampled(number, ProcessTree.parsed("1 0 /sbin/init\n" + listing).descendants(100), app.container.get(CommandClassifier))
        assert processes.test_count(number) == count and processes.inner_command(number) == inner, name
        found = judge.counted_suites(SimpleNamespace(progress=lambda lines, progress=progress: progress), SimpleNamespace(row_id=number, command="scripts/tested"), [])
        assert bool(found) == (name not in ("xdist workers", "a run that counts tests", "children that are no tests")), name
        assert not found or (SUITES_COUNTED in found[0][0] and "on its own line with a count against the total" in found[0][1]), name
    assert "go test -list" in judge.counted_suites(SimpleNamespace(progress=lambda lines: Progress(1, 3)), SimpleNamespace(row_id=4, command="scripts/tested"), [])[0][1], "for go test the fix names the list of the tests and the verbose output"


def test_an_outward_route_is_left_out_of_the_points_a_costly_answer_is_logged_and_a_reader_add_tries_two_runs_at_once(app: App, tmp_path):
    user_set(app, "features.faults", True)
    from types import SimpleNamespace
    from journal.support.listener_queue import ListenerQueue
    from journal.features.faults.support.developer_tally import DeveloperTally
    from journal.features.faults.support.request_time_recorder import RequestTimeRecorder
    from journal.features.shell.support.reader_backfill import ReaderBackfill
    from journal.models.support.request_loads import RequestLoads
    from journal.models.timing import Timing
    from journal.repositories.reader_reports import ReaderReports
    user_set(app, "faults.count_loads", True)
    slow, tally = app.container.get(RequestTimeRecorder), app.container.get(DeveloperTally)
    for path in ("/cli/plugin upgrade", "/journal/plans"):
        slow.windowed("developer.requests", f"POST {path}", Timing(method="POST", route=path, ms=40, time=0.0, loads=RequestLoads()))
    assert [part["name"] for part in tally.point_parts() if "plugin upgrade" in part["name"]] == [], "the plugin upgrade, which reaches outside, is no part of the points"
    assert any(part["name"] == "POST /journal/plans" for part in tally.point_parts()), "and an ordinary answer still is"
    from collections import Counter
    from journal.features.faults.support.request_time_recorder import COSTLY_POINTS
    costly = RequestLoads.measured(Counter({"entries": COSTLY_POINTS}), Counter({"entries": 2048}), Counter())
    slow.windowed("developer.hooks", "Stop", Timing(method="HOOK", route="/hooks/claude/Stop", ms=900, time=0.0, loads=costly))
    slow.windowed("developer.hooks", "PreToolUse", Timing(method="HOOK", route="/hooks/claude/PreToolUse", ms=9, time=0.0, loads=RequestLoads()))
    app.runtime().deferred.drain()
    logged = (app.config.home / "runtime" / "costly-answers.log").read_text().splitlines()
    assert len(logged) == 1 and f"Stop {COSTLY_POINTS + 2} points in 900 ms: entries" in logged[0], "an answer over the costly line is written with what it read, to a file that outlives a restart; a cheap one is not"
    runs = []
    for number in range(5):
        folder = tmp_path / f"run-{number}"
        folder.mkdir()
        (folder / "parts").write_text("R-\n")
        (folder / "0.part").write_text("make all")
        (folder / "0.out").write_text("built app\n")
        runs.append(SimpleNamespace(id=number + 1, folder=str(folder), command="make all", session="s1"))
    tried = []
    judge = SimpleNamespace(stored_runs=lambda reader: runs, misses=lambda reader, lines: tried.append(1) or (["it picks no line of the run"] if len(tried) == 3 else []))
    reports = app.container.get(ReaderReports)
    backfill = ReaderBackfill(judge, reports, app.container.get(ListenerQueue), app.container.get(Scope))
    backfill.queue_trial(SimpleNamespace(name="builds"), 2, MAIN)
    app.runtime().deferred.drain()
    with app.container.get(Scope).environment(MAIN):
        raised = [report for report in reports.all() if report.reader == "builds"]
    assert len(tried) == 3 and [report.output for report in raised] == [5], "the runs after the two tried at once are tried later, and the one that misses raises a report"


def test_a_workers_conversation_resumed_as_the_main_agent_is_read_no_more_and_a_failing_tick_listener_stops_no_other(app: App, monkeypatch, tmp_path):
    from datetime import date
    from journal.events.agent.ticked import Ticked
    from journal.events.bus import Bus
    from journal.events.listener import Listener
    from journal.features.workers.support.worker_chat import WorkerChat
    from journal.models.agent import Agent
    from journal.models.worker import Worker
    from journal.repositories.agents import Agents
    from journal.repositories.messages import Messages
    from journal.repositories.workers import Workers
    monkeypatch.setenv("HOME", str(tmp_path / "home"))
    monkeypatch.delenv("CLAUDE_CONFIG_DIR", raising=False)
    session = "01a15a25-535e-7cc2-993e-d38deedb6b42"
    rollout = tmp_path / "home" / ".codex" / "sessions" / date.today().strftime("%Y/%m/%d") / f"rollout-2026-10-22T10-00-00-{session}.jsonl"
    rollout.parent.mkdir(parents=True)
    text = {"type": "response_item", "payload": {"type": "message", "role": "assistant", "content": [{"type": "output_text", "text": "Written."}]}}
    rollout.write_text(json.dumps({"type": "session_meta", "payload": {"cwd": str(app.config.root)}}) + "\n" + json.dumps(text) + "\n")
    with app.container.get(Scope).environment(1):
        app.container.get(Agents).save(Agent(environment_id=1, session=session, provider="codex"), Actor.system())
        worker = app.container.get(Workers).save(Worker(environment_id=1, name="Dieter Rams", brief="b", provider="codex", resume=session), Actor.system())
        app.container.get(WorkerChat).read(worker)
        assert not [m for m in app.container.get(Messages).all() if m.text == "Written."], "the main agent now holds that session: nothing is read into a worker's chat, and nothing is refused"
    bus, heard = Bus(), []

    class Failing(Listener[Ticked]):
        def handle(self, event):
            raise RuntimeError("broken")

    class Hearing(Listener[Ticked]):
        def handle(self, event):
            heard.append(event)

    bus.listen(Ticked, Failing())
    bus.listen(Ticked, Hearing())
    bus.dispatch_guarded(Ticked(agent=agent_row(app), session="s", environment_id=1, time=1.0, silence_seconds=0.0))
    assert len(heard) == 1, "one listener failing on a tick stops no other"


def test_a_bare_journal_update_applies_and_with_no_journal_running_installs_the_release_at_once(app: App):
    from journal.support.agent_role import AgentRole
    from journal.console.console import Console
    console = app.container.get(Console)
    assert console.with_verb(["update"], AgentRole.MAIN) == ["update", "apply"], "a bare journal update applies"
    shim = (Path(__file__).parents[1] / "src" / "journal.sh").read_text()
    assert 'case "$#:$1:$2" in 1:update:|2:update:apply) set -- update install ;; esac' in shim, "with no server answering, the shim runs the update here"
    installer = Installer()
    updating_with(app, Source("v4.0.0", "v4.99.0"), installer, auto=False)
    out = app.console().run(["update", "install"], AGENT).text
    assert installer.ran == ["v4.99.0"] and "to 4.99.0" in out and "installed here" in out, "the release is installed before the command returns, naming the version"


def test_a_worker_sent_a_job_while_its_branch_clashes_is_rebased_by_the_journal_and_sent_the_conflict_to_fix(app: App, monkeypatch):
    root = workspace_made(app, ("platform",))
    _, folder, caller = worktree_worker(app, monkeypatch, "platform totals")
    committed(folder / "platform", "app.php", "<?php\n// the worker's line\n")
    assert proved_and_out(app, caller, "platform/app.php:1").code == 0
    committed(root / "platform", "app.php", "<?php\n// the user's line\n")
    sent = app.console().run(["worker", "send", "1", "finish the job"], AGENT)
    assert sent.code == 0, sent.error
    brief = worker_row(app).brief
    assert brief.startswith("The journal rebased your worktree onto the project's branch") and "conflict in platform/app.php" in brief and "fix only the files that clash" in brief and brief.endswith("finish the job"), brief
    assert "<<<<<<< " in (folder / "platform/app.php").read_text(), "the journal stopped the rebase with the conflict in the worktree, for the worker to fix"


def test_a_clean_clock_out_commits_the_workers_work_and_tells_it_the_journal_rebased_it(app: App, monkeypatch):
    root = workspace_made(app, ("platform",))
    _, folder, caller = worktree_worker(app, monkeypatch, "platform totals")
    (folder / "platform/totals.php").write_text("<?php\n// totals\n")
    committed(root / "platform", "notes.md", "a later note\n")
    out = proved_and_out(app, caller, "platform/totals.php:1")
    assert out.code == 0, out.error
    assert "the journal committed your work and rebased it onto the project's branch, at" in out.text, out.text
    assert (folder / "platform/notes.md").is_file() and git_run(folder / "platform", "status", "--porcelain").stdout == "", "its work is committed and its worktree carries what landed meanwhile"


def test_a_merge_landing_sends_back_each_waiting_branch_it_makes_clash_and_leaves_one_clashing_only_in_built_files_alone(app: App, monkeypatch):
    from journal.repositories.entries import NUDGE, Entries
    root = workspace_made(app, ("platform",))
    _, first, first_caller = worktree_worker(app, monkeypatch, "platform totals")
    _, second, second_caller = worktree_worker(app, monkeypatch, "platform header", n=2)
    _, third, third_caller = worktree_worker(app, monkeypatch, "platform notes", n=3)
    committed(first / "platform", "app.php", "<?php\n// the first worker's line\n")
    committed(second / "platform", "app.php", "<?php\n// the second worker's line\n")
    committed(third / "platform", "notes.md", "the third worker's notes\n")
    user_set(app, "workers.built_paths", ["dist"])
    committed(first / "platform", "dist/app.js", "built by the first worker\n")
    committed(third / "platform", "dist/app.js", "built by the third worker\n")
    for caller, proof in ((first_caller, "platform/app.php:1"), (second_caller, "platform/app.php:1"), (third_caller, "platform/notes.md:1")):
        assert proved_and_out(app, caller, proof).code == 0
    app.console().run(["worker", "check", "2", "1"], AGENT)
    merged = checked_and_merged(app, 1)
    assert merged.code == 0, merged.error
    app.runtime().deferred.drain()
    clashing = worker_row(app, 2)
    assert clashing.state == WorkerState.DISPATCHED and "conflict in platform/app.php" in clashing.brief and "no longer merges cleanly" in clashing.brief, "the branch the merge made clash went back to its worker with the conflict, by itself"
    assert worker_row(app, 3).state == WorkerState.DELIVERED and worker_row(app, 3).clashes == 0, "a branch that clashes only in built files, which its merge builds again, is left alone"
    with app.container.get(Scope).environment(MAIN):
        named = [entry for entry in app.container.get(Entries).all_matching(entry_type=NUDGE) if entry.data.get("key") == "workers.branch_keeps_clashing"]
    assert named == [], "the main agent hears nothing of a first clash"


def test_a_branch_sent_back_as_often_in_a_row_as_the_setting_allows_is_named_to_the_main_agent(app: App, monkeypatch):
    from journal.features.workers.support.clash_return import ClashReturn
    from journal.repositories.entries import NUDGE, Entries
    from journal.repositories.workers import Workers
    workspace_made(app, ("platform",))
    worktree_worker(app, monkeypatch, "platform totals")
    hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": "ls"})

    def named() -> list[str]:
        app.runtime().deferred.drain()
        with app.container.get(Scope).environment(MAIN):
            return [entry.data["line"] for entry in app.container.get(Entries).all_matching(entry_type=NUDGE) if entry.data.get("key") == "workers.branch_keeps_clashing"]

    def clashed() -> None:
        with app.container.get(Scope).environment(MAIN):
            delivered = app.container.get(Workers).save(worker_row(app).with_(state=WorkerState.DELIVERED), Actor.system())
            app.container.get(ClashReturn).send(delivered, "platform/app.php")

    clashed()
    clashed()
    assert named() == [], "two clashes in a row are the worker's own business"
    clashed()
    lines = named()
    assert len(lines) == 1 and has_nudge(lines[0], WorkersNudges.BRANCH_KEEPS_CLASHING, n=1, clashes=3) and "platform/app.php" in lines[0], lines
    with app.container.get(Scope).environment(MAIN):
        assert worker_row(app).merged(1, 0.0).clashes == 0, "a merge starts the count again"


def test_a_commands_mark_names_the_command_without_its_folder_change_brackets_variables_or_time_limit():
    from journal.support.command_text import CommandText
    assert [CommandText(SHAPES).shown(line) for line in ("(cd src/web && npx vitest run tests/)", "cd app && make build", "FOO=1 timeout 60 pytest -q", "pytest -q tests/a.py", "cd a; export X=1; npm test && ls")] == ["npx vitest run tests/", "make build", "pytest -q", "pytest -q tests/a.py", "npm test && ls"]


def test_one_line_raised_twice_for_one_hook_answer_reaches_the_agent_once():
    from journal.support.decision import Decision
    answered = Decision.allowed_with("a line\nanother").merged(Decision.allowed_with("a line"))
    assert answered.context.split("\n") == ["a line", "another"], "the same line from two listeners is said once in one answer"
    held = Decision.refuse("hold on").merged(Decision.refuse("hold on"))
    assert held.reason == "hold on"


def test_a_plugin_that_declares_a_health_check_is_probed_restarted_on_a_miss_and_marked_broken_at_the_fifth(app: App, monkeypatch):
    import socket
    import threading
    from journal.features.plugins.jobs.plugin_health_check import PluginHealthCheck
    from journal.features.plugins.support.plugin_folders import PluginFolders
    from journal.repositories.plugins import Plugins
    sent = []
    monkeypatch.setattr(SupervisorLink, "runs", lambda self, environment_id: True)
    monkeypatch.setattr(os, "getloadavg", lambda: (0.0, 0.0, 0.0))
    environs = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: sent.append((verb, fields.get("name", ""))) or environs.append(fields.get("env", {})) or SupervisorReply(True))
    run = lambda *words: app.console().run(list(words), AGENT).text
    echo(app, name="quiet")
    assert run("plugin", "health", "quiet") == "quiet: declares no health check\n", "a plugin without a health check still runs and is never probed"
    health = {"socket_env": "ECHO_HEALTH_SOCKET", "request": '{"health":1}', "answer": '{"health":"up","service":"<the service>"}'}
    plugin = echo(app, services=[{"name": "answers", "command": ["serve.py"], "answers": True}], health=health)
    assert run("plugin", "health", "echo") == "echo: no service of it runs here\n", "a service with no health socket is not running here, which is no miss"
    path = app.container.get(PluginFolders).health_socket(plugin, "main", plugin.manifest.services[0])
    path.parent.mkdir(parents=True, exist_ok=True)
    path.unlink(missing_ok=True)
    listener = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    listener.bind(str(path))
    listener.listen()
    answering = threading.Event()
    answering.set()

    def answered(connection):
        asked = connection.makefile("rb").readline()
        if answering.is_set() and json.loads(asked) == {"health": 1}:
            connection.sendall(b'{"health": "up", "service": "answers"}\n')
        else:
            timing.sleep(0.5)
        connection.close()

    def serving():
        while True:
            try:
                connection, _ = listener.accept()
            except OSError:
                return
            threading.Thread(target=answered, args=(connection,), daemon=True).start()

    threading.Thread(target=serving, daemon=True).start()
    try:
        assert re.fullmatch(r"echo: answers answered in \d+ ms\n", run("plugin", "health", "echo")), "a service that answers in time is said to with its time"
        checks, plugins = app.container.get(PluginHealthCheck), app.container.get(Plugins)
        checks.tick(timing.time())
        assert plugins.lookup("echo").fault_streak == 0 and not [verb for verb, _ in sent if verb == "start"], "an answer restarts nothing"
        answering.clear()
        assert run("plugin", "health", "echo") == "echo: answers not responding within 200 ms\n"
        for _ in range(4):
            checks.tick(timing.time())
        row = plugins.lookup("echo")
        assert row.fault_streak == 4 and row.failed_at is None and row.enabled, "four misses in a row are faults, not yet broken"
        assert ("start", "plugin.echo.answers") in sent and ("stop", "plugin.echo.answers") in sent, "a miss starts its service again"
        assert str(path) in [environ.get("ECHO_HEALTH_SOCKET") for environ in environs], "with the path of its own health socket in the variable the plugin named"
        checks.tick(timing.time())
        row = plugins.lookup("echo")
        assert row.failed_at is not None and row.enabled and "health check within 200 ms" in row.last_fault, "the fifth marks it broken, never switched off"
        test_run = app.config.home / "runtime" / f"tests.running.{os.getpid()}"
        test_run.write_text("")
        checks.tick(timing.time())
        assert plugins.lookup("echo").fault_streak == 5, "a miss while a test suite runs is not counted"
        test_run.unlink()
        answering.set()
        checks.tick(timing.time())
        assert plugins.lookup("echo").failed_at is None and plugins.lookup("echo").fault_streak == 0, "an answer again clears the broken mark"
    finally:
        listener.close()
        path.unlink(missing_ok=True)


def test_a_run_is_named_for_the_commands_a_loop_runs_never_for_the_loops_words_or_its_setup(app: App):
    from journal.features.shell.support.activity_label import ActivityLabel
    labels = app.container.get(ActivityLabel)
    from journal.support.chain import Chain
    from journal.support.command_shape import CommandShape
    shape = lambda line: SHAPES.chain_shape(tuple(part.text for part in Chain.parts(line)))
    sweep = 'D=/tmp/sweep; mkdir -p $D; while IFS= read -r word; do found=$(git log --all -S"$word"); done < words.txt'
    assert shape(sweep).startswith("git log"), shape(sweep)
    assert SHAPES.command_name("do found=$(git log --all -S foo)").startswith("git log") and SHAPES.command_name("done < words.txt") == ""
    assert shape("for file in tests/*.py; do python3 -m pytest $file; done").startswith("python3 -m pytest")
    assert shape("mkdir -p out; pytest -q tests") == "pytest", "a folder made first is setup, not the run"
    assert labels.chain_label("while IFS= read -r word", sweep) != "running while" and "while" not in labels.chain_label("while IFS= read -r word", sweep), "the card is named for the loop's work"


def test_a_chain_is_read_by_the_reader_of_the_command_doing_its_work(app: App):
    from journal.features.shell.support.readers import Readers
    readers = app.container.get(Readers)
    from journal.features.shell.support.reader import Reader
    from journal.features.shell.support.reader_commands import ReaderCommands
    for name, commands in (("naps", "sleep"), ("tests", "tox"), ("rewrites", "git filter-repo")):
        readers.add(Reader(name, f"the {name}", pattern="x", commands=ReaderCommands.parsed(commands)))
    assert readers.reading("X=1; curl -s a; echo done; sleep 1; curl b") is None, "a wait between two requests never makes the line a pause"
    assert readers.reading("cd x && tox -e py").name == "tests" and readers.reading("sleep 5").name == "naps", "the working command decides, and a lone wait is still a pause"
    line = "S=/tmp/rewrite; ( cd $S/mirror.git && git filter-repo --force 2>&1 )"
    assert readers.reading(line).name == "rewrites", "an assignment in front of a subshell is passed over, and the subshell is known by its work"


def test_every_line_of_the_command_corpus_carries_every_expectation():
    rows = [json.loads(line) for line in (Path(__file__).parent / "shell_corpus.jsonl").read_text().splitlines()]
    expected = {"work", "reader", "needs", "cut", "label"}
    half = [n for n, row in enumerate(rows, 1) if not isinstance(row.get("line"), str) or not isinstance(row.get("parts"), list) or set(row.get("reading", {})) != expected or not all(isinstance(value, str) for value in row["reading"].values())]
    assert not half, f"{len(half)} corpus lines lack an expectation (line, parts, and a reading of work, reader, needs, cut and label), the first: {half[:5]}"


def test_every_line_of_the_command_corpus_writes_as_the_classifier_reads_it_and_differs_from_the_old_rule_only_where_frozen(app: App):
    """The write gate reads the classification (task 3773): writes_before.json holds the corpus lines the hand-written write rule called writes before the classifier replaced it, and the lines where the classifier reads otherwise are frozen in write_disagreements.json, so a change shrinks or grows the list visibly; CORPUS_FREEZE=1 writes the list anew after review."""
    from journal.support.command_classifier import CommandClassifier
    folder, classifier = Path(__file__).parent / "shell_corpus_reading", app.container.get(CommandClassifier)
    rows = [json.loads(line) for line in (Path(__file__).parent / "shell_corpus.jsonl").read_text().splitlines()]
    before = set(json.loads((folder / "writes_before.json").read_text()))
    found = {str(n): {"before": n in before, "classifier": writes} for n, row in enumerate(rows, 1) if (writes := Claude().call("Bash", {"command": row["line"]}, frozenset(), classifier).writes) != (n in before)}
    frozen = folder / "write_disagreements.json"
    if os.environ.get("CORPUS_FREEZE"):
        frozen.write_text(json.dumps(found, indent=0, sort_keys=True) + "\n")
    known = json.loads(frozen.read_text())
    changed = {n: found.get(n) or {"now": "agrees"} | {"line": rows[int(n) - 1]["line"][:120]} for n in found.keys() | known.keys() if found.get(n) != known.get(n)}
    assert not changed, f"{len(changed)} lines write otherwise than frozen, the first: {list(changed.items())[:3]}"


def test_the_output_shapers_ending_a_line_are_taken_off_and_an_in_place_edit_is_not():
    from journal.support.part import Part
    shaped = {"make 2>&1 | cut -c1-80": "cut -c1-80", "npm test | sort | uniq -c": "sort | uniq -c", "git log | sed -n 1,5p": "sed -n 1,5p", "docker logs api | grep -i error | tail -5": "grep -i error | tail -5",
              "kubectl get pods -o json | jq '.items[].metadata.name'": "jq '.items[].metadata.name'", "go test ./... | awk '/FAIL/'": "awk '/FAIL/'", "env | sort | column -t": "sort | column -t", "cargo build 2>&1 | wc -l": "wc -l", "cargo tree | nl": "nl"}
    for line, cut in shaped.items():
        assert Part(line).cut_command() == cut, f"{line} is shaped by {cut}, taken off so its whole output is kept"
    for line in ("ls | sed -i s/a/b/ f", "x | perl -pi -e s/a/b/ f", "x | tee log.txt", "x | xargs rm", "tail -f app.log | grep error"):
        assert Part(line).cut_command() in ("", "grep error") and Part(line).uncut().text.startswith(line.split(" | ")[0]), f"{line} keeps what writes a file, runs a command or follows a file"


def test_a_line_that_only_reads_or_runs_git_or_github_shows_no_card_unless_it_failed_and_a_test_run_always_does(app: App, tmp_path):
    from journal.features.shell.seeds.stray_command_mark_cleanup import StrayCommandMarkCleanup
    from journal.features.shell.seeds.stray_reader_cleanup import StrayReaderCleanup
    from journal.features.shell.support.command_mark_policy import CommandMarkPolicy
    from journal.features.shell.support.output_process_card import OutputProcessCard
    from journal.features.shell.support.readers import Readers
    from journal.models.command_output import CommandOutput
    from journal.repositories.command_outputs import CommandOutputs
    from journal.repositories.messages import Messages
    from journal.models.message import Message
    from journal.models.author import Author
    with app.container.get(Scope).environment(MAIN):
        outputs, policy, card = app.container.get(CommandOutputs), app.container.get(CommandMarkPolicy), app.container.get(OutputProcessCard)
        run = lambda command, status=0: outputs.save(CommandOutput(chain=command, command=command, folder=str(tmp_path / command.replace(" ", "_")[:40]), ended=True, status=status, moved=True), Actor.system())
        assert policy.forbids_mark(run("grep -rn needle src | head")) and policy.forbids_mark(run("cd src && ls -la")), "a quick search or listing shows no card"
        assert policy.forbids_mark(run("git add -A && git status")) and policy.forbids_mark(run("git switch topic")), "nor does everyday git, chained or not"
        assert policy.forbids_mark(run("git push -q origin development")) and policy.forbids_mark(run("git add -A && git commit -m x && git push")) and policy.forbids_mark(run("gh run watch 12")), "nor does a push, a commit or a GitHub command"
        assert not card.is_carded(run("git status")), "so no card is written for everyday git"
        assert not policy.forbids_mark(run("git push origin topic", status=1)), "a git line that failed shows its card"
        assert not policy.forbids_mark(run("python3 -m pytest -q")) and not policy.forbids_mark(run("python3 -m pytest -q && git commit -m y")), "a test run, alone or before a commit, shows its card"
        assert policy.forbids_mark(run("git rebase main")), "nor a rebase"
        assert policy.forbids_mark(run("sleep 30")) and policy.forbids_mark(run("sleep 30; echo checked")) and policy.forbids_mark(run("sleep 5 && sleep 5")) and not policy.forbids_mark(run("sleep 5 && make release")), "nor a pause, which does nothing to watch, while a pause before real work keeps its mark"
        assert card.outcome(run("grep -rn needle src")) == "", "a read's card, when it has one, is never coloured"
        from datetime import timedelta
        mark = lambda output: app.container.get(Messages).save(Message(environment_id=MAIN, author=Author.SYSTEM, text="A run", data={"kind": "card", "shows": "commands", "output": output.id, "card_type": "process"}), Actor.system())
        long_build = run("make release")
        long_build = outputs.save(long_build.with_(created_at=long_build.creation_time - timedelta(seconds=20)), Actor.system())
        stray = [mark(run("git status -s")), mark(run("git push origin topic", status=1)), mark(outputs.save(run("python3 tool.py").with_(moved=False), Actor.system())), mark(run("python3 quick.py"))]
        kept = [mark(long_build), mark(run("make release")), mark(outputs.save(run("python3 -m pytest -q").with_(created_at=long_build.creation_time), Actor.system()))]
        app.container.get(StrayCommandMarkCleanup).run()
        assert not any(app.container.get(Messages).matching(id=card.id) for card in stray), "at boot the marks of a git line, failed or not, of a run never moved to the background and of a command that never ran past 5 seconds go"
        assert all(app.container.get(Messages).matching(id=card.id) for card in kept), "while a background run of a command that once ran 20 seconds keeps its mark, every run of it"
    readers = app.container.get(Readers)
    (app.config.readers).mkdir(parents=True, exist_ok=True)
    (app.config.readers / "git-pushing.pattern").write_text("# a push\n.\ncommands: git push\n")
    (app.config.readers / "search-hits.pattern").write_text("# a search\n.\ncommands: grep, rg\n")
    (app.config.readers / "builds.pattern").write_text("# a build\n.\ncommands: npm run build\n")
    app.container.get(StrayReaderCleanup).run()
    names = {reader.name for reader in readers.all()}
    assert "git-pushing" not in names and "search-hits" not in names, "a reader kept for git or for searches alone is removed at boot"
    assert "builds" in names, "a build's reader stays"


def test_a_wrapped_command_is_named_for_what_it_wraps_and_every_ecosystem_has_its_words(app: App):
    from journal.features.shell.support.activity_label import ActivityLabel
    activity = app.container.get(ActivityLabel)
    labels = {"npx jest --ci": "testing", "bundle exec rspec spec/models": "testing", "sudo apt-get install -y curl": "installing", "CI=true npm run build": "building",
              "docker compose run --rm web pytest -n auto": "testing", "docker run --rm -v \"$PWD\":/app -w /app node:20 npm test": "testing", "kubectl exec deploy/api -- pytest tests/smoke": "testing",
              "timeout 300 make test": "testing", "nix develop -c cargo test": "testing", "docker run --rm alpine sh -c 'echo a; echo b'": "running docker", "time (journal todo all)": "journalling",
              "./gradlew assembleDebug": "building", "mvn -pl core test": "testing", "dotnet restore": "installing", "mix deps.get": "installing", "uv sync --frozen": "installing", "docker build -t app .": "building",
              "ruff check src": "checking code", "npx tsc --noEmit": "checking code", "golangci-lint run ./...": "checking code", "npm run test:unit": "testing", "echo x >> .gitignore": "writing a file"}
    wrong = {line: got for line, label in labels.items() if (got := activity.line_label(line)) != label}
    assert not wrong, f"named otherwise than what they do: {wrong}"


def test_every_line_of_the_command_corpus_is_labelled_by_what_its_working_part_does(app: App):
    from journal.features.shell.support.activity_label import ActivityLabel
    labels = app.container.get(ActivityLabel)
    rows = [json.loads(line) for line in (Path(__file__).parent / "shell_corpus.jsonl").read_text().splitlines()]
    wrong = [(n, row["line"][:100], row["reading"]["label"], get_answer) for n, row in enumerate(rows, 1) if (got := labels.line_label(row["line"])) != row["reading"]["label"]]
    assert not wrong, f"{len(wrong)} corpus lines are labelled otherwise than their reading names, the first: {wrong[:3]}"


def test_every_line_of_the_command_corpus_is_read_by_the_reader_its_reading_names(app: App):
    """Each corpus line's reading names the reader that should read its output, of the fixed set in shell_corpus_reading/readers.json; the lines where the journal chooses otherwise are frozen in disagreements.json, so a fix shrinks the list and a new miss fails; CORPUS_FREEZE=1 writes the list anew after review."""
    from journal.features.shell.support.readers import Readers
    folder = Path(__file__).parent / "shell_corpus_reading"
    console, readers = app.console(), app.container.get(Readers)
    assert console.run(["alias", "add", "sins", "commandments-release judge", "--about", "judges the code"], AGENT).code == 0
    from journal.features.shell.support.reader import Reader
    from journal.features.shell.support.reader_commands import ReaderCommands
    for name, commands in [(name, commands) for name, commands in json.loads((folder / "readers.json").read_text()).items() if not readers.is_locked(name)]:
        readers.add(Reader(name, f"the {name} runs", pattern=".", commands=ReaderCommands.parsed(commands)))
    rows = [json.loads(line) for line in (Path(__file__).parent / "shell_corpus.jsonl").read_text().splitlines()]
    chosen = lambda line: (reader.name if (reader := readers.reading(line)) and reader.name in {row for row in json.loads((folder / "readers.json").read_text())} else "")
    found = {str(n): {"expected": row["reading"]["reader"], "journal": got} for n, row in enumerate(rows, 1) if (got := chosen(row["line"])) != row["reading"]["reader"]}
    frozen = folder / "disagreements.json"
    if os.environ.get("CORPUS_FREEZE"):
        frozen.write_text(json.dumps(found, indent=0, sort_keys=True) + "\n")
    known = json.loads(frozen.read_text())
    new = {n: found[n] | {"line": rows[int(n) - 1]["line"][:120]} for n in found if found[n] != known.get(n)}
    assert not new, f"{len(new)} lines read otherwise than their reading names, the first: {list(new.items())[:3]}"
    fixed = [n for n in known if n not in found]
    assert not fixed, f"{len(fixed)} frozen disagreements are fixed: write the list anew with CORPUS_FREEZE=1, the first: {fixed[:5]}"


def test_a_script_reader_takes_every_setting_a_pattern_reader_takes(app: App):
    from journal.features.shell.support.readers import Readers
    script = app.config.root / "counts.sh"
    script.write_text("grep -o 'done [0-9]*/[0-9]*' | tail -1; echo \"stage $JOURNAL_OUTPUT_STAGE\"\n")
    made = app.console().run(["reader", "add", "counts", "--script", str(script), "--about", "how far the run is", "--label", "Counting the checks", "--progress", r"(\d+)/(\d+)", "--commands", "make check", "--step", "[.F]", "--topic", r"--suite (\S+)"], AGENT)
    assert made.code == 0, made.error
    reader = app.container.get(Readers).lookup("counts")
    assert (reader.label, reader.commands.text(), reader.step_pattern, reader.subject) == ("Counting the checks", "make check", "[.F]", "how far the run is"), "every setting is kept with the script"
    assert reader.topic("make check --suite fast") == "fast", "its topic is read off the command line"
    assert reader.progress(["done 3/12"]).fraction() == 0.25, "its progress is read on what the script prints"
    assert reader.variant("finished").card_lines(["done 12/12"]) == ["done 12/12", "stage finished"], "its script is told the stage"
    assert app.container.get(Readers).reading("make check --suite fast").name == "counts", "it reads the commands it names"
    Path(reader.script).write_text("printf 'cut \\342\\200 here\\n'\n")
    assert reader.variant("finished").card_lines(["x"]) == ["cut \ufffd here"], "a script that cuts a character in half is read with the half replaced, never a fault"


def test_the_workers_list_returns_its_page_and_beside_it_only_the_workers_still_out(app: App):
    from journal.http.controllers.workers import WorkerController
    from journal.http.listing import Listing
    from journal.models.worker import Worker
    from journal.models.worker_state import WorkerState
    from journal.repositories.workers import Workers
    workers = app.container.get(Workers)
    with app.container.get(Scope).environment(MAIN):
        for number in range(12):
            workers.save(Worker(environment_id=MAIN, name=f"Finished {number}", brief="b", state=WorkerState.MERGED if number % 2 else WorkerState.REPORTED), Actor.system())
        out = workers.save(Worker(environment_id=MAIN, name="Still out", brief="b", state=WorkerState.READY), Actor.system())
        for number in range(5):
            workers.save(Worker(environment_id=MAIN, name=f"Newer {number}", brief="b", state=WorkerState.MERGED), Actor.system())
        listed = app.container.get(WorkerController).listed(Listing(limit=5))
    names = [row["name"] for row in listed["rows"]]
    assert names == ["Still out", "Newer 0", "Newer 1", "Newer 2", "Newer 3", "Newer 4"] and out.row_id, "a page of the newest, and beside it only a worker still out, never every finished one"
    with app.container.get(Scope).environment(MAIN):
        long = workers.save(Worker(environment_id=MAIN, name="Long brief", brief="b" * 5000, state=WorkerState.READY), Actor.system())
        previewed = next(row for row in app.container.get(WorkerController).listed(Listing(limit=5))["rows"] if row["name"] == "Long brief")
        whole = app.container.get(WorkerController).listed(Listing(ids=(long.row_id,)))["rows"][0]
    assert "report" not in previewed, "a list carries no report"
    assert "report" in whole, "a worker read by its id comes with its report"


def test_no_list_returns_more_than_its_page_and_a_page_of_open_rows_however_many_are_open(app: App):
    from journal.http.listing import Listing
    from journal.models.task import Task
    from journal.repositories.tasks import Tasks
    tasks = app.container.get(Tasks)
    ids = [tasks.save(Task(environment_id=MAIN, title=str(number)), Actor.system()).row_id for number in range(300)]
    rows = tasks.query().filter_listed("id", ids)
    no_rows = rows.filter_listed("id", ())
    page = Listing(limit=20).listed(tasks, rows, rows, no_rows)
    assert [row.row_id for row in page["rows"]] == ids[-40:], "three hundred open rows return the page and the page of open rows before it, never all three hundred"
    mixed = Listing(limit=20).listed(tasks, rows, rows.filter_listed("id", ids[::2]), no_rows)
    assert len(mixed["rows"]) <= 40 and [row.row_id for row in mixed["rows"]][-20:] == ids[-20:], "the page and at most a page of open rows beside it"
    changed = Listing.query_listing({"since": str(timing.time() + 60)}).listed(tasks, rows, rows, no_rows)
    assert changed == {"rows": [], "is_last_page": True}, "a change read finds the rows changed since, here none, in SQL"


def test_a_server_is_added_and_removed_through_the_agent_programs_cli_from_the_pages_routes_and_the_journal_keeps_answering(app: App, monkeypatch, tmp_path):
    import json as j
    import subprocess
    from urllib.request import Request as R, urlopen
    from journal.features.mcp.support.agent_cli import AgentCli
    from journal.features.mcp.support.health import Health
    from journal.features.mcp.support.health_report import HealthReport
    from journal.support.keys import Keys
    ran = []
    monkeypatch.setattr(app.container.get(Keys), "path", tmp_path / "keys.json")
    monkeypatch.setattr(Health, "probe", lambda self: HealthReport())
    monkeypatch.setattr(AgentCli, "run", lambda self, command: ran.append(command) or subprocess.CompletedProcess(command, 1 if command[-1] == "local" else 0, "", ""))
    port = app.server().port
    post = lambda path, body: j.loads(urlopen(R(f"http://127.0.0.1:{port}{path}", data=j.dumps(body).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read())
    assert post("/journal/mcp/add", {"name": "docs", "url": "https://mcp.example.com/mcp"}) == {"added": "docs"}
    assert post("/journal/mcp/add", {"name": "tools", "command": "npx", "args": ["-y", "tools-mcp"]}) == {"added": "tools"}
    assert ["claude", "mcp", "add", "-s", "local", "--transport", "http", "docs", "https://mcp.example.com/mcp"] in ran and ["claude", "mcp", "add", "-s", "local", "tools", "--", "npx", "-y", "tools-mcp"] in ran, "each is added by the program's own command"
    assert post("/journal/mcp/docs/remove", {}) == {"removed": "docs"}
    assert ran[-2:] == [["claude", "mcp", "remove", "docs", "-s", "local"], ["claude", "mcp", "remove", "docs", "-s", "project"]], "a removal tries each scope until the program takes it"
    with urlopen(HttpRequest(f"http://127.0.0.1:{port}/journal/health", headers={"X-Journal-Env": "main"}), timeout=5) as answer:
        assert j.loads(answer.read())["answering"] is True, "the journal still answers"
    try:
        post("/journal/mcp/add", {"name": "bad name", "url": "https://x.example"})
    except HTTPError as refused:
        assert refused.code in (400, 409, 422)
    else:
        raise AssertionError("a name with a space is refused")


def test_the_agent_programs_command_line_runs_with_no_terminal_to_read_and_a_missing_program_is_a_refusal(app: App):
    from journal.features.mcp.support.agent_cli import AgentCli
    from journal.support.rejection import Rejection
    cli = app.container.get(AgentCli)
    assert cli.run(["sh", "-c", "read answer; echo done"]).stdout.strip() == "done", "standard input is closed, so a program that asks something is never waiting on the journal's own terminal"
    try:
        cli.run(["no-such-agent-program", "mcp", "list"])
    except Rejection as refused:
        assert "could not be run" in str(refused)
    else:
        raise AssertionError("a missing program is a refusal, never a fault")


def test_a_probe_index_that_reads_links_throws_while_a_count_and_a_read_by_id_go_through(app: App):
    from journal.db.relation_read import RelationRead
    from journal.http.controllers.controller import Controller
    from journal.http.listing import Listing
    from journal.models.support.ref import Ref
    from journal.models.task import Task
    from journal.repositories.plans import PLAN_LINK, Plans
    from journal.repositories.tasks import Tasks
    from journal.models.plan import Plan
    from journal.repositories.links import Links
    tasks, plans = app.container.get(Tasks), app.container.get(Plans)
    with app.container.get(Scope).environment(MAIN):
        made = plans.save(Plan(environment_id=MAIN, title="p", brief="b"), Actor.user(1))
        planned = tasks.save(Task(environment_id=MAIN, title="planned"), Actor.user(1))
        app.container.get(Links).linked(Ref.build(planned), Ref.build(made), PLAN_LINK, Actor.user(1))

    class LinkReadingIndex(Controller[Task]):
        def __init__(self, repository: Tasks) -> None:
            self.repository = repository

        def index_page(self, rows: list[Task]) -> list:
            return self.shown_page(rows)

        def shown_page(self, rows: list[Task]) -> list:
            return [self.repository.linked(PLAN_LINK, [task.row_id for task in rows])]

    probe = LinkReadingIndex(tasks)
    with app.container.get(Scope).environment(MAIN):
        with pytest.raises(RelationRead) as raised:
            probe.listed(Listing())
        assert (raised.value.listed, raised.value.table) == ("tasks", "links"), "an index that reads the links table throws, naming both tables"
        assert probe.listed(Listing(ids=(1,)))["rows"] == [{1: [Ref("plans", 1)]}], "the same read for rows asked for by id goes through"
        plan = plans.find(1)
        with tasks.listing():
            with pytest.raises(RelationRead):
                plans.find(1)
            assert tasks.unfinished_count() == 0 and plans.task_counts([plan]) == {1: 1}, "a counting query goes through, though it reads the links table"
        assert plans.find(1) == plan, "once the list is built, every table is read again"


def test_a_verifier_that_ends_with_a_typed_verdict_line_has_that_verdict_recorded(app: App, monkeypatch):
    from journal.features.verification.support.verifier_runner import VerifierRunner
    from journal.models.reader_report import ReaderReport
    from journal.models.verifier_state import VerifierState
    from journal.repositories.reader_reports import ReaderReports
    from journal.repositories.verifiers import Verifiers
    monkeypatch.setattr(VerifierRunner, "start", lambda self, verifier, resume="": verifier)
    hook(app, "SessionStart")
    console, reports, verifiers, token = app.console(), app.container.get(ReaderReports), app.container.get(Verifiers), AgentToken("the verifier's token")
    console.run(["environment", "overview"], AGENT)
    assert console.run(["reader", "add", "builds", "--commands", "make", "--pattern", "^(built|failed)", "--about", "each build's end"], AGENT).code == 0

    def session_ended_with(final_message: str) -> tuple[ReaderReport, object]:
        with app.container.get(Scope).environment(MAIN):
            report = reports.save(ReaderReport(environment_id=MAIN, reader="builds", output=0, command="make all", session="s1", findings=("a long line",), fixes=("narrow it",)), Actor.system())
        console.run(["reader", "report", str(report.id)], AGENT)
        assert console.run(["reader", "dismiss", str(report.id), "--why", "the card shows only the short line"], AGENT).code == 0
        app.runtime().deferred.drain()
        with app.container.get(Scope).environment(MAIN):
            verifier = verifiers.save([row for row in verifiers.scoped() if row.is_verifying()][-1].with_(session=f"v-{report.id}", token_hash=token.digest()), Actor.system())
        posted(app, "/hooks/claude", {"hook_event_name": "Stop", "session_id": verifier.session, "last_assistant_message": final_message}, {"X-Journal-Env": "main", "X-Journal-Actor": f"verifier:{verifier.id}", "X-Journal-Actor-Token": token.text})
        app.runtime().deferred.drain()
        with app.container.get(Scope).environment(MAIN):
            app.container.get(VerifierRunner).ended(verifier)
        app.runtime().deferred.drain()
        with app.container.get(Scope).environment(MAIN):
            return reports.find(report.id), verifiers.find(verifier.id)

    by_line, verifier = session_ended_with('journal verdict no "the output contradicts the reason"')
    assert "with the shell tool, never by writing it as text" in verifier.brief, "the brief tells the verifier to run its verdict, not write it"
    assert by_line.is_refuted and by_line.verdict.startswith("the output contradicts the reason") and "typed this verdict" in by_line.verdict and verifier.state == VerifierState.JUDGED, "a typed verdict line is recorded as if run, and says so"
    talked, verifier = session_ended_with('I think it is sound. journal verdict yes "fine"')
    assert not talked.is_refuted and not talked.verdict and verifier.state == VerifierState.ENDED, "words besides the one line record nothing"


def test_with_the_reviewer_on_clocked_out_workers_queue_in_order_for_the_reviewers_the_orchestrator_adds(app: App, monkeypatch):
    from journal.features.reviewing.support.reviewer_runner import ReviewerRunner
    from journal.repositories.entries import Entries
    from journal.repositories.reviewers import Reviewers
    from journal.repositories.tasks import Tasks
    from journal.repositories.workers import Workers
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, actor: None)
    kept_conversation(app, monkeypatch)
    console, settings = app.console(), app.container.get(SettingRows)
    hook(app, "SessionStart")
    user_set(app, "workers.mode", "orchestrator")
    user_set(app, "reviewing.reviewer", True)
    user_set(app, "workers.most_out", 0)
    with app.container.get(Scope).environment(MAIN):
        workers, reviewers, tasks = app.container.get(Workers), app.container.get(Reviewers), app.container.get(Tasks)
    ids = []
    for n, name in enumerate(("Lady Lovelace", "Mr. Babbage", "Miss Hopper", "Mr. Turing"), 1):
        assert console.run(["task", "create", f"part {n}", "--brief", f"part {n} is written"], AGENT).code == 0
        with app.container.get(Scope).environment(MAIN):
            task = max(tasks.scoped(), key=lambda row: row.id)
        dispatched = console.run(["worker", "dispatch", name, "--task", str(task.id), "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet"], AGENT)
        assert dispatched.code == 0, dispatched.error
        with app.container.get(Scope).environment(MAIN):
            worker = max(workers.scoped(), key=lambda row: row.id)
            workers.save(worker.with_(token_hash="h", session=f"w-{worker.id}", resume=f"w-{worker.id}").ready(1.0), Actor.system())
        ids.append(worker.id)
    lovelace, babbage, hopper, turing = ids
    caller = lambda n: Caller.worker("main", n, f"w-{n}", "claude")

    def clocked_out(n: int) -> None:
        assert console.run(["proof", "1", f"part{n}.py:3, test_part{n} passes"], caller(n)).code == 0
        assert console.run(["clock-out", f"worker {n} is done"], caller(n)).code == 0
        app.runtime().deferred.drain()

    def reviewing() -> dict[int, int]:
        with app.container.get(Scope).environment(MAIN):
            deadline = timing.time() + 10
            while any(not r.pid for r in reviewers.scoped() if r.is_reviewing()) and timing.time() < deadline:
                timing.sleep(0.02)
            return {r.id: int(r.brief.split("Worker ")[1].split(",")[0]) for r in reviewers.scoped() if r.is_reviewing() and r.pid}

    def queued() -> list[int]:
        with app.container.get(Scope).environment(MAIN):
            return [w.id for w in workers.queued_reviews()]

    assert "reviewers: 1, reviews waiting: 0" in console.run(["reviewer", "add"], AGENT).text, "journal reviewer add starts a reviewer"
    for n in (lovelace, babbage, hopper):
        clocked_out(n)
    first = reviewing()
    assert list(first.values()) == [lovelace] and queued() == [babbage, hopper], "the one reviewer takes the first clock-out, and the others wait in the queue in clock-out order"
    hook(app, "Stop")
    with app.container.get(Scope).environment(MAIN):
        waiting = [entry.data["line"] for entry in app.container.get(Entries).kind_entries("nudge") if entry.data["key"] == "reviewing.reviews_wait_for_a_reviewer"]
    assert waiting and has_nudge(waiting[-1], ReviewingNudges.REVIEWS_WAITING, waiting=2, reviewers=1), "the orchestrator is told how many reviews wait"
    added = console.run(["reviewer", "add"], AGENT).text
    app.runtime().deferred.drain()
    both = reviewing()
    assert "reviewers: 2, reviews waiting: 1" in added and sorted(both.values()) == [lovelace, babbage] and queued() == [hopper], "a second reviewer raises the count and takes the next review at once; the third waits"
    assert f"waiting 1: worker {hopper}, Miss Hopper" in console.run(["reviewer", "list"], AGENT).text, "the list names the review waiting"
    assert "no reviewer is idle" in console.run(["reviewer", "retire"], AGENT).error, "a reviewer at work is not retired"
    [first_reviewer] = first
    with app.container.get(Scope).environment(MAIN):
        session = reviewers.find(first_reviewer).session
    assert console.run(["review", "1 passed. Tests: pytest tests/test_part1.py passed"], Caller.reviewer("main", first_reviewer, session, "claude")).code == 0
    app.runtime().deferred.drain()
    freed = reviewing()
    assert freed.get(first_reviewer) == hopper and queued() == [], "the reviewer that reported takes the review that waited, as soon as it is free"
    with app.container.get(Scope).environment(MAIN):
        assert reviewers.find(first_reviewer).session == session, "in its own session"
    user_set(app, "reviewing.reviewer", False)
    clocked_out(turing)
    with app.container.get(Scope).environment(MAIN):
        off = workers.find(turing)
    assert off.state == WorkerState.DELIVERED and not off.review_pending and queued() == [], "with the reviewer off a clock-out waits for the orchestrator, and there is no queue"
    assert "the reviewer is off" in console.run(["reviewer", "add"], AGENT).error, "and no reviewer is added"
    with app.container.get(Scope).environment(MAIN):
        for reviewer in reviewers.scoped():
            app.container.get(ReviewerRunner).stop(reviewer)


def test_a_reviewer_sent_inside_a_transaction_still_open_runs_once_the_transaction_commits(app: App):
    from journal.features.reviewing.support.reviewer_dispatch import ReviewerDispatch
    from journal.features.reviewing.support.reviewer_runner import ReviewerRunner
    from journal.models.reviewer_state import ReviewerState
    from journal.models.worker import Worker
    from journal.repositories.reviewers import Reviewers
    from journal.repositories.workers import Workers
    with app.container.get(Scope).environment(MAIN):
        workers, reviewers = app.container.get(Workers), app.container.get(Reviewers)
        worker = workers.save(Worker(environment_id=MAIN, name="Lady Lovelace"), Actor.system())
        dispatch = app.container.get(ReviewerDispatch)
        added = dispatch.added(MAIN)
        with workers.writing():
            sent = dispatch.sent(added, worker, "review the parser")
            timing.sleep(0.5)
        deadline = timing.time() + 10
        while not reviewers.find(sent.id).pid and timing.time() < deadline:
            timing.sleep(0.02)
        running = reviewers.find(sent.id)
        assert running.pid and running.state == ReviewerState.REVIEWING, "a listener on the event that sends a reviewer holds the transaction that saved its row, and its run saves its process once that transaction commits"
        app.container.get(ReviewerRunner).stop(running)
        while reviewers.find(sent.id).state == ReviewerState.REVIEWING and timing.time() < deadline:
            timing.sleep(0.02)
        assert reviewers.find(sent.id).state == ReviewerState.ENDED, "and a run that ends without a report ends the reviewer"


def test_a_progress_pattern_that_matches_a_line_with_no_number_reads_no_progress_from_it_and_never_fails():
    from journal.features.shell.support.progress import Progress
    lines = ["running tests", "tests [ 40%]", "running tests again", "done"]
    assert Progress.found(r"tests(?: \[ *(\d+)%\])?", "", lines, "") == Progress(40, 100), "a line the pattern matches with no number in it is passed over, before and after the counted line"
    assert not Progress.found(r"running (\w+)", "", lines, "").is_known(), "a pattern whose match holds only words reads no progress"
    assert Progress.found(r"tests(?: \[ *(\d+)%\])?", "", lines, r"\.") == Progress(40, 100), "and so does a run with a step pattern"


def test_the_reader_judge_takes_only_a_bracketed_percentage_for_a_runs_progress(app: App):
    from journal.features.shell.support.reader import Reader
    from journal.features.shell.support.reader_judge import ReaderJudge
    judge = app.container.get(ReaderJudge)
    reader = Reader("tests", "the test run", "passed|Tests")
    vitest = [" ✓ a.test.ts (3 tests) 4ms", " Tests  3 passed (3)", "   Duration  1.2s (transform 20ms, tests 68%, import 12%)"]
    pytest = ["tests/test_a.py ..                 [ 40%]", "tests/test_b.py ...                [100%]", "5 passed in 0.12s"]
    assert not [miss for miss in judge.misses(reader, vitest) if "shows no progress" in miss], "a Duration line's shares are not a run's progress"
    assert [miss for miss in judge.misses(reader, pytest) if "shows no progress" in miss], "[ 40%] lines are progress the reader should show"


def test_a_long_run_is_reported_for_showing_no_progress_only_when_its_output_holds_some(app: App):
    from datetime import datetime, timedelta, timezone
    from types import SimpleNamespace
    from journal.features.shell.support.reader import Reader
    from journal.features.shell.support.reader_judge import ReaderJudge
    judge = app.container.get(ReaderJudge)
    reader = Reader("tests", "the test run", "passed|^ok")
    began = datetime(2026, 10, 25, 12, 0, tzinfo=timezone.utc)
    output = SimpleNamespace(creation_time=began, command="pytest")
    ended = began + timedelta(seconds=45)
    buffered = ["ok  \tshop/cart\t0.2s", "ok  \tshop/pay\t0.4s"]
    pytest = ["tests/test_a.py ..                 [ 40%]", "tests/test_b.py ...                [100%]"]
    assert not judge.missing_progress(reader, output, buffered, ended), "buffered go test output holds nothing to show, so no progress is asked for"
    assert judge.missing_progress(reader, output, pytest, ended), "pytest's percentages are progress a long run's reader should show"


def test_a_reader_finding_dismissed_three_times_for_one_command_is_not_raised_for_it_for_a_day(app: App):
    from datetime import datetime, timedelta, timezone
    from journal.features.shell.support.reader_judge import PROGRESS_MISSING, ReaderJudge
    from journal.features.shell.support.streaming_form import StreamingForm
    from journal.models.reader_report import ReaderReport
    from journal.repositories.reader_reports import ReaderReports
    judge = app.container.get(ReaderJudge)
    now = datetime.now(timezone.utc)
    with app.container.get(Scope).environment(MAIN):
        reports = app.container.get(ReaderReports)
        for number in range(3):
            assert judge.dismissal_kinds("go test ./other/", now) == set(), "fewer than three dismissals keep the finding"
            report = reports.save(ReaderReport(environment_id=MAIN, reader="go-packages", output=number + 1, command=f"go test ./pkg{number}/", session="s1", findings=(f"the run took 90 seconds and {PROGRESS_MISSING}",), fixes=("x",)), Actor.agent("s1"))
            reports.save(report.dismissed("go test prints one line per package"), Actor.agent("s1"))
        assert judge.dismissal_kinds("go test ./other/", now) == {PROGRESS_MISSING}, "the third dismissal for go test stops the finding for any go test run"
        assert judge.dismissal_kinds("python3 -m pytest tests/", now) == set(), "another command still gets it"
        assert judge.dismissal_kinds("go test ./other/", now + timedelta(hours=25)) == set(), "and it comes back once the hours have passed"
    assert "go test -list" in StreamingForm.advice("go test") and "--- PASS" in StreamingForm.advice("go test"), "the finding's fix for go test says how to count its tests"
    assert "N/M" in StreamingForm.advice("make"), "and any other command is told to count what has finished against the total"


def test_a_summary_reader_turns_a_runs_output_into_its_summary_and_the_judge_names_a_long_run_without_one(app: App):
    from datetime import datetime, timedelta, timezone
    from journal.features.shell.support.reader import Reader
    from journal.features.shell.support.reader_judge import SUMMARY_READER_MISSING, ReaderJudge
    pytest_like = Reader("tests", "the failures", r"^FAILED", summary_pattern=r"(?:([0-9]+ failed), )?([0-9]+ passed)")
    assert pytest_like.summary(["FAILED a", "=== 3 failed, 1146 passed in 9s ==="]) == "3 failed, 1146 passed"
    assert pytest_like.summary(["=== 12 passed in 1s ==="]) == "12 passed"
    assert Reader("none", "x", "y").summary(["3 passed"]) == "", "a reader with no summary pattern gives no summary"
    judge = app.container.get(ReaderJudge)
    output = type("Output", (), {"creation_time": datetime.now(timezone.utc) - timedelta(seconds=90)})()
    lines = ["FAILED a", "3 failed, 1146 passed in 9s"]
    [(finding, fix)] = judge.missing_summary_reader(Reader("tests", "x", "y"), output, lines, datetime.now(timezone.utc))
    assert SUMMARY_READER_MISSING in finding and "--summary" in fix and "3 failed, 1146 passed" in fix, "the finding says how to write one"
    assert judge.missing_summary_reader(pytest_like, output, lines, datetime.now(timezone.utc)) == [], "a reader with a summary reader is not reported"
    short = type("Output", (), {"creation_time": datetime.now(timezone.utc) - timedelta(seconds=5)})()
    assert judge.missing_summary_reader(Reader("tests", "x", "y"), short, lines, datetime.now(timezone.utc)) == [], "a short run needs none"


def test_a_plans_next_task_is_its_paused_one_unless_it_waits_and_a_blocked_one_never_stops_the_plan(app: App):
    from datetime import datetime, timezone
    from journal.features.plans.support.plan_task_assigner import PlanTaskAssigner
    from journal.models.task_state import TaskState
    from journal.repositories.plans import Plans
    from journal.repositories.tasks import Tasks
    console, tasks = app.console(), app.container.get(Tasks)
    console.run(["plan", "create", "release", "--brief", "ship 4.0"], USER)
    for title in ("closer", "plan paused", "plan blocked", "plan open one"):
        console.run(["plan", "add", "1", title], USER)
    for title, priority in (("outside low", "low"), ("outside high", "high")):
        console.run(["task", "create", title, "--priority", priority], USER)
    hook(app, "SessionStart")
    console.run(["plan", "approve", "1"], USER)
    assert console.run(["plan", "start", "1"], AGENT).code == 0
    for number, state in {1: TaskState.COMPLETED, 3: TaskState.BLOCKED}.items():
        tasks.save(replace(tasks.find(number), state=state, completed_at=datetime.now(timezone.utc) if state == TaskState.COMPLETED else None), Actor.user(1))
    assigner, plan = app.container.get(PlanTaskAssigner), app.container.get(Plans).find(1)
    assert assigner.following_task(plan).id == 2, "the plan's first open task comes first"
    tasks.save(replace(tasks.find(2), state=TaskState.STARTED), Actor.user(1))
    assert console.run(["task", "block", "2", "after the open one", "--on", "task:4"], USER).code == 0
    assert assigner.following_task(plan).id == 4, "a blocked task that waits on another is passed over, and a blocked one never stops the plan"
    tasks.save(replace(tasks.find(4), state=TaskState.COMPLETED, completed_at=datetime.now(timezone.utc)), Actor.user(1))
    app.runtime().deferred.drain()
    assert assigner.following_task(plan).id == 2, "once its wait is over, the blocked task is open and comes first again"
    assert [task.title for task in tasks.next_open_tasks(5) if task.title.startswith("outside")] == ["outside high", "outside low"], "free tasks go by priority"


def test_a_reminder_set_for_a_local_time_in_a_repeated_hour_is_due_at_its_earlier_moment(monkeypatch: pytest.MonkeyPatch):
    import time
    from datetime import datetime, timezone

    from journal.features.memory.commands.reminder_command import ReminderCommand

    monkeypatch.setenv("TZ", "Europe/Amsterdam")
    time.tzset()
    try:
        assert ReminderCommand.moment("2026-10-25 02:30") == datetime(2026, 10, 25, 0, 30, tzinfo=timezone.utc), "the clocks went back at 03:00, so 02:30 happened twice, and the reminder is due at the first"
    finally:
        monkeypatch.undo()
        time.tzset()


def test_the_test_turns_not_ended_are_listed_for_the_viewer_with_since_when_each_has_run(app: App):
    from journal.http.controllers.test_turns import TestTurnController
    from journal.http.listing import Listing
    from journal.models.test_turn import TestTurn
    from journal.repositories.test_turns import TestTurns
    with app.container.get(Scope).environment(MAIN):
        turns = app.container.get(TestTurns)
        waiting = turns.save(TestTurn(environment_id=MAIN, worker=3, ids="tests/test_a.py::test_one"), Actor.worker(3))
        running = turns.save(TestTurn(environment_id=MAIN, worker=4, ids="tests/test_b.py::test_two").started(1000.0), Actor.worker(4))
        turns.save(TestTurn(environment_id=MAIN, worker=5, ids="tests/test_c.py::test_three").started(900.0).ended(), Actor.worker(5))
        rows = app.container.get(TestTurnController).listed(Listing())["rows"]
    assert [(row.id, row.worker, row.state, row.started_at) for row in rows] == [(waiting.id, 3, "waiting", 0.0), (running.id, 4, "running", 1000.0)], "the viewer reads the turns running and waiting, a running one with the time it started, and no ended one"


def drafted_plan(app: App, caller: Caller, title: str) -> int:
    from journal.repositories.plans import Plans
    console = app.console()
    made = console.run(["plan", "create", title, "--brief", "the goal"], caller)
    assert made.code == 0, made.error
    with app.container.get(Scope).environment(MAIN):
        n = str(max(plan.id for plan in app.container.get(Plans).scoped()))
    console.run(["plan", "phase", n, "Lay the floor", "--when", "the floor is level"], caller)
    added = console.run(["plan", "add", n, "pour the slab"], caller)
    assert added.code == 0, added.error
    task = added.text.split()[1]
    assert console.run(["plan", "todos", n, "1", task], caller).code == 0
    readied = console.run(["plan", "ready", n], caller)
    assert readied.code == 0, readied.error
    return int(n)


def test_the_switch_to_approve_only_plans_it_did_not_write_becomes_the_plans_the_user_made(app: App):
    from journal.db.connection import Connection
    from journal.db.migrations.plan_approval_choice import PlanApprovalChoice
    connection = app.container.get(Connection)
    insert = lambda environment, key, value: connection.execute("INSERT INTO settings (environment_id, key, value) VALUES (?, ?, ?)", (environment, key, value))
    insert(7, "workers.orchestrator_approves_plans", "true")
    insert(7, "workers.orchestrator_approves_others_plans", "true")
    insert(8, "workers.orchestrator_approves_plans", "true")
    insert(8, "workers.orchestrator_approves_others_plans", "false")
    PlanApprovalChoice().apply(connection)
    rows = {(row["environment_id"], row["key"]): row["value"] for row in connection.all("SELECT environment_id, key, value FROM settings WHERE environment_id IN (7, 8)")}
    assert rows == {(7, "workers.orchestrator_approves_plans"): "true", (7, "workers.orchestrator_plan_approval"): '"can approve plans the user made"', (8, "workers.orchestrator_approves_plans"): "true"}, rows


def test_a_seed_that_raises_at_boot_is_logged_and_skipped_and_the_failure_and_the_supervisors_notice_are_told_once_booted(app: App, capsys):
    from journal.engine.boot_notices import BOOT_NOTICE, BootNotices
    from journal.events.bus import Bus
    from journal.events.moments.boot_failed import BootFailed
    from journal.features.seed import Seed
    from journal.version import VERSION

    class RemovedReader(Seed):
        def run(self) -> None:
            raise ValueError("a removed reader")

    told = []
    bus = app.container.get(Bus)
    bus.listen(BootFailed, type("Hears", (Listener,), {"handle": lambda self, event: told.append(event.text)})())
    app.runtime().seeded(RemovedReader)
    assert "ValueError: a removed reader" in capsys.readouterr().err, "the traceback is logged"
    notice = app.container.get(Config).home / "runtime" / BOOT_NOTICE
    notice.parent.mkdir(parents=True, exist_ok=True)
    notice.write_text("The journal failed to boot twice, so the last version that booted, {version}, runs instead.\n")
    app.container.get(BootNotices).announce()
    assert told == [f"The journal failed to boot twice, so the last version that booted, {VERSION}, runs instead.", "RemovedReader raised at boot and was skipped: ValueError: a removed reader"], "the supervisor's line and the seed's fault are told"
    assert not notice.exists(), "and told once"
    app.container.get(BootNotices).announce()
    assert len(told) == 2


def test_a_worker_at_rest_past_the_set_hours_is_retired_by_the_hourly_cleanup_and_its_worktree_deleted(app: App, monkeypatch):
    from journal.features.workers.jobs.worktree_cleanup import WorktreeCleanup
    from journal.repositories.workers import Workers
    workspace_made(app, ("platform",))
    worker, folder, _ = worktree_worker(app, monkeypatch, "platform totals")
    cleanup = app.container.get(WorktreeCleanup)
    cleanup.tick(timing.time() + 5 * 3600)
    assert folder.is_dir(), "a worker still out keeps its worktree, however long it runs"
    with app.container.get(Scope).environment(MAIN):
        workers = app.container.get(Workers)
        resting = workers.find(worker.id)
        workers.save(resting.with_(state=WorkerState.REPORTED, moves=resting.moves.added("reported", timing.time())), Actor.system())
    cleanup.tick(timing.time() + 3 * 3600)
    assert folder.is_dir(), "one at rest for less than the set four hours keeps it"
    cleanup.tick(timing.time() + 5 * 3600)
    assert not folder.is_dir() and worker_row(app).adopted, "one at rest past them, with nothing unmerged, is retired and its worktree deleted"


def test_every_card_kind_is_a_registered_chat_mark_in_a_group_served_with_the_manifest_as_the_viewers_tests_read_it(app):
    from journal.support.card_type import CardType
    from journal.support.card_type_catalogue import CardTypeCatalogue
    from journal.features.registry import Registry
    registry = app.container.get(Registry)
    served = json.loads(json.dumps(CardTypeCatalogue.served(registry.card_families(), registry.card_types())))
    groups, families, kinds = {group["key"] for group in served["groups"]}, {family["key"]: family for family in served["families"]}, {type_name["key"]: type_name for type_name in served["kinds"]}
    assert set(CardType) <= set(kinds) and all(type_name["family"] in families for type_name in kinds.values()) and all(family["group"] in groups for family in families.values()), "every kind a card names is declared, each in a declared family inside a group"
    assert all(type_name["icon"] == families[type_name["family"]]["icon"] for type_name in kinds.values()), "a kind's icon is its family's, never its own"
    assert families["tasks"]["icon"] == "task" and families["tasks"]["colouring"] == "none" and families["commands"]["colouring"] == "outcome", "a task's cards are events with the task icon; a command's are processes coloured by their outcome"
    assert {"thoughts", "visitors", "acknowledgements", "agents"} <= set(kinds) and "receipt" in kinds[CardType.FILED]["turns"], "the turn kinds only the viewer draws are registered the same way"
    assert all(type_name["shown"] for type_name in kinds.values()) and kinds[CardType.SEQUENCES]["main"] and not kinds[CardType.SEQUENCE_STEPS]["main"], "every kind of mark shows until the user hides it; a sequence's steps are a detail of its start and finish"
    fixture = Path(__file__).parents[1] / "src" / "web" / "tests" / "fixtures" / "markKinds.json"
    if os.environ.get("MARKS_FREEZE") == "1":
        fixture.write_text(json.dumps(served, indent=1) + "\n")
    assert served == json.loads(fixture.read_text()), "the viewer's tests read the registry as it is served (re-freeze with MARKS_FREEZE=1 when the change is meant)"


def test_a_rebase_order_rebases_a_resting_worker_at_once_and_sends_a_clash_back(app: App, monkeypatch):
    root = workspace_made(app, ("platform",))
    _, folder, caller = worktree_worker(app, monkeypatch, "platform totals")
    _, second, second_caller = worktree_worker(app, monkeypatch, "platform header", n=2)
    committed(folder / "platform", "totals.php", "<?php\n// totals\n")
    committed(second / "platform", "app.php", "<?php\n// the second worker's line\n")
    assert proved_and_out(app, caller, "platform/totals.php:1").code == 0
    assert proved_and_out(app, second_caller, "platform/app.php:1").code == 0
    committed(root / "platform", "notes.md", "a later note\n")
    committed(root / "platform", "app.php", "<?php\n// the user's line\n")
    ordered = app.console().run(["worker", "rebase"], AGENT)
    assert ordered.code == 0, ordered.error
    assert (folder / "platform/notes.md").is_file() and worker_row(app).state == WorkerState.DELIVERED, "a clocked-out worker is rebased at once and stays as it was"
    assert worker_row(app, 2).state == WorkerState.DISPATCHED and "conflict in platform/app.php" in worker_row(app, 2).brief, "one that clashes goes back to fix the files"


def test_a_long_run_whose_progress_showed_only_in_its_last_lines_is_flagged_and_one_counting_as_it_went_is_not():
    from datetime import datetime, timedelta, timezone
    from types import SimpleNamespace
    from journal.features.shell.support.progress_stalls import ProgressStalls
    from journal.features.shell.support.reader import Reader
    from journal.features.shell.support.reader_judge import PROGRESS_LATE, ReaderJudge
    began = datetime(2026, 10, 26, tzinfo=timezone.utc)
    output = SimpleNamespace(row_id=5, command="pytest -q", creation_time=began)
    reader = Reader("tests", "the tests", progress_pattern=r"\[ *([0-9]+)%\]", label="Running tests")
    lines = ["collected 3 items", "1 passed, 2 failed [100%]"]
    judge = lambda stalls: ReaderJudge(None, None, stalls, None, None, None, None, None, None, None, None, SHAPES)
    late = judge(ProgressStalls()).late_progress(reader, output, lines, began + timedelta(seconds=40))
    assert len(late) == 1 and PROGRESS_LATE in late[0][0] and "scripts/suite.py" in late[0][1], "a figure printed only at the end of a 40 second run is flagged with the counting advice"
    counted = ProgressStalls()
    counted.seen(5, 0.4, 10.0)
    assert judge(counted).late_progress(reader, output, lines, began + timedelta(seconds=40)) == [], "progress seen while the run went raises nothing"
    assert judge(ProgressStalls()).late_progress(reader, output, lines, began + timedelta(seconds=10)) == [], "a short run raises nothing"


def plugin_releases_made(folder: Path, releases: dict[str, dict]) -> str:
    """A git repository of a plugin named tagged, one commit and one release tag for each of the releases given with the manifest keys it adds, and the address file:// that reaches it."""
    manifest = {"name": "tagged", "version": "1.0.0", "program": "run.py", "hears": ["tool_starting"]}
    repository_made(folder, {"run.py": "print()", "journal-plugin.json": json.dumps(manifest)})
    for tag, extra in releases.items():
        (folder / "journal-plugin.json").write_text(json.dumps({**manifest, "version": tag.removeprefix("v"), **extra}))
        git_run(folder, "commit", "-qam", tag)
        git_run(folder, "tag", tag)
    return f"file://{folder}"


def test_a_plugin_pasted_as_a_git_address_is_installed_at_the_newest_release_tag_that_runs_on_this_journal(app: App, tmp_path):
    from journal.features.plugins.support.plugin_installing import PluginInstalling
    from journal.repositories.plugins import Plugins
    from journal.support.rejection import Rejection
    from journal.version import VERSION
    installing = app.container.get(PluginInstalling)
    address = plugin_releases_made(tmp_path / "tagged", {"v1.0.0": {}, "v1.5.0": {"journal": VERSION}, "v2.0.0": {"journal": "99.0.0"}})
    assert installing.preview(address).release == "v1.5.0", "the card names the release it chose, the newest that fits"
    installed = installing.install(address, "main", Actor.user(1))
    assert installed.release == "v1.5.0" and installed.manifest.version == "1.5.0" and app.container.get(Plugins).lookup("tagged").release == "v1.5.0"
    app.container.get(Plugins).delete(installed, Actor.user(1))
    none = plugin_releases_made(tmp_path / "toonew", {"v2.0.0": {"journal": "99.0.0"}})
    with pytest.raises(Rejection) as refused:
        installing.preview(none)
    assert "v2.0.0" in str(refused.value) and "99.0.0" in str(refused.value), "none fits: the card says what the newest needs"


def test_a_git_commit_push_and_switch_are_marked_from_their_events_alone_or_chained_and_a_line_with_other_work_keeps_its_card(app: App, tmp_path):
    from journal.repositories.messages import Messages
    from journal.features.shell.support.shell_record import ShellRecord
    from journal.repositories.scope import Scope
    from journal.support.caller import Caller
    from journal.support.command_classifier import CommandClassifier
    from journal.support.command_part import CommandPart
    folder = repository_made(tmp_path / "work", {"a.txt": "one\n"})
    git_run(folder, "checkout", "-q", "-b", "development")
    (folder / "a.txt").write_text("two\n")
    (folder / "b.txt").write_text("new\n")
    git_run(folder, "add", "-A")
    git_run(folder, "commit", "-qm", "Two files")
    caller = Caller.agent("main", "s1", "claude")
    record = app.container.get(ShellRecord)
    part = lambda text: CommandPart.plain(text, app.container.get(CommandClassifier))
    marks = lambda: [m.text for m in app.container.get(Messages).scoped() if m.data.get("shows") in ("commits", "pushes", "branch_switches")]
    with app.container.get(Scope).environment(MAIN):
        record.start("c1", "git add -A && git commit -qm 'Two files'", tmp_path / "out1", caller, str(folder))
        record.finish_part("c1", part("git commit -qm 'Two files'"), 0, 0.1, "", [], caller)
        record.finish_part("c1", part("git commit -qm 'Two files'"), 0, 0.1, "", [], caller)
        git_run(folder, "checkout", "-q", "-b", "phone")
        record.start("c2", "git checkout -b phone", tmp_path / "out2", caller, str(folder))
        record.finish_part("c2", part("git checkout -b phone"), 0, 0.1, "", [], caller)
        record.finish_part("c2", part("git status"), 0, 0.1, "", [], caller)
        record.start("c3", "git push origin phone", tmp_path / "out3", caller, str(folder))
        record.finish_part("c3", part("git push origin phone"), 0, 0.1, "", [], caller)
        record.finish_part("c3", part("git commit -qm 'Two files'"), 1, 0.1, "", [], caller)
    head = git_run(folder, "rev-parse", "development").stdout.strip()[:8]
    assert marks() == ["Committed a change on development", "Switched to branch phone", "Pushed phone"], "a commit once however often it ends, a switch, a push; a failed part and a status mark nothing"


def test_a_long_build_whose_card_showed_nothing_moving_is_told_how_to_show_progress_with_its_tools_advice(app: App):
    from datetime import datetime, timedelta, timezone
    from types import SimpleNamespace
    from journal.features.shell.support.progress_stalls import ProgressStalls
    from journal.features.shell.support.reader import Reader
    from journal.features.shell.support.reader_judge import BUILD_UNSHOWN, ReaderJudge
    began = datetime(2026, 10, 26, tzinfo=timezone.utc)
    output = lambda command: SimpleNamespace(row_id=6, command=command, creation_time=began)
    reader = Reader("builds", "the build", label="Building the viewer")
    from journal.features.shell.support.activity_label import ActivityLabel
    judge = ReaderJudge(None, None, ProgressStalls(), None, None, None, None, None, None, app.container.get(ActivityLabel), None, SHAPES)
    found = judge.unshown_build(reader, output("vite build"), ["transforming...", "built in 38s"], began + timedelta(seconds=40))
    assert len(found) == 1 and BUILD_UNSHOWN in found[0][0] and "--logLevel info" in found[0][1], "a 40 second vite build with no figure gets the finding with the vite advice"
    assert judge.unshown_build(reader, output("vite build"), ["transforming..."], began + timedelta(seconds=10)) == [], "a short build raises nothing"
    assert judge.unshown_build(reader, output("pytest -q"), ["..."], began + timedelta(seconds=40)) == [], "a run that is not a build raises nothing"


def test_a_git_push_alias_run_raises_no_one_word_title_report_and_its_label_says_what_runs(app: App):
    from datetime import datetime, timezone
    from types import SimpleNamespace
    from journal.features.shell.support.activity_label import ActivityLabel
    labels = app.container.get(ActivityLabel)
    from journal.features.shell.support.reader_judge import ReaderJudge
    from journal.models.alias import Alias
    judge = ReaderJudge(None, None, None, SimpleNamespace(open_with_output_finding=lambda output, finding: []), None, None, None, None, SimpleNamespace(index=lambda: {"push-development": Alias(name="push-development", line="git push origin development")}), None, None, SHAPES)
    output = lambda command: SimpleNamespace(id=9, command=command, environment_id=1, session="s1", watch_reader="")
    assert not judge.is_one_word_title_due(output("journal push-development"), "Pushing"), "a git push, by its alias, may have no reader of its own, so its title is never reported"
    assert not judge.is_one_word_title_due(output("git commit -m x"), "Committing")
    assert judge.is_one_word_title_due(output("make"), "Building"), "any other run with a one word title is still reported"
    assert labels.build("git push origin development") == "pushing to origin" and len(labels.build("git push").split()) > 1, "and the journal's own label for a push says what runs"


def test_the_retired_commit_reader_is_taken_out_at_boot_so_a_commit_shows_only_its_mark(app: App):
    from journal.features.shell.seeds.default_readers import DefaultReaders
    from journal.features.shell.support.reader import Reader
    from journal.features.shell.support.reader_commands import ReaderCommands
    (app.config.readers / "git-commit.pattern").write_text(Reader("git-commit", "a commit", ".", label="Committing", commands=ReaderCommands(("git commit",))).text())
    app.container.get(DefaultReaders).run()
    assert not (app.config.readers / "git-commit.pattern").exists(), "the commit reader the journal once shipped is removed, so a commit's mark alone says it"


def test_the_checks_page_lists_the_repositorys_git_hooks_by_name_with_whether_they_run_and_what_they_run(app: App):
    import os
    import subprocess
    root = app.config.root
    subprocess.run(["git", "init", "-q"], cwd=root, check=True)
    hooks = root / ".git" / "hooks"
    hooks.mkdir(parents=True, exist_ok=True)
    (hooks / "pre-push").write_text("#!/bin/sh\n# the push gate: the tests must pass before a push\npython3 scripts/suite.py\n")
    os.chmod(hooks / "pre-push", 0o755)
    (hooks / "commit-msg").write_text("#!/bin/sh\n# a commit message names its task\ngrep -q Task \"$1\"\n")
    os.chmod(hooks / "commit-msg", 0o644)
    (hooks / "pre-commit.sample").write_text("#!/bin/sh\n")
    status, listed = get_answer(app, "/journal/git-hooks", {"X-Journal-Env": "main"})
    by_name = {hook["name"]: hook for hook in listed}
    assert status == 200 and sorted(by_name) == ["commit-msg", "pre-push"], "each hook by its name, the samples left out"
    assert by_name["pre-push"]["is_active"] is True and by_name["commit-msg"]["is_active"] is False, "a hook that is not executable is listed as not running"
    assert by_name["pre-push"]["purpose"].startswith("the push gate") and by_name["pre-push"]["commands"] == ["python3 scripts/suite.py"], "what its comments say and what it runs"
    subprocess.run(["git", "config", "core.hooksPath", "tools/hooks"], cwd=root, check=True)
    (root / "tools" / "hooks").mkdir(parents=True)
    (root / "tools" / "hooks" / "post-commit").write_text("#!/bin/sh\necho done\n")
    os.chmod(root / "tools" / "hooks" / "post-commit", 0o755)
    assert [hook["name"] for hook in get_answer(app, "/journal/git-hooks", {"X-Journal-Env": "main"})[1]] == ["post-commit"], "core.hooksPath names the folder git uses"


def test_a_commit_is_one_card_whichever_session_sees_it_and_a_merge_read_twice_acts_on_its_trailer_once(app: App, monkeypatch):
    import subprocess
    from journal.events.moments.git_committed import GitCommitted
    from journal.features.git.listeners.commit_card import CommitCard
    from journal.repositories.messages import Messages
    monkeypatch.setattr(WorkerRunner, "start", lambda self, worker, actor: None)
    root = app.config.root
    git = lambda *argv: subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", *argv], cwd=root, capture_output=True, text=True, timeout=30)
    git("init", "-q", "-b", "main")
    git("commit", "-q", "--allow-empty", "-m", "the footer")
    hook(app, "SessionStart")
    committed = lambda session: posted(app, "/hooks/claude", {"hook_event_name": "PostToolUse", "session_id": session, "tool_name": "Bash", "tool_input": {"command": "git commit -m x"}, "tool_response": {}}, {"X-Journal-Env": "main"})
    committed("s1")
    posted(app, "/hooks/claude", {"hook_event_name": "SessionStart", "session_id": "s2"}, {"X-Journal-Env": "main"})
    committed("s2")
    cards = lambda: [m.text for m in app.container.get(Messages).all() if m.data.get("shows") == "commits"]
    assert len(cards()) == 1 and cards()[0].startswith("Committed "), "a commit is one card in its environment, whichever session read the head"
    sha = git("rev-parse", "HEAD").stdout.strip()
    with app.container.get(Scope).environment(MAIN):
        app.container.get(CommitCard).handle(GitCommitted(environment_id=MAIN, session="s2", sha=sha, branch="main", subject="the footer", files=0))
    assert len(cards()) == 1, "the card is known by the commit's key in the environment, never by the session that announced it"
    app.console().run(["task", "create", "the parser", "--brief", "the parser reads"], AGENT)
    app.console().run(["worker", "dispatch", "Lady Lovelace", "--task", "1", "--changes", "the files of its task", "--tests", "Scoped tests", "--profile", "journal-medior", "--model", "sonnet"], AGENT)
    git("checkout", "-q", "-b", "side")
    git("commit", "-q", "--allow-empty", "-m", "more of the parser\n\nJournal: tasks done 1")
    git("checkout", "-q", "main")
    git("merge", "-q", "--no-ff", "--no-edit", "side")
    merged = [posted(app, "/hooks/claude", {"hook_event_name": "PostToolUse", "session_id": "s2", "tool_name": "Bash", "tool_input": {"command": "git merge side"}, "tool_response": {}}, {"X-Journal-Env": "main"})[1] for _ in range(2)]
    assert "task 1 is worker 1's" in json.dumps(merged[0]) and "task 1 is worker 1's" not in json.dumps(merged[1]), "a merged commit's trailer is acted on once, by the same check as a commit read at the head"


def test_each_work_mode_takes_the_tasks_of_the_running_plans_its_own_way(app: App):
    from journal.features.plans.support.plan_task_assigner import PlanTaskAssigner
    from journal.features.tasks.support.round_robin_delivery import RoundRobinDelivery
    from journal.models.task_state import TaskState
    from journal.repositories.plans import Plans
    from journal.repositories.tasks import Tasks
    console, plans, tasks = app.console(), app.container.get(Plans), app.container.get(Tasks)
    for title in ("first", "second"):
        console.run(["plan", "create", title, "--brief", "b"], USER)
    for plan, titles in ((1, ("a1", "a2")), (2, ("b1", "b2"))):
        for title in titles:
            console.run(["plan", "add", str(plan), title], USER)
    for plan in (1, 2):
        console.run(["plan", "approve", str(plan)], USER)
    user_set(app, "workers.mode", "orchestrator")
    with app.container.get(Scope).environment(MAIN):
        for plan in (1, 2):
            plans.opened(plans.find(plan), Actor.user(1))
        tasks.save(replace(tasks.find(1), state=TaskState.COMPLETED), Actor.user(1))
        assert app.container.get(PlanTaskAssigner).following_task(plans.find(1)).title == "a2", "a builder goes on in the plan it follows"
        round_robin = app.container.get(RoundRobinDelivery)
        assert [task.title for task in round_robin.offers()] == ["a2", "b1", "b2"], "the orchestrator hands out the plans' tasks in turn"
        assert round_robin.ordered_plans(plans.running_plans(), 1)[0].row_id == 2, "and after a task of the first plan closes the second plan goes first"


def test_the_git_page_reads_branches_with_their_distance_from_the_base_the_recent_commits_and_the_open_pull_requests(app: App, monkeypatch):
    import subprocess
    from journal.http.git.git_overview import GitOverview
    root = app.config.root
    git = lambda *argv: subprocess.run(["git", "-c", "user.email=t@example.com", "-c", "user.name=T", *argv], cwd=root, capture_output=True, text=True, timeout=30)
    git("init", "-q", "-b", "development")
    (root / ".gitignore").write_text(".journal/\n")
    git("add", ".gitignore")
    git("commit", "-qm", "start")
    git("checkout", "-q", "-b", "feature")
    (root / "a.txt").write_text("a")
    git("add", "a.txt")
    git("commit", "-qm", "a feature commit")
    git("checkout", "-q", "development")
    (root / "b.txt").write_text("b")
    git("add", "b.txt")
    git("commit", "-qm", "a base commit")
    headers = {"X-Journal-Env": "main"}
    status, page = get_answer(app, "/journal/git/branches", headers)
    rows = {row["name"]: row for row in page["rows"]}
    assert status == 200 and page["is_last_page"] and (rows["feature"]["extra_commits"], rows["feature"]["missing_commits"]) == (1, 1), "a branch is shown with the commits it has beyond development and those it lacks"
    assert rows["development"]["current"] and not rows["feature"]["current"] and rows["feature"]["subject"] == "a feature commit"
    status, first = get_answer(app, "/journal/git/commits?last=1", headers)
    assert [row["subject"] for row in first["rows"]] == ["a base commit"] and not first["is_last_page"], "the recent commits of the current branch come a page at a time"
    status, rest = get_answer(app, "/journal/git/commits?last=5&skip=1", headers)
    assert [row["subject"] for row in rest["rows"]] == ["start"] and rest["is_last_page"]
    from journal.http.git.git_finished import GitFinished
    listing = "7\tfalse\tAPPROVED\tSUCCESS,FAILURE,IN_PROGRESS\tfeature\tjesse\thttps://example.com/7\tAdd the page\n"
    monkeypatch.setattr("shutil.which", lambda name: "/usr/bin/gh")
    monkeypatch.setattr(GitOverview, "run", lambda self, *command: GitFinished(True, listing))
    status, pulls = get_answer(app, "/journal/git/pulls", headers)
    assert pulls["available"] and [(row["number"], row["title"], row["review"], row["checks_passed"], row["checks_failed"], row["checks_pending"]) for row in pulls["rows"]] == [(7, "Add the page", "APPROVED", 1, 1, 1)]
    monkeypatch.setattr("shutil.which", lambda name: None)
    assert get_answer(app, "/journal/git/pulls", headers)[1] == {"available": False, "rows": []}, "without gh the page says so and lists nothing"


def test_a_process_card_keeps_its_id_and_time_and_its_place_among_the_messages_through_its_end(app: App):
    from journal.chat.process_card_contents import ProcessCardContents
    from journal.chat.process_cards import ProcessCards
    from journal.models.author import Author
    from journal.models.message import Message
    from journal.repositories.messages import Messages
    from journal.support.card_type import CardType
    with app.container.get(Scope).environment(MAIN):
        cards, messages = app.container.get(ProcessCards), app.container.get(Messages)
        began = cards.show(ProcessCardContents("output", MAIN, "watch:77", "Building the viewer", {"kind": "card"}, Actor.system(), CardType.COMMANDS, True))
        later = messages.save(Message(environment_id=MAIN, author=Author.USER, text="a message after the run began"), Actor.system())
        ended = cards.show(ProcessCardContents("output", MAIN, "watch:77", "Building the viewer", {"kind": "card"}, Actor.system(), CardType.COMMANDS, False))
        assert (ended.id, ended.created_at) == (began.id, began.created_at), "the card that ends is the one written when its run began, never a second message with a new time"
        assert not ended.data["active"] and len(messages.with_key("watch:77")) == 1
        order = [message.id for message in messages.all() if message.id in (began.id, later.id)]
        assert order == [began.id, later.id], "the ended card stays before the message that came after its start"


def test_the_workers_recent_activity_is_their_marks_newest_first_and_no_other(app: App):
    from journal.chat.moment_cards import MomentCards
    from journal.repositories.messages import Messages
    from journal.support.card_type import CardType
    with app.container.get(Scope).environment(MAIN):
        cards = app.container.get(MomentCards)
        cards.show_fields(MAIN, None, "A: sent its next job", {"kind": "card", "row": "workers:1", "command": ""}, Actor.system(), CardType.WORKER_STEPS)
        cards.show(MAIN, None, "Not a worker's", "", shows=CardType.COMMANDS)
        cards.show_fields(MAIN, None, "A: its tests passed", {"kind": "card", "row": "workers:1", "command": ""}, Actor.system(), CardType.WORKER_TESTS)
        newest = app.container.get(Messages).newest_moments((CardType.WORKERS, CardType.WORKER_STEPS, CardType.WORKER_TESTS), 10)
    assert [message.text for message in newest] == ["A: its tests passed", "A: sent its next job"]


def test_a_progress_read_as_a_percentage_past_100_or_counting_towards_an_id_is_reported():
    from types import SimpleNamespace
    from journal.features.shell.support.reader import Reader
    from journal.features.shell.support.reader_judge import ReaderJudge
    judge = ReaderJudge(None, None, None, None, None, SimpleNamespace(reader_ended=lambda name, last: []), None, None, SimpleNamespace(index=lambda: {}), None, None, SHAPES)
    percent = Reader("tests", "a go test run", progress_pattern=r"=== RUN\s+\S+\s+(\d+)")
    cases = [f"=== RUN   TestCase {n}" for n in (99, 119, 121)]
    found = judge.false_progress(percent, cases)
    assert len(found) == 1 and "read as a percentage" in found[0] and "119, 121" in found[0], f"case 119 read as 119 per cent is reported (output 4662 of the code-commandments project): {found}"
    assert judge.false_progress(percent, ["=== RUN   TestCase 40", "=== RUN   TestCase 80"]) == [], "a percentage within 100 is fine"
    jobs = Reader("release-watch", "a release watch", progress_pattern=r"in (\d+)s \(ID (\d+)\)")
    watched = [f"✓ build in {seconds}s (ID 121632227066)" for seconds in (12, 55)]
    found = judge.false_progress(jobs, watched)
    assert len(found) == 1 and "121632227066" in found[0] and "an id" in found[0], f"a count towards a job's id, 55/121632227066, is reported: {found}"


def test_the_release_check_asks_through_gh_when_logged_in_waits_out_a_refusal_quietly_and_is_shared_by_the_machine(app: App, monkeypatch):
    import email.message
    import subprocess
    from urllib.error import HTTPError
    from journal.features.updates.support import release_source as release_source_module
    from journal.features.updates.support.release_check import ReleaseCheck
    from journal.features.updates.support.release_check_memory import ReleaseCheckMemory
    from journal.features.updates.support.release_refusal import ReleaseRefusal
    from journal.features.updates.support.release_source import ReleaseSource
    from journal.features.updates.support.updater import Updater
    from journal.support.time_source import TimeSource
    memory, clock = ReleaseCheckMemory(), TimeSource()
    source = ReleaseSource(memory, clock)
    monkeypatch.setattr(ReleaseSource, "has_cli_login", staticmethod(lambda: True))
    monkeypatch.setattr(release_source_module.subprocess, "run", lambda command, **options: subprocess.CompletedProcess(command, 0, json.dumps([{"ref": "refs/tags/v4.70.0"}]), ""))
    assert source.tags("v4.") == ["v4.70.0"] and memory.last().tags == ("v4.70.0",), "with gh logged in the tags are read through it, and the look is stored for the machine"
    headers = email.message.Message()
    headers["X-RateLimit-Remaining"], headers["X-RateLimit-Reset"] = "0", "4102444800"

    def refused(*arguments, **options):
        raise HTTPError("https://api.github.com", 403, "rate limit exceeded", headers, None)
    monkeypatch.setattr(ReleaseSource, "has_cli_login", staticmethod(lambda: False))
    monkeypatch.setattr(release_source_module, "urlopen", refused)
    with pytest.raises(ReleaseRefusal):
        source.tags("v4.")
    assert memory.last().refusal_end_at == 4102444800.0 and memory.last().tags == ("v4.70.0",), "a refusal is stored with GitHub's reset time, the last tags kept"
    updater = app.container.get(Updater)
    monkeypatch.setattr(updater, "source", source)
    updater.read()
    assert updater.problem == "" and updater._next_check_at == 4102444800.0, "a refusal says nothing to the user and waits until the reset"
    memory.store(ReleaseCheck(1000.0, 0.0, ("v4.70.0",)))
    assert source.next_check_time(3600) == 4600.0 and source.stored_tags("v4.") == ["v4.70.0"], "a journal that starts again counts its next look from the machine's last one and keeps its tags"


def test_a_check_row_is_updated_twice_by_a_run_once_when_it_starts_and_once_when_it_ends(app: App):
    from journal.events.bus import Bus
    from journal.events.listener import Listener
    from journal.events.models.updated import Updated
    from journal.features.checks.support.check_runner import CheckRunner
    from journal.models.check import Check
    from journal.repositories.checks import Checks
    saved = []

    class Saves(Listener[Updated]):
        def handle(self, event: Updated) -> None:
            if isinstance(event.model, Check):
                saved.append(event.model.progress is not None)

    check = app.container.get(Checks).save(Check(title="quick", command="true", interval=60), Actor.system())
    app.container.get(Bus).listen(Updated, Saves())
    app.container.get(CheckRunner).run(check, Actor.system())
    app.container.get(ListenerQueue).drain()
    assert saved == [True, False], "one save marks the run started with its process, one records its result; none in between for a quick run"


NUDGE_PLACEHOLDER = re.compile(r"<[^<>]+>|\{\{\w+(?:\|cap=\d+)?\}\}")
# a command run by the project shim, and a name the user gave an alias: neither is a noun of the console
NUDGE_SHIM_COMMANDS = {"suite"}
NUDGE_COMMAND = re.compile(r"`(journal [^`]+)`")


def nudge_command_parsed(console, role, words: list[str]):
    try:
        return console.parser(role).parse_args(console.with_verb(console.switched(words, role), role))
    except (SystemExit, argparse.ArgumentError):
        return None


def test_every_journal_command_a_nudge_names_in_backticks_is_written_whole_as_the_console_parses_it(app: App):
    import argparse
    import shlex
    from journal.console.console import Console
    from journal.features.registry import Registry
    from journal.support.agent_role import AgentRole
    console = app.container.get(Console)
    refused = []
    for feature in app.container.get(Registry).features:
        for nudge in feature.nudges:
            for command in NUDGE_COMMAND.findall(f"{nudge.title} {nudge.brief}"):
                if command.split(" ")[1].startswith(("{{", "<")) or command.split(" ")[1] in NUDGE_SHIM_COMMANDS:
                    continue
                words = shlex.split(NUDGE_PLACEHOLDER.sub("1", re.sub(r"\[[^\]]*\]", "", command)).replace("...", ""))[1:]
                parsed = [parsed_args for role in (AgentRole.MAIN, *AgentRole.helpers()) if (parsed_args := nudge_command_parsed(console, role, words)) is not None]
                if not parsed:
                    refused.append(f"{nudge.key}: {command} (no role's console parses it)")
                    continue
                args = parsed[0]
                if args.noun == "await" and args.verb == "begin" and not (args.output or args.until):
                    refused.append(f"{nudge.key}: {command} (journal await needs --output or --until)")
    assert refused == [], "a command a nudge names would be refused as written:\n" + "\n".join(refused)


def test_a_chain_of_three_parts_is_classified_only_by_its_command_parts_and_no_other_caller_classifies_a_part(app: App):
    import re
    from pathlib import Path
    from journal.providers.provider import Provider
    from journal.support.command_classifier import CommandClassifier
    from journal.support.command_part import CommandPart
    classifier = app.container.get(CommandClassifier)
    line = "cd src && pytest tests/test_a.py && git commit -m done"
    parts = Provider.parts(line, frozenset(), classifier)
    assert [part.text for part in parts] == ["cd src", "pytest tests/test_a.py", "git commit -m done"]
    assert [part.classification.is_test_run for part in parts] == [False, True, False], "the part that runs tests says so"
    assert [part.classification for part in parts] == [CommandPart.plain(part.text, classifier).classification for part in parts], "a part met as text reads the same as one split from its line"
    assert parts[2].is_git, "and the commit is the version control one"
    classifying = [path.name for path in Path("src/journal").rglob("*.py") if re.search(r"classifier\.classify\(", path.read_text())]
    assert classifying == ["command_part.py"], f"no caller outside CommandPart.read classifies a part's text: {classifying}"


def test_switching_the_work_mode_tells_the_agent_once_which_mode_it_now_works_in(app: App):
    """The mode is the floor of the agent's stack; when the user switches it, the next step says once what the new mode asks."""
    hook(app, "SessionStart")
    app.console().run(["environment", "overview"], AGENT)
    use = lambda name: hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": name})[1].get("hookSpecificOutput", {}).get("additionalContext", "")
    assert "you now work" not in use("a.py"), "nothing is said while the mode stays"
    user_set(app, "workers.mode", "orchestrator")
    switched = use("b.py")
    assert nudge_reached(app, switched, WorkersNudges.ORCHESTRATOR_MODE), "the switch is told at the next step, naming the command that says what the mode asks"
    assert "you now work" not in use("c.py"), "and only once"
    user_set(app, "workers.mode", "solo")
    assert nudge_reached(app, use("d.py"), WorkersNudges.SOLO_MODE)
    user_set(app, "workers.mode", "builder")
    assert nudge_reached(app, use("e.py"), PlansNudges.BUILDER_MODE)


def test_a_number_in_the_agents_message_that_names_a_row_without_its_kind_is_told_once_and_linked_by_one_command(app: App, monkeypatch):
    from journal.features.messages.support import unlinked_row_numbers
    from journal.support.agent_role import AgentRole
    from journal.models.author import Author
    from journal.models.message import Message
    from journal.models.task import Task
    from journal.repositories.messages import Messages
    from journal.repositories.tasks import Tasks
    hook(app, "SessionStart")
    console = app.console()
    console.run(["environment", "overview"], AGENT)
    app.container.get(SupervisorLink).working(MAIN)
    with app.container.get(Scope).environment(MAIN):
        tasks, messages = app.container.get(Tasks), app.container.get(Messages)
        parser, lexer = (tasks.save(Task(environment_id=MAIN, title=title, brief="b"), Actor.system()).id for title in ("the parser", "the lexer"))
    monkeypatch.setattr(unlinked_row_numbers, "LEAST_ROW_NUMBER", 1)
    from journal.features.messages.support.unlinked_row_numbers import UnlinkedRowNumbers
    assert UnlinkedRowNumbers.numbers('my message said "3419" without its kind') == [], "a number quoted on its own is cited, never linked"
    assert UnlinkedRowNumbers.numbers("All 1215 pass, and 3 fail") == [], "a count of tests that pass or fail is a count, never a row"
    assert UnlinkedRowNumbers.numbers("the bar read case 119 as 119 per cent and clamped it to 100; the run was at case 121 when you wrote, test 1324 of 1324") == [], "a case number, a percentage, a position and a count of a total name no row (the code-commandments agent's reply)"
    with app.container.get(Scope).environment(MAIN):
        from journal.support.voice_key import VoiceKey
        said = lambda text: messages.save(Message(environment_id=MAIN, author=Author.AGENT, thread=MessageThread.MAIN, session="s1", text=text, idempotency=VoiceKey.create("turn", "s1", text)), Actor.agent("s1"))
        bare = said(f"Writing {parser} (the parser) and {lexer} (the lexer) together, 1183 passed in 92s")
    app.runtime().deferred.drain()
    line = json.dumps(hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})[1])
    assert f"message {bare.id} has {parser} (task), {lexer} (task) with no row kind" in line and f"journal message amend-links {bare.id} task task" in line, "the numbers that name a row are told, each with its likely kind and the command that links them, and a count is not"
    assert "with no row kind" not in json.dumps(hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "a.py"})[1]), "once for that message"
    assert f"no plan {parser}" in console.run(["message", "amend-links", str(bare.id), "plan", "task"], AGENT).error, "a kind whose row does not exist is refused, and nothing is changed"
    assert "2 numbers lack a kind" in console.run(["message", "amend-links", str(bare.id), "task", "task", "task"], AGENT).error, "a kind for each number, or one for all"
    plain = console.run(["message", "amend-links", str(bare.id), "none", "task"], AGENT)
    assert plain.code == 0 and f"Writing {parser} (the parser) and task {lexer}" in plain.text, f"none leaves a number that names no row as written, and the other is linked: {plain.text}"
    with app.container.get(Scope).environment(MAIN):
        messages.save(messages.find(bare.id).with_(text=f"Writing {parser} (the parser) and {lexer} (the lexer) together, 1183 passed in 92s"), Actor.agent("s1"))
    assert console.run(["message", "amend-links", str(bare.id), "task"], AGENT).code == 0
    app.runtime().deferred.drain()
    hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "c.py"})
    from journal.features.messages.listeners.record_turn import RecordTurn
    from journal.events.agent.turn_displayed import TurnDisplayed
    app.container.get(RecordTurn).handle(TurnDisplayed(agent=agent_row(app), text=f"Writing {parser} (the parser) and {lexer} (the lexer) together, 1183 passed in 92s", turn_id="another-id").placed(agent_row(app, "s1", 1, "claude"), 0.0, 0.0))
    with app.container.get(Scope).environment(MAIN):
        assert len([m for m in messages.scoped() if "(the parser)" in m.text]) == 1, "a linked message keeps the key of the words it was recorded from, so the transcript's old text never records the turn again"
    with app.container.get(Scope).environment(MAIN):
        assert messages.find(bare.id).text == f"Writing task {parser} (the parser) and task {lexer} (the lexer) together, 1183 passed in 92s", "one kind links every number, and the count stays as it was"
        said(f"task {parser} is done")
    app.runtime().deferred.drain()
    assert "with no row kind" not in json.dumps(hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "b.py"})[1]), "a number with its kind before it is told nothing"
    with app.container.get(Scope).environment(MAIN):
        messages.save(Message(environment_id=MAIN, author=Author.AGENT, thread=MessageThread.MAIN, session="s1", text=f"Now checking {lexer} again", data={"kind": Message.THOUGHT}), Actor.agent("s1"))
    app.runtime().deferred.drain()
    assert "with no row kind" not in json.dumps(hook(app, "PreToolUse", tool_name="Read", tool_input={"file_path": "c.py"})[1]), "a thought is a summary of the agent's words, never asked to be linked"


def test_retiring_an_idle_worker_asks_once_whether_it_could_be_reused_and_the_repeat_with_why_goes_through(app: App):
    from journal.models.worker import Worker
    from journal.repositories.workers import Workers
    hook(app, "SessionStart")
    app.console().run(["environment", "overview"], AGENT)
    workers = app.container.get(Workers)
    workers.save(Worker(name="Mr. Idle", state=WorkerState.REPORTED), Actor.system())
    workers.save(Worker(name="Mr. Out", state=WorkerState.DISPATCHED), Actor.system())
    run = lambda line: hook(app, "PreToolUse", tool_name="Bash", tool_input={"command": f"journal worker {line}"})
    for verb in ("complete", "stop"):
        status, body = run(f"{verb} 1")
        assert status != 200 and "if worker 1 can do this" in json.dumps(body) and "--why" in json.dumps(body)
        assert run(f"{verb} 1 --why 'its branch is merged and the work is done'")[0] == 200, "the repeat with its reason pays the question"
    assert run("stop 2")[0] == 200, "a worker out is never asked"


def test_a_task_blocked_on_the_user_with_a_reason_is_named_neither_as_standing_still_nor_at_the_stop(app: App, monkeypatch):
    from journal.repositories.entries import NUDGE, Entries
    console = app.console()
    pinned_clock(app, monkeypatch)
    hook(app, "SessionStart")
    console.run(["environment", "overview"], AGENT)
    for title in ("the colour", "the parser"):
        console.run(["task", "create", title, "--brief", "b"], AGENT)
    assert console.run(["task", "block", "1", "waits for the user's word on the colour"], AGENT).code == 0
    assert console.run(["task", "block", "2", "the schema has to settle"], AGENT).code == 0
    user_set(app, "workers.mode", "orchestrator")
    user_set(app, "tasks.auto", True)
    tick_at(app, 61 * 60, 1.0)
    app.runtime().deferred.drain()
    still = [entry.data["line"] for entry in app.container.get(Entries).all_matching(entry_type=NUDGE) if entry.data.get("key") == "workers.blocked_work_stands_still"]
    assert still == [WorkersNudges.UNMOVED_TASKS.create(tasks=2).rendered()], f"after the interval the task waiting on the user is not named as standing still, the other is: {still}"
    stopped = json.dumps(hook(app, "Stop")[1])
    assert "tasks 2 are blocked" in stopped and "tasks 1" not in stopped and "1, 2" not in stopped, f"the stop names the blocked task a command or a decision of the agent's can move, not the one waiting on the user: {stopped}"


def test_runs_started_together_prune_each_old_output_once_and_every_start_returns_its_row(app: App):
    """Task 4406: two runs starting at once both found the same oldest output past the stored number and both removed its folder, so the second start failed on a folder already gone and left its run with nothing behind it."""
    import threading
    from journal.features.shell.support.output_log import OutputLog
    user_set(app, "shell.outputs_kept", 2)
    log, failures, started = app.container.get(OutputLog), [], []
    caller = Caller.agent("main", "s1", "claude")

    def run(n: int) -> None:
        folder = app.config.root / f"run-{n}"
        folder.mkdir()
        for part in range(40):
            (folder / f"{part}.out").write_text("x")
        with app.container.get(Scope).environment(MAIN):
            try:
                started.append(log.start(f"run-{n}", "true", folder, caller))
            except OSError as error:
                failures.append(error)

    for batch in range(6):
        threads = [threading.Thread(target=run, args=(batch * 8 + n,)) for n in range(8)]
        [thread.start() for thread in threads]
        [thread.join() for thread in threads]
    assert not failures and len(started) == 48, f"every start returns its row though another prunes beside it: {failures[:1]}"


def test_a_running_turn_whose_output_row_is_gone_no_longer_counts_as_running(app: App):
    from journal.features.workers.support.test_turns import TestTurns
    from journal.models.test_turn import TestTurn
    from journal.repositories.test_turns import TestTurns as TurnRows
    with app.container.get(Scope).environment(MAIN):
        rows = app.container.get(TurnRows)
        rows.save(TestTurn(environment_id=1, worker=1, ids="tests/test_a.py", command="pytest tests/test_a.py", folder=".").started(1.0).backgrounded(987654), Actor.system())
        assert app.container.get(TestTurns).running() == [], "an output kept no longer ended long ago, so its turn holds no run"


def test_a_task_a_worker_finished_reads_done_on_its_page_until_the_merge_whatever_the_task_row_still_holds():
    from journal.features.workers.support.worked_task import WorkedTask
    from journal.models.task import Task
    from journal.models.task_state import TaskState
    started, waiting = Task(id=4508, title="a", state=TaskState.STARTED), Task(id=4530, title="b", state=TaskState.OPEN, delegated=True)
    assert [WorkedTask.read(task, [4508, 4530]).state for task in (started, waiting)] == ["done", "done"], "finished and waiting for the merge reads done, a started row or a delegated open one alike"
    assert WorkedTask.read(waiting, []).state == "in hand" and WorkedTask.read(Task(id=1, title="c", state=TaskState.COMPLETED), []).state == "merged"


def test_a_subagent_takes_its_name_from_its_dispatch_and_its_job_from_each_new_message():
    from journal.models.subagent import Subagent
    subagent = Subagent(name=Subagent.dispatch_name("You are Mr. Faraday, an experimenter turned design reviewer. Review doc 1086."), task="Review doc 1086")
    assert (subagent.name, subagent.title_words()) == ("Mr. Faraday", "Mr. Faraday: Review doc 1086"), "the name the law asks for, beside the job"
    resumed = subagent.resumed(2.0, "New job, as Mr. Babbage, an engine designer. Write the modular design.", "Design the journal as an engine")
    assert resumed.title_words() == "Mr. Babbage: Design the journal as an engine", "a new message names the job, and a new name when it gives one"
    assert subagent.resumed(3.0, "Apply the two reviews to doc 1086.", "").title_words() == "Mr. Faraday: Review doc 1086", "a message with no name or summary keeps both"
    assert Subagent(task="map the hooks").title_words() == "map the hooks" and Subagent.dispatch_name("map the hooks") is None, "a dispatch naming no one keeps its job alone"


def test_a_chain_shell_killed_from_outside_stops_its_heartbeat_though_its_pid_was_never_reaped():
    from types import SimpleNamespace
    from journal.features.shell.support.chain_worker import ChainWorker
    running, killed = SimpleNamespace(process=SimpleNamespace(poll=lambda: None)), SimpleNamespace(process=SimpleNamespace(poll=lambda: -15))
    assert ChainWorker.is_shell_running([running]), "a running shell keeps the heartbeat"
    assert not ChainWorker.is_shell_running([running, killed]), "the chain's current shell, killed from another process, is asked of its own process, never of its pid, so the heartbeat stops"
    assert not ChainWorker.is_shell_running([]), "no shell started yet keeps no heartbeat"


def test_a_setting_stored_twice_keeps_only_its_most_recently_changed_row_so_the_switch_turns_off(connection):
    from journal.db.migrations.duplicate_settings_drop import DuplicateSettingsDrop
    connection.execute("INSERT INTO settings (environment_id, key, value, created_at, creator, updated_at) VALUES (0, 'features.faults', 'false', '2026-10-20', 'user', '2026-10-30T17:57:31'), (0, 'features.faults', 'true', '2026-10-29', 'system', '2026-10-29T12:14:00'), (0, 'faults.performance', 'false', '2026-10-30', 'user', '2026-10-30T19:23:43')")
    DuplicateSettingsDrop().apply(connection)
    rows = sorted((row["key"], row["value"]) for row in connection.all("SELECT key, value FROM settings WHERE key IN ('features.faults', 'faults.performance')"))
    assert rows == [("faults.performance", "false"), ("features.faults", "false")], "the switch the user turned off last is the one row left, and a setting stored once stays"


def test_a_plans_cancelled_tasks_leave_its_task_count(app: App):
    from journal.repositories.plans import Plans
    console = app.console()
    hook(app, "SessionStart")
    assert console.run(["plan", "create", "the shop", "--brief", "the shop sells"], AGENT).code == 0
    for title in ("the cart", "the till", "the moving van"):
        assert console.run(["plan", "add", "1", title, "--brief", f"- {title} works"], AGENT).code == 0
    assert console.run(["task", "cancel", "3", "--why", "no van after all"], AGENT).code == 0
    with app.container.get(Scope).environment(MAIN):
        plans = app.container.get(Plans)
        assert plans.uncancelled_count(plans.plan_task_ids(plans.find(1))) == 2, "a cancelled task leaves the count, so a plan with a cancelled phase can still be done"


def test_a_resting_docked_card_older_than_its_chats_first_page_is_taken_down_and_newer_or_running_ones_stay(connection):
    from journal.db.migrations.scrolled_docks_undock import SHOWN_MESSAGE_COUNT, ScrolledDocksUndock
    cards = ('{"docked": true}', '{"docked": true, "active": true}', '{"docked": true, "undock_at": 5}')
    for data in cards:
        connection.execute("INSERT INTO messages (environment_id, author, text, data, created_at) VALUES (1, 'system', 'old card', ?, '2026-10-01')", (data,))
    for _ in range(SHOWN_MESSAGE_COUNT):
        connection.execute("INSERT INTO messages (environment_id, author, text, data, created_at) VALUES (1, 'agent', 'words', '{}', '2026-10-30')")
    connection.execute("INSERT INTO messages (environment_id, author, text, data, created_at) VALUES (1, 'system', 'new card', '{\"docked\": true}', '2026-10-31')")
    ScrolledDocksUndock().apply(connection)
    docked = [row["id"] for row in connection.all("SELECT id FROM messages WHERE json_extract(data, '$.docked') = 1 ORDER BY id")]
    assert docked == [2, 3, SHOWN_MESSAGE_COUNT + 4], "the old resting card goes; the running one, the leaving one and the card on the first page stay"
