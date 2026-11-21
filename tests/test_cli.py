"""Phase two: journal task create, start, log, done and list run against a real .journal/journal.db through the console, from the terminal and through the server."""

from pathlib import Path

import pytest

from worker_dispatch import dispatched

from tests.suite_app import SuiteApp
from journal.app import App
from journal.repositories.scope import Scope
from journal.config import Config
from journal.support.caller import Caller
from journal.providers.providers import Providers
from journal.support.actor import Actor
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.task_logs import TaskLogs
from journal.repositories.tasks import Tasks


MAIN = Caller.user("main")


@pytest.fixture
def app(journal_root: Path) -> App:
    return SuiteApp(Config(journal_root, port=0))




def test_the_server_runs_the_same_console_for_the_shim(app: App):
    import json
    from urllib.request import Request as HttpRequest, urlopen
    server = app.server()
    server.start()
    try:
        body = json.dumps({"argv": ["task", "create", "over http"], "env": "main", "session": "s-9"}).encode()
        with urlopen(HttpRequest(f"http://127.0.0.1:{server.port}/cli", data=body, method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5) as reply:
            outcome = json.loads(reply.read())
    finally:
        server.stop()
    assert outcome["code"] == 0 and "task 1 open" in outcome["text"]
    assert app.container.get(Tasks).find(1).creator == Actor.agent("s-9")




def test_a_shell_marked_by_an_agent_program_names_the_agent_and_its_session_when_the_program_gives_one():
    assert Providers().caller({"JOURNAL_AGENT_SHELL": "1"}).is_unnamed_agent(), "a worker's shell is an agent's whatever its program marks"
    named = Providers().caller({"CLAUDECODE": "1", "CLAUDE_CODE_SESSION_ID": "abc"})
    assert named.session == "abc" and named.provider == "claude", "a Claude Code shell names its own session, so its lines and outputs are its agent's"
    assert Providers().caller({"JOURNAL_SESSION": "worker-session", "CODEX_THREAD_ID": "parent-session"}).session == "worker-session", "a session the journal names wins over the one the program marks"


def test_a_shells_variables_name_its_caller_by_kind_with_the_provider_that_marks_it():
    from journal.support.caller_variables import CallerVariables
    providers = Providers()
    assert providers.caller({"JOURNAL_PLUGIN": ""}) == Caller.user("main") and Caller.user("main").actor == Actor.user(1), "a shell nothing marks is the user's, and a variable set empty is no plugin"
    assert providers.caller({"CODEX_THREAD_ID": "t1", "CODEX_CI": "1"}) == Caller.agent("main", "t1", "codex"), "an agent knows its own provider from the markers its shell carries"
    assert providers.caller({"CLAUDECODE": "1"}) == Caller.shell("main", "claude"), "a Claude shell names no session, only its provider"
    assert providers.caller({"JOURNAL_PLUGIN": "echo", "JOURNAL_PLUGIN_TOKEN": "x"}) == Caller.plugin("main", "echo")
    assert providers.caller({"JOURNAL_ACTOR": "worker:3", "JOURNAL_AGENT_SHELL": "1", "CLAUDECODE": "1"}) == Caller.worker("main", 3, None, "claude")
    assert providers.caller({"JOURNAL_ACTOR": "verifier:4", "JOURNAL_AGENT_SHELL": "1", "CLAUDECODE": "1"}) == Caller.verifier("main", 4, None, "claude"), "one actor variable names a worker or a verifier by its stamp"
    variables = providers.caller_variables({"JOURNAL_ENV": "development", "CODEX_THREAD_ID": "t1", "JOURNAL_LAUNCH": "l1"})
    assert CallerVariables.parsed(variables.body(), "claude") == variables, "what the shim posts reads back as the variables it posted"


def test_a_workers_shim_never_runs_the_package_when_no_server_answers(app: App):
    import os
    import subprocess
    environ = {key: value for key, value in os.environ.items() if key != "JOURNAL_SESSION"}
    environ.update(JOURNAL_ROOT=str(app.config.root), JOURNAL_ENV="main", JOURNAL_ACTOR="worker:1", JOURNAL_ACTOR_TOKEN="tok")
    (app.config.home / "port").unlink(missing_ok=True)
    outcome = subprocess.run(["sh", str(Path(__file__).resolve().parents[1] / "src" / "journal.sh"), "task", "list"], env=environ, capture_output=True, text=True, timeout=10)
    assert outcome.returncode == 1 and "restarting" in outcome.stderr, "a worker's command waits for the server that can check its token"


@pytest.mark.parametrize("online", [False, True])
def test_the_shim_attributes_a_codex_command_with_and_without_a_server(app: App, online):
    import os
    import subprocess
    from journal.models.agent import Agent
    from journal.providers.claude import Claude
    from journal.repositories.agents import Agents
    from journal.repositories.environments import Environments
    agents = app.container.get(Agents)
    development = app.container.get(Environments).lookup("development")
    with app.container.get(Scope).environment(development.id):
        agents.save(Agent(session="codex-session", environment_id=development.id, provider="codex", is_overview_read=False), Actor.system())
    environ = {key: value for key, value in os.environ.items() if key not in ("JOURNAL_SESSION", "CODEX_SANDBOX", *Claude.inherited_markers)}
    environ.update(JOURNAL_ROOT=str(app.config.root), JOURNAL_ENV="development", JOURNAL_PORT="0", CODEX_THREAD_ID="codex-session", CODEX_CI="1")
    server = app.server()
    if online:
        server.start()
    try:
        outcome = subprocess.run(["sh", str(Path(__file__).resolve().parents[1] / "src" / "journal.sh"), "environment", "overview"], env=environ, capture_output=True, text=True, timeout=10)
        assert outcome.returncode == 0, outcome.stderr
        with app.container.get(Scope).environment(development.id):
            assert agents.session_agent("codex-session").is_overview_read
    finally:
        server.stop()


def test_the_boot_menu_is_offered_only_a_session_whose_conversation_still_exists(app: App, monkeypatch, tmp_path):
    from journal.support.actor import Actor
    from journal.models.agent import Agent
    from journal.providers.claude import Claude
    from journal.repositories.agents import Agents
    stored = tmp_path / "s1.jsonl"
    stored.write_text("{}\n")
    monkeypatch.setattr(Claude, "transcript", lambda self, project, session: stored if session == "s1" else None)
    agents = app.container.get(Agents)
    agents.save(Agent(session="s1", environment_id=1, provider="claude"), Actor.system())
    agents.save(Agent(session="lost", environment_id=1, provider="claude", state="ended"), Actor.system())
    from journal.console.commands.environment_command import EnvironmentCommand
    rows = app.container.get(EnvironmentCommand).rows()
    assert rows[0].last_sessions == {"claude": "s1"}, "a codex launch finds no Claude session to carry on"


def test_the_launchers_environments_come_newest_used_first(tmp_path: Path):
    import json as j
    from journal.config import Config
    from journal.support.caller import Caller
    from tests.main_journal import main_journal
    from tests.test_features import posted
    app = main_journal(Config(tmp_path, port=0))
    app.runtime().start()
    user = Caller.user("main")
    try:
        for name in ("second", "third"):
            app.console().run(["environment", "create", name], user)
        for environment, session in (("third", "third-session"), ("main", "main-session"), ("second", "second-session")):
            posted(app, "/hooks/claude", {"hook_event_name": "SessionStart", "session_id": session}, {"X-Journal-Env": environment, "X-Journal-Launch": f"launch-{environment}"})
            app.runtime().deferred.drain()
        rows = j.loads(app.console().run(["environment", "json"], user).text)
        assert [row["name"] for row in rows] == ["second", "main", "third"], "the environment used last is offered first"
    finally:
        app.runtime().stop()


def test_the_boot_menu_never_carries_on_from_a_workers_conversation(app: App, monkeypatch, tmp_path):
    from journal.support.actor import Actor
    from journal.models.agent import Agent
    from journal.support.agent_role import AgentRole
    from journal.providers.claude import Claude
    from journal.repositories.agents import Agents
    stored = tmp_path / "kept.jsonl"
    stored.write_text("{}\n")
    monkeypatch.setattr(Claude, "transcript", lambda self, project, session: stored)
    agents = app.container.get(Agents)
    agents.save(Agent(session="main-session", environment_id=1, provider="claude", state="ended"), Actor.system())
    agents.save(Agent(session="worker-session", environment_id=1, provider="claude", role=AgentRole.WORKER), Actor.system())
    from journal.console.commands.environment_command import EnvironmentCommand
    rows = app.container.get(EnvironmentCommand).rows()
    assert rows[0].last_sessions == {"claude": "main-session"}, "the newest conversation is a worker's: the main agent carries on from its own"
    assert not rows[0].working, "a worker at work is not the environment's agent working"






def test_a_workers_environment_carries_no_providers_markers_no_session_and_no_launch(app: App, monkeypatch):
    from journal.providers.support.helper_setup import HelperSetup
    parents = {*Providers().inherited_markers(), *Providers().session_variables(), "JOURNAL_LAUNCH", "JOURNAL_SESSION"}
    for name in parents:
        monkeypatch.setenv(name, "parent")
    from journal.support.agent_token import AgentToken
    handed = app.container.get(HelperSetup).variables("main", Actor.worker(7), AgentToken("tok"))
    assert not parents & set(handed), "a worker carries none of the parent's thread, and never its session, which its report would take as its own"
    assert (handed["JOURNAL_ACTOR"], handed["JOURNAL_ACTOR_TOKEN"], handed["JOURNAL_ENV"]) == ("worker:7", "tok", "main")
    assert app.container.get(HelperSetup).variables("main", Actor.verifier(3), AgentToken("tok"))["JOURNAL_ACTOR"] == "verifier:3", "a verifier's shell names it as a verifier, never a worker"


def test_a_worktree_launch_takes_name_2_beside_a_live_session_and_reuses_a_crashed_ones_name(app: App, monkeypatch):
    import json
    import os
    import subprocess
    from journal.launcher.launch import Launch
    from journal.launcher.menu import Menu
    from journal.models.agent import Agent
    from journal.providers.support.status_line import StatusLine
    from journal.repositories.agents import Agents
    from journal.repositories.environments import Environments
    root = app.config.root
    for argv in (["init", "-q", "-b", "main"], ["-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "start"]):
        subprocess.run(["git", *argv], cwd=root, capture_output=True, timeout=30)
    monkeypatch.setattr(Menu, "journal", lambda self, *argv: app.console().run(list(argv), Caller.user("main")).text)
    gone = subprocess.Popen(["true"])
    gone.wait(10)
    launches = app.config.home / "runtime" / "launches"
    launches.mkdir(parents=True, exist_ok=True)
    for name, owner in (("alpha", os.getpid()), ("beta", gone.pid)):
        app.console().run(["environment", "create", name], Caller.user("main"))
        environment = app.container.get(Environments).existing(name)
        app.container.get(Agents).save(Agent(environment_id=environment.row_id, session=f"s-{name}", provider="claude", state="idle"), Actor.system())
        (launches / f"{name}.json").write_text(json.dumps({"launch": f"launch-{name}", "owner": owner}))
    live = Launch.parse(["claude", "--worktree", "alpha"], root)
    choice = live.choice()
    folder = live.chosen(choice).launch_file(choice, StatusLine(root))["front"]["folder"]
    assert choice.environment == "alpha-2" and folder == str(root / ".claude" / "worktrees" / "alpha-2"), "a live session holds alpha, so the launch takes alpha-2 with a worktree of its own"
    crashed = Launch.parse(["claude", "--worktree", "beta"], root)
    assert crashed.choice().environment == "beta", "a crashed session, its launcher gone, holds nothing, so its name is taken again"


def test_every_worktree_failure_at_launch_is_one_plain_line_naming_its_cause_and_what_to_do(app: App, monkeypatch, capsys, tmp_path):
    import os
    import subprocess
    from journal.launcher.launch import Launch
    from journal.launcher.menu import Menu
    from journal.support.worktree import Worktree
    from journal.support.worktree_failure import WorktreeFailure
    root = app.config.root
    git = lambda *argv, cwd=root: subprocess.run(["git", *argv], cwd=cwd, capture_output=True, text=True, timeout=30)
    monkeypatch.setattr(Menu, "journal", lambda self, *argv: app.console().run(list(argv), Caller.user("main")).text)

    def launched(name: str) -> str:
        code = Launch.parse(["claude", "--worktree", name], root).run()
        error = capsys.readouterr().err.strip()
        assert code == 1 and len(error.splitlines()) == 1 and "Traceback" not in error, error
        return error

    assert "is neither a git repository nor a folder holding git repositories" in launched("no-git") and "git init" in launched("no-git"), "a folder with no git says so, and what to do"
    git("init", "-q", "-b", "main")
    assert "has no commit yet" in launched("no-commit"), "a repository with no commit says so"
    git("-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "start")
    git("checkout", "-q", "-b", "worktree-taken")
    assert "is checked out in another folder" in launched("taken"), "a branch checked out elsewhere says so, and what to do"
    git("checkout", "-q", "main")
    stand_ins = tmp_path / "slow-git"
    stand_ins.mkdir()
    (stand_ins / "git").write_text("#!/bin/sh\nexec sleep 5\n")
    (stand_ins / "git").chmod(0o755)
    monkeypatch.setenv("PATH", f"{stand_ins}:{os.environ['PATH']}")
    try:
        Worktree(root, "slow", git_seconds=0.5).created()
        raise AssertionError("a git that never answers fails the launch")
    except WorktreeFailure as failed:
        assert "git gave no answer within 0.5 seconds" in str(failed) and len(str(failed).splitlines()) == 1, "and a git that hangs is cut off with one line"


def test_a_worktree_reads_the_journals_hooks_through_one_link_and_its_git_status_stays_clean(app: App, monkeypatch):
    import json
    import subprocess
    from journal.launcher.launch import Launch
    from journal.launcher.menu import Menu
    from journal.providers.support.status_line import StatusLine
    from journal.support.choice import Choice
    root = app.config.root
    git = lambda *argv, cwd=root: subprocess.run(["git", *argv], cwd=cwd, capture_output=True, text=True, timeout=30)
    (root / ".claude").mkdir(exist_ok=True)
    tracked = root / ".claude" / "settings.json"
    tracked.write_text('{"permissions": {}}\n')
    for argv in (["init", "-q", "-b", "main"], ["add", ".claude/settings.json"], ["-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "-m", "start"]):
        git(*argv)
    monkeypatch.setattr(Menu, "journal", lambda self, *argv: app.console().run(list(argv), Caller.user("main")).text)
    main_settings = tracked.read_text()
    folder = Path(Launch.parse(["claude", "--worktree", "calm-river"], root).launch_file(Choice("calm-river"), StatusLine(root))["front"]["folder"])
    local = folder / ".claude" / "settings.local.json"
    written = json.loads(local.read_text())
    assert local.is_symlink() and local.resolve() == (app.config.home / "runtime" / "worktree-settings" / "claude.json").resolve(), "the worktree reads the journal's hooks through a link to one file the main checkout's journal writes"
    assert str(root) in json.dumps(written["hooks"]) and written["statusLine"]["command"], "naming the main root, with the status line"
    assert git("status", "--porcelain", cwd=folder).stdout == "", "the worktree's git status stays clean"
    assert tracked.read_text() == main_settings and (folder / ".claude" / "settings.json").read_text() == main_settings, "and no settings file of the project is written, in the worktree or in the main checkout"


def test_a_launch_marks_a_new_worktree_trusted_in_claude_codes_state_and_never_the_persons_own(app: App, monkeypatch, tmp_path):
    import json
    import os
    import subprocess
    from journal.launcher.launch import Launch
    from journal.launcher.menu import Menu
    from journal.providers.support.status_line import StatusLine
    from journal.support.choice import Choice
    real = Path.home() / ".claude.json"
    real_time = real.stat().st_mtime_ns if real.exists() else 0
    root = app.config.root
    for argv in (["init", "-q", "-b", "main"], ["-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "start"]):
        subprocess.run(["git", *argv], cwd=root, capture_output=True, timeout=30)
    monkeypatch.setattr(Menu, "journal", lambda self, *argv: app.console().run(list(argv), Caller.user("main")).text)
    state = Path(os.environ["CLAUDE_CONFIG_DIR"]) / ".claude.json"
    state.write_text(json.dumps({"projects": {str(root): {"hasTrustDialogAccepted": True, "allowedTools": ["Bash"]}}}))
    folder = Launch.parse(["claude", "--worktree", "calm-river"], root).launch_file(Choice("calm-river"), StatusLine(root))["front"]["folder"]
    projects = json.loads(state.read_text())["projects"]
    assert projects[folder]["hasTrustDialogAccepted"] and projects[str(root)]["allowedTools"] == ["Bash"], "the new worktree is marked trusted in Claude Code's state, the rest of it kept"
    assert (real.stat().st_mtime_ns if real.exists() else 0) == real_time, "and the person's own state file is never touched by a test"


def test_codex_in_a_new_worktree_runs_the_main_checkouts_hooks_trusted_without_a_new_trust_step(app: App, monkeypatch, tmp_path):
    import json
    import subprocess
    import tomllib
    from journal.launcher.launch import Launch
    from journal.launcher.menu import Menu
    from journal.providers.codex import Codex
    from journal.providers.support.status_line import StatusLine
    from journal.support.choice import Choice
    root = app.config.root
    for argv in (["init", "-q", "-b", "main"], ["-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "start"]):
        subprocess.run(["git", *argv], cwd=root, capture_output=True, timeout=30)
    monkeypatch.setattr(Menu, "journal", lambda self, *argv: app.console().run(list(argv), Caller.user("main")).text)
    home = tmp_path / "codex-home"
    home.mkdir()
    monkeypatch.setenv("CODEX_HOME", str(home))
    main_hooks = root.resolve() / ".codex" / "hooks.json"
    (home / "config.toml").write_text("".join(f'[hooks.state."{main_hooks}:{type_name}:0:0"]\ntrusted_hash = "x"\n\n' for type_name in ("session_start", "stop")))
    folder = Path(Launch.parse(["codex", "--worktree", "calm-river"], root).launch_file(Choice("calm-river"), StatusLine(root))["front"]["folder"])
    hooks = folder / ".codex" / "hooks.json"
    assert hooks.is_symlink() and hooks.resolve() == main_hooks and str(root) in hooks.read_text(), "the worktree reads the main checkout's hooks, naming the main root"
    assert Codex.trusted_kinds(folder.resolve() / ".codex" / "hooks.json") == {"session_start", "stop"}, "and Codex trusts them at the worktree's path as it trusts them in the main checkout"
    assert tomllib.loads((home / "config.toml").read_text())["hooks"]["state"][f"{main_hooks}:stop:0:0"]["trusted_hash"] == "x", "the main checkout's trust kept"


def test_two_worktree_launches_run_side_by_side_each_with_its_own_environment_and_agent(app: App, monkeypatch):
    import json
    import subprocess
    from urllib.request import Request as HttpRequest, urlopen
    from journal.launcher.launch import Launch
    from journal.launcher.menu import Menu
    from journal.providers.support.status_line import StatusLine
    from journal.repositories.agents import Agents
    from journal.repositories.environments import Environments
    root = app.config.root
    for argv in (["init", "-q", "-b", "main"], ["-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "start"]):
        subprocess.run(["git", *argv], cwd=root, capture_output=True, timeout=30)
    monkeypatch.setattr(Menu, "journal", lambda self, *argv: app.console().run(list(argv), Caller.user("main")).text)
    launches = app.config.home / "runtime" / "launches"
    launches.mkdir(parents=True, exist_ok=True)
    folders = {}
    for name in ("alpha", "beta"):
        launch = Launch.parse(["claude", "--worktree", name], root)
        choice = launch.choice()
        written = launch.launch_file(choice, StatusLine(root))
        assert choice.environment == name, "a worktree launch works the environment named after it"
        folders[name] = written["front"]["folder"]
        (launches / f"{name}.json").write_text(json.dumps({"launch": written["launch"]}))
    assert folders == {name: str(root / ".claude" / "worktrees" / name) for name in ("alpha", "beta")} and all(Path(folder).is_dir() for folder in folders.values()), "each runs in a worktree of its own"
    import re
    bare = Launch.parse(["claude", "--worktree"], root).choice().environment
    assert re.fullmatch(r"[a-z]+-[a-z]+", bare) and bare not in ("alpha", "beta"), "a bare --worktree's made-up name is the environment the menu starts"
    app.runtime().start()
    try:
        for name in ("alpha", "beta"):
            launch_id = json.loads((launches / f"{name}.json").read_text())["launch"]
            body = json.dumps({"hook_event_name": "SessionStart", "session_id": f"s-{name}", "source": "startup"}).encode()
            urlopen(HttpRequest(f"http://127.0.0.1:{app.server().port}/hooks/claude", data=body, method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": name, "X-Journal-Launch": launch_id}), timeout=5).read()
        agents, environments = app.container.get(Agents), app.container.get(Environments)
        alpha, beta = agents.session_agent("s-alpha"), agents.session_agent("s-beta")
        assert alpha.environment_id == environments.lookup("alpha").row_id and beta.environment_id == environments.lookup("beta").row_id, "each launch's agent is its own environment's"
        assert alpha.state != "ended" and beta.state != "ended", "and the second never ends the first"
    finally:
        app.runtime().stop()










def test_a_command_the_server_fails_on_prints_the_fault_and_exits_non_zero(app: App, tmp_path):
    import os
    import subprocess
    from journal.providers.claude import Claude
    environ = {key: value for key, value in os.environ.items() if key not in ("JOURNAL_SESSION", "CODEX_SANDBOX", *Claude.inherited_markers)}
    environ.update(JOURNAL_ROOT=str(app.config.root), JOURNAL_ENV="main", JOURNAL_PORT="0")
    server = app.server()
    server.start()
    try:
        missing = tmp_path / "gone.md"
        outcome = subprocess.run(["sh", str(Path(__file__).resolve().parents[1] / "src" / "journal.sh"), "doc", "create", "Notes", "--abstract", "The notes", "--file", str(missing)], env=environ, capture_output=True, text=True, timeout=10)
        assert outcome.returncode == 1 and "gone.md" in outcome.stderr, "a fault is printed with what it names, never a silent success"
    finally:
        server.stop()


def test_remote_github_init_writes_the_server_workflow_once_and_says_how_to_register_the_runner(tmp_path, capsys):
    from journal.launcher.remote_github import RUNNER_LABEL, WORKFLOW, RemoteGithub
    from journal.version import VERSION
    root = tmp_path / "shop"
    root.mkdir()
    assert RemoteGithub.parsed(["init"], root).run() == 0
    workflow = (root / WORKFLOW).read_text()
    assert f"runs-on: [self-hosted, {RUNNER_LABEL}]" in workflow and "workflow_dispatch:" in workflow
    assert 'default: "shop"' in workflow and f'default: "{VERSION}"' in workflow
    assert "TEAM_PROJECT: ${{ inputs.project }}" in workflow and "TEAM_ADDRESS: ${{ inputs.address }}" in workflow
    assert 'curl -fsSL "https://github.com/jessegall/agent-journal/releases/download/v${TEAM_VERSION}/install.sh" | sh' in workflow
    told = capsys.readouterr().out
    assert "--labels agent-journal" in told and "journal team connect <url>" in told
    assert RemoteGithub.parsed(["init"], root).run() == 1, "a workflow already there is not written over"
    assert RemoteGithub.parsed(["init", "--replace"], root).run() == 0


def test_a_team_url_is_its_address_or_an_invitation():
    from journal.sync.team_url import TeamUrl
    assert TeamUrl.parse("https://team.example/?setup=ABCD-EFGH").address == "https://team.example", "a bare address claims a server with no code"
    assert TeamUrl.parse("https://team.example/join?code=X&fingerprint=Y").is_invitation()
    assert TeamUrl.parse("https://203.0.113.5.").address == "https://203.0.113.5", "a sentence's full stop is no part of the address"
    assert TeamUrl.parse("203.0.113.5").address == "https://203.0.113.5", "a bare IP is reached over HTTPS"
    assert TeamUrl.parse("https://team.example/").address == "https://team.example"
    assert TeamUrl.parse("https://team.example.com:8443").has_self_signed_certificate() and TeamUrl.parse("https://203.0.113.5").has_self_signed_certificate()
    assert not TeamUrl.parse("https://team.example.com").has_self_signed_certificate(), "a domain on 443 has a public certificate"


def test_the_team_accounts_list_every_team_find_one_by_name_and_keep_the_first_joined_as_home(tmp_path: Path):
    import json
    from journal.config import Config
    from journal.features.library.support.library_account import LibraryAccount
    from journal.features.library.support.library_accounts import LibraryAccounts
    from journal.features.library.support.library_connection import LibraryConnection
    from journal.support.rejection import Rejection
    config = Config(tmp_path)
    account = LibraryAccount(config)
    account.write(LibraryConnection("zz-key", "https://shop.example", "t1", 1, 1, "Ada", "admin", "shop"))
    account.write(LibraryConnection("aa-key", "https://studio.example", "t2", 2, 1, "Ada", "member", "studio"))
    accounts = LibraryAccounts(config)
    assert accounts.names() == ["shop", "studio"], "the teams are listed by their name, whatever their keys"
    assert accounts.team("studio").connection().key == "aa-key"
    assert accounts.home().connection().team == "shop" and account.connection().team == "shop", "the first joined is home, also for the one-team account"
    try:
        accounts.team("nowhere")
        raise AssertionError("an unknown team name was found")
    except Rejection as refused:
        assert "nowhere" in str(refused) and "shop" in str(refused)
    (config.home / "libraries" / "old.json").write_text(json.dumps({"key": "old", "address": "https://203.0.113.5:8443", "token": "t", "device_id": 3, "account_id": 1, "name": "Ada", "role": "admin"}))
    assert accounts.keyed("old").connection().team == "203.0.113.5", "a file from before names is named by its host"


def test_the_library_link_publishes_an_item_with_its_file_and_reads_it_back_from_a_team_server(app: App, tmp_path: Path):
    import hashlib
    import json
    from journal.db.schema import Schema
    from journal.features.library.support.library_link import LibraryLink
    from journal.sync.team_account import TEAM_FILE, TeamAccount
    from sync_server.item_query import ItemQuery
    from sync_server.publish_request import PublishRequest
    from sync_server.team_server import TeamServer

    (tmp_path / "team").mkdir()
    team = TeamServer(tmp_path / "team")
    team.accounts.create("ada@example.com", "Ada", "correct horse battery", "admin", 1.0)
    _, token = team.devices.login("ada@example.com", "correct horse battery", "laptop", "127.0.0.1", 1.0)
    server = team.started("127.0.0.1", 0)
    address = f"http://127.0.0.1:{server.server_address[1]}"
    (app.config.home / TEAM_FILE).write_text(json.dumps({"address": address, "token": token}))
    link = LibraryLink(TeamAccount(app.config), app.container.get(Schema))
    try:
        assert link.summary(address).has_admin
        data = b"# Release"
        version = link.publish("skill", "release", PublishRequest("Releasing", json.dumps({"files": {"SKILL.md": hashlib.sha256(data).hexdigest()}}), "first"))
        assert not version.is_complete() and link.put_file("skill", "release", version.number, "SKILL.md", data).is_complete()
        [entry] = link.items(ItemQuery("skill", None)).items
        assert entry.item.name == "release" and link.version("skill", "release", 1).note == "first" and link.file("skill", "release", 1, "SKILL.md") == data
        assert link.withdraw("skill", "release").withdrawn_at > 0 and link.items(ItemQuery(None, None)).items == []
    finally:
        team.close(server)










def test_a_deleted_copy_of_a_library_item_is_no_longer_counted_as_held_and_update_offers_the_import(app: App, tmp_path: Path):
    from journal.repositories.sequences import Sequences
    from journal.support.actor import Actor
    from sync_server.team_server import TeamServer

    (tmp_path / "team").mkdir()
    team = TeamServer(tmp_path / "team")
    server = team.started("127.0.0.1", 0)
    address = f"http://127.0.0.1:{server.server_address[1]}"
    console, user = app.console(), Caller.user("main")
    sequences = app.container.get(Sequences)
    try:
        assert console.run(["team", "connect", f"{address}/setup?code={team.setup_code.current()}", "--email", "ada@example.com", "--name", "Ada", "--password", "correct horse battery"], user).code == 0
        number = console.run(["sequence", "create", "Lunch Break", "--steps", "eat"], user).text.split()[1].rstrip(":")
        assert console.run(["library", "publish", "sequence", number], user).code == 0
        assert console.run(["library", "import", "sequence", "lunch-break"], user).code == 0
        [copy] = sequences.titled("Lunch Break (from the library)")
        with app.container.get(Scope).environment(1):
            sequences.delete(copy, Actor.user(1))
        app.runtime().deferred.drain()
        assert "you have" not in console.run(["library", "list"], user).text, "a copy that is gone is not counted"
        assert "journal library import sequence lunch-break" in console.run(["library", "update", "sequence", "lunch-break"], user).error, "update names the import of a copy that is gone"
        assert console.run(["library", "import", "sequence", "lunch-break"], user).code == 0, "and it can be imported again"
    finally:
        team.close(server)




