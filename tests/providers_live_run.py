# Starts the installed Claude Code and Codex, which must be signed in, and reaches the network, so it is not in the default run: python3 -m pytest -q tests/providers_live_run.py
"""Each provider's real program in a scratch journal, run headless with the launcher's own environment and launch file: its hooks reach the journal, a held call has no side effect, a refused stop leads to work, a worker and a subagent report, and a resumed session remembers. A case whose trial the model declined, or whose program cannot fire the journal's hooks here, is skipped as inconclusive, never passed. LIVE_CLAUDE_CONFIG_DIR and LIVE_CODEX_HOME name a test sign-in's config folder; unset, the user's own is used."""

import json
import os
import subprocess
import time
from pathlib import Path

import pytest

from worker_dispatch import dispatched

from journal.features.workers.support.worker_reports import REPORTED
from journal.repositories.links import Links
from journal.app import App
from journal.config import Config
from journal.launcher.launch import Launch
from journal.support.choice import Choice
from journal.providers.support.status_line import StatusLine
from journal.models.setting import Setting
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.providers.providers import Providers
from journal.providers.support.hooks_ready import HooksReady
from journal.repositories.agents import Agents
from journal.repositories.entries import Entries
from journal.repositories.setting_rows import SettingRows
from journal.repositories.tasks import Tasks
from journal.repositories.workers import Workers
from journal.features.workers.support.worker_reports import WorkerReports
from journal.support.actor import Actor
from journal.support.caller import Caller
from journal.repositories.scope import Scope

SRC = Path(__file__).resolve().parent.parent / "src"
PROVIDERS = ("claude", "codex")
MAIN = 1
START_SECONDS, TOOL_SECONDS, WORKER_SECONDS, CASE_SECONDS = 60, 90, 180, 300
CHEAP_MODEL = {"claude": "haiku", "codex": ""}
CONFIG_FOLDER = {"claude": ("CLAUDE_CONFIG_DIR", "LIVE_CLAUDE_CONFIG_DIR"), "codex": ("CODEX_HOME", "LIVE_CODEX_HOME")}
JOURNAL_VARIABLES = ("AGENT_JOURNAL_ACTIVE", "JOURNAL_ROOT", "JOURNAL_ENV", "JOURNAL_SESSION", "JOURNAL_ACTOR", "JOURNAL_AGENT_SHELL", "JOURNAL_LAUNCH")


@pytest.fixture(params=PROVIDERS)
def provider(request) -> str:
    return request.param


@pytest.fixture
def live(tmp_path: Path, monkeypatch, provider: str):
    """A fresh git project with the source under test installed, its own server on a free port, the hooks wired for the provider, and none of the caller's provider or journal variables."""
    for name in (*Providers().inherited_markers(), *JOURNAL_VARIABLES):
        monkeypatch.delenv(name, raising=False)
    variable, chosen = CONFIG_FOLDER[provider]
    if os.environ.get(chosen):
        monkeypatch.setenv(variable, os.environ[chosen])
    subprocess.run(["git", "init", "-q"], cwd=tmp_path, check=True, timeout=10)
    (tmp_path / ".journal").mkdir()
    (tmp_path / ".journal" / "src").symlink_to(SRC)
    app = App(Config(tmp_path, port=0))
    app.runtime().start()
    port = app.server().port
    assert port > 20000 and not 8420 <= port <= 8429, f"the scratch server took {port}"
    (tmp_path / ".journal" / "port").write_text(str(port))
    app.console().run(["setup"], Caller.user("main"))
    try:
        yield app
    finally:
        app.runtime().stop()


def launched(app: App, provider: str) -> dict[str, str]:
    """The environment and launch file the launcher gives the agent of main, the file written where the engine reads it."""
    launch = Launch.parse([provider], app.config.root)
    choice = Choice("main")
    path = app.config.root / ".journal" / "runtime" / "launches" / "main.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    written = launch.launch_file(choice, StatusLine(app.config.root))
    path.write_text(json.dumps(written))
    return written["front"]["env"]


def run_agent(app: App, provider: str, prompt: str, resume: str = "", seconds: int = CASE_SECONDS) -> subprocess.CompletedProcess:
    """The program headless on one prompt, as the launched agent of main: its hooks post to the scratch server."""
    if Providers().lookup(provider).hooks_ready(app.config.root) != HooksReady.READY:
        pytest.skip(f"{provider}'s hooks are not trusted in this config folder, so no hook would reach the journal: inconclusive")
    command = Providers().lookup(provider).worker_command(prompt, CHEAP_MODEL[provider], resume, resume)
    return subprocess.run(command, cwd=app.config.root, env=launched(app, provider), stdin=subprocess.DEVNULL, capture_output=True, text=True, timeout=seconds)


