"""The supervisor's parts that start no process: the launch, the picker, the hooks set aside, the status line, the inbox's announce file, the mirror, and that it imports every module at start. Its processes are tested in supervisor_processes_run.py."""

import json
import os
import time
from pathlib import Path

from supervisor.inbox import Inbox
from journal.launcher.environment_row import EnvironmentRow
from journal.launcher.program_settings import ProgramSettings
from journal.launcher.launch import Launch
from journal.launcher.choice import Choice
from journal.launcher.menu import Menu
from journal.launcher.screen import Screen
from journal.launcher.status_line import StatusLine


ROWS = [EnvironmentRow("main", True, "2 hours ago", {"claude": "abc"}), EnvironmentRow("spike")]
OTHER = {"hooks": {"Stop": [{"hooks": [{"type": "command", "command": "say done"}]}]}, "model": "opus"}


def settings_with_other_hooks(root: Path) -> Path:
    path = root / ".claude" / "settings.json"
    path.parent.mkdir(parents=True)
    ours = {"hooks": [{"type": "command", "command": "sh /pkg/journal/hooks/hook.sh claude /p"}]}
    path.write_text(json.dumps({**OTHER, "hooks": {**OTHER["hooks"], "PreToolUse": [ours]}}))
    return path


def menu_answering(tmp_path: Path, monkeypatch, answers: list[str]) -> Menu:
    import io
    given = iter(answers)
    monkeypatch.setattr("builtins.input", lambda: next(given))
    menu = Menu(tmp_path, tmp_path / "journal.py", Screen(io.StringIO()))
    menu.environments = lambda: ROWS
    return menu


def test_the_menu_defaults_and_answers_and_remembers(tmp_path: Path, monkeypatch):
    settings_with_other_hooks(tmp_path)
    menu = menu_answering(tmp_path, monkeypatch, ["", "2", "1", "2"])
    assert menu.choose("claude") == Choice("main", "", hooks_aside=False, skip_prompts=True)
    assert menu.choose("claude", yes=True) == Choice("main", "abc", hooks_aside=False, skip_prompts=True), "yes takes the defaults, which are last time's answers"
    assert menu.choose("claude", env="spike", yes=True).resume == ""
    assert menu.choose("claude", env="spike", new=True, aside=True, skip=False, yes=True) == Choice("spike", "", hooks_aside=True, skip_prompts=True)


def test_the_hooks_question_is_asked_even_when_no_other_hooks_are_found_yet(tmp_path: Path, monkeypatch):
    menu = menu_answering(tmp_path, monkeypatch, ["", "2", "2", "1"])
    assert menu.choose("claude") == Choice("main", "", hooks_aside=True, skip_prompts=False)
    assert menu.choose("claude", yes=True).hooks_aside is True, "remembered"


def test_version_threes_hook_is_somebody_elses(tmp_path: Path):
    from journal.launcher.other_hooks import OtherHooks
    assert not ProgramSettings.is_ours({"hooks": [{"type": "command", "command": "sh /p/.journal/src/hook.sh claude /p/.journal"}]})
    assert ProgramSettings.is_ours({"hooks": [{"type": "command", "command": "sh /pkg/src/journal/hooks/hook.sh claude /p"}]})


def test_the_status_line_names_the_project_the_environment_and_the_url_in_a_file_claude_reads(tmp_path):
    status = StatusLine("agent-journal", "main", tmp_path)
    status.begin()
    assert status.path.read_text() == "agent-journal · agent-journal · main · journal starting…"
    status.set_url("http://127.0.0.1:8420/")
    assert status.path.read_text().endswith("http://127.0.0.1:8420/")
    assert json.loads(status.settings())["statusLine"]["command"] == f"sh '{tmp_path / '.journal' / 'src' / 'journal' / 'hooks' / 'status.sh'}'", "one status script keeps the session's JSON and prints the bar"


def test_x_on_an_environment_deletes_it_after_a_confirmation_and_never_one_an_agent_works(tmp_path: Path, monkeypatch):
    deleted = []
    menu = menu_answering(tmp_path, monkeypatch, ["x1", "1", "x2", "2", "1", "2", "2", "2"])
    menu.journal = lambda *argv: deleted.append(argv) or ""
    assert menu.choose("claude").environment == "main"
    assert deleted == [("environment", "delete", "spike")]


def test_the_other_hooks_are_set_aside_and_put_back_with_later_edits_kept(tmp_path: Path):
    from journal.launcher.other_hooks import OtherHooks
    path = settings_with_other_hooks(tmp_path)
    hooks = OtherHooks(tmp_path, "claude")
    assert hooks.others() == [path]
    hooks.set_aside()
    left = json.loads(path.read_text())
    assert list(left["hooks"]) == ["PreToolUse"] and left["model"] == "opus"
    path.write_text(json.dumps({**left, "model": "sonnet"}))
    hooks.put_back()
    back = json.loads(path.read_text())
    assert set(back["hooks"]) == {"Stop", "PreToolUse"}
    assert back["model"] == "sonnet" and hooks.others() == [path]
    assert hooks.put_back() == [], "putting back twice does nothing"


def test_the_picker_moves_with_the_arrow_keys_and_jumps_by_number(tmp_path: Path):
    from journal.launcher.option import Option
    from journal.launcher.screen import Screen as Picker
    assert Picker._moved(0, "\x1b[B", 3) == 1 and Picker._moved(0, "\x1b[A", 3) == 2 and Picker._moved(0, "3", 3) == 2 and Picker._moved(1, "q", 3) == 1


def test_launch_parses_flags_and_builds_the_commands(tmp_path: Path):
    launch = Launch.parse(["claude", "--env", "spike", "--aside", "--", "--model", "x"], tmp_path)
    assert launch.env == "spike" and launch.aside and launch.args == ("--model", "x")
    status = StatusLine("p", "spike", tmp_path)
    assert launch.agent_command(Choice("spike", "s-1", True), status) == ["claude", "--settings", status.settings(), "--model", "x"], "the resume goes in the launch file apart"
    assert launch.agent_command(Choice("spike", "", True, skip_prompts=True), status) == ["claude", "--dangerously-skip-permissions", "--settings", status.settings(), "--model", "x"]
    environ = launch.environ(Choice("spike", "", True))
    assert environ["AGENT_JOURNAL_ACTIVE"] == "1" and environ["JOURNAL_ENV"] == "spike", "the journal's own hooks always run"
    assert environ["PATH"].startswith(str(tmp_path / ".journal" / "bin")), "the project's own journal command is on the agent's PATH, and nowhere else"
    assert launch.journal_command()[-1] == "serve"


def test_the_launch_puts_the_other_hooks_back_however_the_run_ends(tmp_path: Path):
    from journal.launcher.other_hooks import OtherHooks
    path = settings_with_other_hooks(tmp_path)

    class Launched(Launch):
        def choice(self):
            return Choice("main", "", hooks_aside=True)

        def supervise(self, choice):
            assert len(json.loads(path.read_text())["hooks"]) == 1, "the other hooks are aside while the agent runs"
            raise RuntimeError("the agent fell over")

    try:
        Launched.parse(["claude", "--env", "main", "--aside", "--yes"], tmp_path).run()
    except RuntimeError:
        pass
    assert set(json.loads(path.read_text())["hooks"]) == {"Stop", "PreToolUse"} and OtherHooks(tmp_path, "claude").put_back() == []


def test_the_launch_notices_the_journals_page_when_it_answers(tmp_path: Path, monkeypatch):
    from journal.app import App
    from journal.config import Config
    app = App(Config(tmp_path, port=0))
    app.server().start()
    try:
        from journal.launcher.page_wait import PageWait
        status = StatusLine("p", "main", tmp_path)
        PageWait(tmp_path / ".journal" / "port", status, "/tmp/no-supervisor.sock", ("agent-journal", "p · main"), "").wait()
        assert status.url == f"http://127.0.0.1:{app.server().port}/", "the launch sees the page answer, with no supervisor to tell"
    finally:
        app.server().stop()