def entries(app: App, kind: str) -> list:
    with app.container.get(Scope).environment(MAIN):
        return list(reversed(app.container.get(Entries).kind_entries(kind, 500)))


def wait_for(check, seconds: int):
    deadline = time.time() + seconds
    while time.time() < deadline:
        if found := check():
            return found
        time.sleep(0.5)
    return check()


def session_of(app: App) -> str:
    started = wait_for(lambda: entries(app, "SessionStarted"), START_SECONDS)
    assert started, "no SessionStart reached the journal from the real launch"
    return started[-1].data["session_id"]


def refused(app: App) -> list:
    return [entry for entry in entries(app, "ToolStarting") if entry.data.get("refused")]


def test_untrusted_hooks_are_reported_not_ready_and_claim_no_hold(tmp_path: Path, monkeypatch, provider: str):
    """Codex with its trust withheld in a fresh config folder, Claude Code with the project's settings left out: hooks_ready says so for Codex, and the journal records no hold for either."""
    for name in (*Providers().inherited_markers(), *JOURNAL_VARIABLES):
        monkeypatch.delenv(name, raising=False)
    subprocess.run(["git", "init", "-q"], cwd=tmp_path, check=True, timeout=10)
    (tmp_path / ".journal").mkdir()
    (tmp_path / ".journal" / "src").symlink_to(SRC)
    app = App(Config(tmp_path, port=0))
    app.runtime().start()
    try:
        (tmp_path / ".journal" / "port").write_text(str(app.server().port))
        app.console().run(["setup"], Caller.user("main"))
        program = Providers().lookup(provider)
        if provider == "codex":
            monkeypatch.setenv("CODEX_HOME", str(tmp_path / "untrusted"))
            assert program.hooks_ready(tmp_path) == HooksReady.UNTRUSTED
        withheld = ["--setting-sources", "user"] if provider == "claude" else []
        command = [*program.worker_command("Write the word one into first.txt.", CHEAP_MODEL[provider], "", ""), *withheld]
        subprocess.run(command, cwd=tmp_path, env=launched(app, provider), stdin=subprocess.DEVNULL, capture_output=True, text=True, timeout=CASE_SECONDS)
        assert not refused(app), "no hold is claimed by hooks that did not run"
    finally:
        app.runtime().stop()


def test_a_launched_agent_starts_bound_to_its_environment(live: App, provider: str):
    run_agent(live, provider, "Run exactly this shell command once and then stop: journal task create \"bound here\"")
    session = session_of(live)
    with live.container.get(Scope).environment(MAIN):
        made = [task for task in live.container.get(Tasks).all() if task.title == "bound here"]
    if not made:
        pytest.skip(f"the agent did not run the command: inconclusive\n{entries(live, 'ToolStarting')}")
    assert made[0].creator == Actor.agent(session), "the agent's own journal command is its session's"
    assert not entries(live, "unbound_session"), "the session carried its launch id back"
    assert {agent.environment_id for agent in live.container.get(Agents).all_agents()} == {MAIN}, "nothing lands in another environment"


def test_a_session_with_another_launch_id_is_reported_and_not_bound(live: App, provider: str):
    command = Providers().lookup(provider).worker_command("Reply with ok.", CHEAP_MODEL[provider], "", "")
    subprocess.run(command, cwd=live.config.root, env={**launched(live, provider), "JOURNAL_LAUNCH": "another"}, stdin=subprocess.DEVNULL, capture_output=True, text=True, timeout=CASE_SECONDS)
    assert wait_for(lambda: entries(live, "unbound_session"), START_SECONDS), "its hooks were recorded and reported"
    assert not live.container.get(Agents).all_agents(), "and it was not taken as the environment's agent"


def test_the_first_write_is_held_until_the_skill_is_read(live: App, provider: str):
    run_agent(live, provider, "Write the word one into a new file first.txt. If the journal refuses, do what it asks and then write the file.")
    held = [entry for entry in refused(live) if "first.txt" in json.dumps(entry.data.get("tool_input", {}))]
    if not held:
        pytest.skip("no write to first.txt was tried before the skill was read: inconclusive")
    finished = {entry.data.get("tool_use_id") for entry in entries(live, "ToolFinished")}
    assert held[0].data.get("tool_use_id") not in finished, "the held write never ran"
    assert (live.config.root / "first.txt").is_file(), "after the skill is read and the look taken, the write lands"