def test_the_supervisor_imports_every_module_at_start_so_an_upgrade_never_changes_a_running_one():
    import ast
    late = []
    for path in sorted((Path(__file__).parent.parent / "src" / "supervisor").glob("*.py")):
        for node in ast.walk(ast.parse(path.read_text())):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                late += [f"{path.name}:{inner.lineno}" for inner in ast.walk(node) if isinstance(inner, (ast.Import, ast.ImportFrom))]
    assert late == [], "an import inside a function would load what an upgrade put on disk into a supervisor already running"


def test_the_mirror_goes_with_its_supervisor(tmp_path: Path):
    from supervisor.mirror import Mirror
    mirror = Mirror(tmp_path / "screens" / "main.out")
    mirror.add(b"Switch model?")
    mirror._written_at = 0
    mirror.flush()
    mirror.keyed()
    assert mirror.path.exists() and mirror.path.with_suffix(".keyed").exists()
    mirror.close()
    assert not mirror.path.exists() and not mirror.path.with_suffix(".keyed").exists(), "no screen is left for a process that is gone"


def test_the_inbox_announces_where_the_screen_is_mirrored(tmp_path: Path):
    inbox = Inbox(Path(f"/tmp/journal-{os.getuid()}") / f"test-{os.getpid()}.sock", tmp_path / "inboxes" / "main")
    inbox.open_mirrored(tmp_path / "screens" / "main.out")
    try:
        assert json.loads(inbox.announced_at.read_text())["screen"] == str(tmp_path / "screens" / "main.out"), "the journal reads the screen where the supervisor says it is"
    finally:
        inbox.close()


def test_the_launch_writes_what_the_supervisor_starts_and_a_bad_launch_file_is_refused(tmp_path: Path, capsys):
    from supervisor.__main__ import main
    launch = Launch.parse(["claude", "--env", "spike", "--no-journal"], tmp_path)
    written = launch.launch_file(Choice("spike", "s1"), StatusLine("p", "spike", tmp_path))
    assert written["front"]["command"][0] == "claude" and written["front"]["resume"] == ["--resume", "s1"] and written["services"] == [], "a launch with a journal running already starts none of its own; the resume apart, for a restart to replace"
    assert written["announce"].endswith("runtime/inboxes/spike") and written["screen"].endswith("runtime/screens/spike.out") and f"journal-{os.getuid()}" in written["socket"]
    with_journal = Launch.parse(["claude", "--env", "spike"], tmp_path).launch_file(Choice("spike", ""), StatusLine("p", "spike", tmp_path))
    assert [s["name"] for s in with_journal["services"]] == ["journal"]
    bad = tmp_path / "bad.json"
    bad.write_text(json.dumps({"front": {"command": ["claude"]}}))
    assert main([str(bad)]) == 2
    assert "has no socket, announce, front's folder, front's env" in capsys.readouterr().err
    assert main([str(tmp_path / "missing.json")]) == 2 and "cannot be read" in capsys.readouterr().err


def test_the_supervisor_imports_nothing_but_the_standard_library_and_itself():
    import ast
    import sys
    foreign = []
    for path in sorted((Path(__file__).parent.parent / "src" / "supervisor").glob("*.py")):
        for node in ast.walk(ast.parse(path.read_text())):
            names = [a.name for a in node.names] if isinstance(node, ast.Import) else [node.module] if isinstance(node, ast.ImportFrom) and node.module else []
            foreign += [f"{path.name}: {name}" for name in names if name.split(".")[0] not in (*sys.stdlib_module_names, "supervisor")]
    assert foreign == [], "the supervisor knows no journal module and needs nothing installed"


def test_a_service_that_cannot_start_dies_in_its_log_and_never_takes_the_supervisor_down(tmp_path: Path):
    from supervisor.service import Service
    from supervisor.services import Services
    services = Services(Service("mypy", ["bin/gone", "serve"], tmp_path / "moved-mid-upgrade", {}, tmp_path / "mypy.log"))
    services.start_all()
    services.keep_alive()
    assert not services.runs("mypy") and "mypy could not start" in (tmp_path / "mypy.log").read_text(), "its folder gone, as mid-upgrade, the start dies at once and says why"