def test_a_held_shell_command_never_runs(live: App, provider: str):
    run_agent(live, provider, "Run exactly this shell command once: printf x > sentinel.txt\nIf it is refused, do not retry it in any other way; stop.")
    held = [entry for entry in refused(live) if "sentinel.txt" in json.dumps(entry.data.get("tool_input", {}))]
    if not held:
        pytest.skip("the agent never tried the command: inconclusive")
    assert not (live.config.root / "sentinel.txt").exists(), "a refused command left no side effect"
    assert "sentinel.txt" in json.dumps(held[0].data.get("tool_input", {})) and held[0].data["refused"], "the refusal names that call"


def test_a_refused_stop_leads_to_work(live: App, provider: str):
    with live.container.get(Scope).environment(MAIN):
        task = live.container.get(Tasks).save(Task(environment_id=MAIN, title="Write the word amber in continued.txt, then finish this task"), Actor.system())
    run_agent(live, provider, "Give a short status and stop.")
    stops = [entry for entry in entries(live, "Stop") if entry.data.get("refused")]
    if not stops:
        pytest.skip("no stop was refused: inconclusive")
    assert (live.config.root / "continued.txt").read_text().strip() == "amber", "the refusal led to the work the task names"
    with live.container.get(Scope).environment(MAIN):
        done = live.container.get(Tasks).find(task.id)
    assert done.state == TaskState.FINISHED and done.updater.kind == "agent", "the agent finished the task itself"
    assert not entries(live, "Stop")[-1].data.get("refused"), "the next stop was let through"


def test_a_worker_reports_and_resumes_with_its_memory(live: App, provider: str):
    launched(live, provider)
    console, workers, reports = live.console(), live.container.get(Workers), live.container.get(WorkerReports)
    subprocess.run(["git", "-c", "user.name=Test", "-c", "user.email=test@example.com", "commit", "-q", "--allow-empty", "-m", "first"], cwd=live.config.root, check=True, timeout=10)
    sent = dispatched(console, ["Lady Lovelace", "Say the word amber and nothing else.", "--provider", provider, "--profile", "journal-medior", "--worktree", "--no-libraries"], Caller.user("main"))
    assert sent.code == 0, sent.error
    with live.container.get(Scope).environment(MAIN):
        first = wait_for(lambda: [(worker, report) for worker in workers.all() if (report := reports.last(worker))], WORKER_SECONDS)
    assert first and "amber" in first[0][1].lower() and first[0][0].session, "the worker's session is read from its output and its report filed"
    worker = first[0][0]
    assert any(entry.data.get("session_id") == worker.session for entry in entries(live, "SessionStarted")), "the worker's own hooks reached the journal from its folder"
    assert all(entry.actor != Actor.agent(worker.session) for entry in entries(live, "ToolStarting")), "the worker's commands are its own, not its parent's"
    console.run(["worker", "send", str(worker.id), "What word did you say last time? Answer with that word only."], Caller.user("main"))
    with live.container.get(Scope).environment(MAIN):
        second = wait_for(lambda: len(live.container.get(Links).targets(workers.find(worker.id), REPORTED)) > 1 and reports.last(workers.find(worker.id)), WORKER_SECONDS)
    assert second and "amber" in second.lower(), "a second job resumes the worker and it recalls the word"


def test_a_subagent_is_marked_and_settled(live: App, provider: str):
    live.container.get(SettingRows).save(Setting(environment_id=0, key="workers.most_subagents", value=1), Actor.system())
    run_agent(live, provider, "Read the journal skill if asked. Then dispatch two of your own subagents at once, each told: reply with the word amber. Report what they said.")
    started, ended = entries(live, "SubagentStarted"), entries(live, "SubagentEnded")
    if not started:
        pytest.skip("no subagent was dispatched: inconclusive")
    assert {entry.data.get("agent_id") for entry in started} <= {entry.data.get("agent_id") for entry in ended}, "every subagent marked when dispatched is settled when done"
    assert refused(live), "the one past the limit of one was refused"


def test_a_restarted_agent_resumes_its_conversation(live: App, provider: str):
    run_agent(live, provider, "Remember the word amber. Reply with ok.")
    session = session_of(live)
    program = Providers().lookup(provider)
    answer = run_agent(live, provider, "What word did I ask you to remember? Answer with the word only.", resume=session)
    ended = program.worker_outcome(answer.stdout, answer.stderr)
    assert "amber" in ended.report.lower() and not ended.error, f"the resumed session recalls the word: {ended}"
    assert ended.session in ("", session), "the resume came back on the same session"
