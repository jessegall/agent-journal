"""The supervisor's parts that start no process: the launch, the picker, the hooks set aside, the status line, the inbox's announce file, the mirror, and that it imports every module at start. Its processes are tested in supervisor_processes_run.py."""

import json
import os
import time
from pathlib import Path

from supervisor.inbox import Inbox
from journal.support.environment_row import EnvironmentRow
from journal.launcher.support.program_settings import ProgramSettings
from journal.launcher.launch import Launch
from journal.launcher.support.choice import Choice
from journal.launcher.menu import Menu
from journal.launcher.screen import Screen
from journal.launcher.support.status_line import StatusLine


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
    from journal.launcher.support.other_hooks import OtherHooks
    assert not ProgramSettings.is_ours({"hooks": [{"type": "command", "command": "sh /p/.journal/src/hook.sh claude /p/.journal"}]})
    assert ProgramSettings.is_ours({"hooks": [{"type": "command", "command": "sh /pkg/src/journal/hooks/hook.sh claude /p"}]})


def test_the_status_line_keeps_claudes_status_json_through_the_journals_script(tmp_path):
    status = StatusLine(tmp_path)
    assert json.loads(status.settings())["statusLine"]["command"] == f"sh '{tmp_path / '.journal' / 'src' / 'journal' / 'hooks' / 'status.sh'}'", "one status script keeps the session's JSON; the band says where the agent is"


def test_x_on_an_environment_deletes_it_after_a_confirmation_and_never_one_an_agent_works(tmp_path: Path, monkeypatch):
    deleted = []
    menu = menu_answering(tmp_path, monkeypatch, ["x1", "1", "x2", "2", "1", "2", "2", "2"])
    menu.journal = lambda *argv: deleted.append(argv) or ""
    assert menu.choose("claude").environment == "main"
    assert deleted == [("environment", "delete", "spike")]


def test_the_other_hooks_are_set_aside_and_put_back_with_later_edits_kept(tmp_path: Path):
    from journal.launcher.support.other_hooks import OtherHooks
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
    from journal.launcher.support.option import Option
    from journal.launcher.screen import Screen as Picker
    assert Picker._moved(0, "\x1b[B", 3) == 1 and Picker._moved(0, "\x1b[A", 3) == 2 and Picker._moved(0, "3", 3) == 2 and Picker._moved(1, "q", 3) == 1


def test_launch_parses_flags_and_builds_the_commands(tmp_path: Path):
    launch = Launch.parse(["claude", "--env", "spike", "--aside", "--", "--model", "x"], tmp_path)
    assert launch.env == "spike" and launch.aside and launch.args == ("--model", "x")
    status = StatusLine(tmp_path)
    assert launch.agent_command(Choice("spike", "s-1", True), status) == ["claude", "--settings", status.settings(), "--model", "x"], "the resume goes in the launch file apart"
    assert launch.agent_command(Choice("spike", "", True, skip_prompts=True), status) == ["claude", "--dangerously-skip-permissions", "--settings", status.settings(), "--model", "x"]
    codex = Launch.parse(["codex"], tmp_path)
    assert codex.agent_command(Choice("spike", "", True), status) == ["codex", "-c", "sandbox_workspace_write.network_access=true"], "a sandboxed Codex reaches its journal's server"
    assert codex.agent_command(Choice("spike", "", True, skip_prompts=True), status) == ["codex", "--dangerously-bypass-approvals-and-sandbox"]
    environ = launch.environ(Choice("spike", "", True))
    assert environ["AGENT_JOURNAL_ACTIVE"] == "1" and environ["JOURNAL_ENV"] == "spike", "the journal's own hooks always run"
    assert environ["PATH"].startswith(str(tmp_path / ".journal" / "bin")), "the project's own journal command is on the agent's PATH, and nowhere else"
    assert launch.journal_command()[-1] == "serve"


def test_the_launch_puts_the_other_hooks_back_however_the_run_ends(tmp_path: Path):
    from journal.launcher.support.other_hooks import OtherHooks
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
        from journal.launcher.support.page_wait import PageWait
        said, opened = [], []
        waiting = PageWait(tmp_path / ".journal" / "port", "/tmp/no-supervisor.sock", ("agent-journal", "p · main"), "", said.append)
        assert waiting.answering() == f"http://127.0.0.1:{app.server().port}/", "the launch sees the page answer, with no supervisor to tell"
        waiting.wait()
        import webbrowser
        monkeypatch.setattr(webbrowser, "open", lambda url, new=0: opened.append(url) or True)
        monkeypatch.setattr(PageWait, "tab_open", lambda self, url: False)
        PageWait(tmp_path / ".journal" / "port", "/tmp/no-supervisor.sock", ("agent-journal", "p · main"), "?env=main", said.append).wait()
        assert opened == [f"http://127.0.0.1:{app.server().port}/?env=main"] and said[-1] == f"viewer: opened {opened[0]}", "with no tab open the viewer is opened, and the launch log says so"
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
    written = launch.launch_file(Choice("spike", "s1"), StatusLine(tmp_path))
    assert written["front"]["command"][0] == "claude" and written["front"]["resume"] == ["--resume", "s1"] and written["services"] == [], "a launch with a journal running already starts none of its own; the resume apart, for a restart to replace"
    assert written["announce"].endswith("runtime/inboxes/spike") and written["screen"].endswith("runtime/screens/spike.out") and f"journal-{os.getuid()}" in written["socket"]
    with_journal = Launch.parse(["claude", "--env", "spike"], tmp_path).launch_file(Choice("spike", ""), StatusLine(tmp_path))
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


def test_a_fault_in_a_verb_or_a_turn_is_written_down_and_the_supervisor_carries_on(tmp_path: Path):
    from supervisor.request import Request
    from supervisor.services import Services
    from supervisor.supervisor import Supervisor
    from supervisor.terminal import Terminal
    faults = tmp_path / "supervisor.log"
    supervisor = Supervisor(Terminal(["true"], str(tmp_path), {}), Inbox(tmp_path / "s.sock", tmp_path / "announce"), Services(), stdin=None, faults=faults)
    reply = supervisor.verbs.handle(Request.from_json({"verb": "start", "name": "mypy", "command": ["true"], "folder": str(tmp_path), "env": {"COUNT": 3}}))
    assert not reply.ok and "start failed in the supervisor, which carries on" in reply.error, "a verb that raises is answered with why"
    supervisor.turn()
    assert faults.read_text().count("supervisor fault, carried on") == 2, "the verb's fault and the turn's are both written down, and neither ended the supervisor"


def test_a_worktree_launch_makes_its_worktree_and_never_hands_the_flag_to_the_agent(tmp_path: Path):
    import subprocess
    from journal.support.worktree import Worktree
    launch = Launch.parse(["claude", "--worktree", "1012-inventory-page", "--resume", "abc"], tmp_path)
    assert launch.worktree == "1012-inventory-page" and launch.args == ("--resume", "abc"), "the journal takes --worktree; Claude Code would remove a worktree it made"
    assert Launch.parse(["claude", "-w", "x"], tmp_path).worktree == "x"
    git = lambda *args: subprocess.run(["git", "-C", str(tmp_path), *args], capture_output=True, text=True, timeout=30)
    git("init", "-q")
    git("-c", "user.email=a@b", "-c", "user.name=a", "commit", "-q", "--allow-empty", "-m", "start")
    made = Worktree(tmp_path, "1012-inventory-page").made()
    assert made == tmp_path / ".claude" / "worktrees" / "1012-inventory-page" and (made / ".git").exists(), "made at Claude Code's own place, so an older one is found"
    assert "worktree-1012-inventory-page" in git("branch").stdout
    subprocess.run(["rm", "-rf", str(made)], timeout=30)
    assert Worktree(tmp_path, "1012-inventory-page").made().is_dir(), "a worktree whose folder went is made again on its branch, and nothing is lost from the branch"


def test_a_bare_worktree_flag_takes_the_chosen_environments_name(tmp_path: Path):
    import subprocess
    git = lambda *args: subprocess.run(["git", "-C", str(tmp_path), *args], capture_output=True, text=True, timeout=30)
    git("init", "-q")
    git("-c", "user.email=a@b", "-c", "user.name=a", "commit", "-q", "--allow-empty", "-m", "start")
    for argv in (["claude", "-w"], ["claude", "--worktree", "--resume", "abc"]):
        launch = Launch.parse(argv, tmp_path)
        assert launch.in_worktree and launch.worktree == "" and "--worktree" not in launch.args and "-w" not in launch.args
    launch = Launch.parse(["claude", "-w"], tmp_path)
    made = launch.launch_file(Choice("calm-river", "", False, False), StatusLine(tmp_path))
    assert made["front"]["folder"] == str(tmp_path / ".claude" / "worktrees" / "calm-river"), "the worktree is named after the environment the menu chose"
    assert "worktree-calm-river" in git("branch").stdout


def test_a_worktree_shares_the_projects_journal_skills_and_hooks_without_git_seeing_them(tmp_path: Path):
    import subprocess
    import threading
    from journal.support.worktree import Worktree
    git = lambda *args, at=tmp_path: subprocess.run(["git", "-C", str(at), *args], capture_output=True, text=True, timeout=30)
    git("init", "-q")
    (tmp_path / ".gitignore").write_text("/.journal\n/.claude/settings.json\n")
    (tmp_path / "AGENTS.md").write_text("the law\n")
    git("add", ".gitignore", "AGENTS.md")
    git("-c", "user.email=a@b", "-c", "user.name=a", "commit", "-q", "-m", "start")
    (tmp_path / ".journal").mkdir()
    (tmp_path / ".journal" / "port").write_text("8421")
    (tmp_path / ".claude" / "skills" / "journal").mkdir(parents=True)
    (tmp_path / ".claude" / "skills" / "journal" / "SKILL.md").write_text("# The journal\n")
    (tmp_path / ".claude" / "settings.json").write_text("{}")
    threads = [threading.Thread(target=Worktree(tmp_path, "calm-river").made) for _ in range(4)]
    [t.start() for t in threads]
    [t.join() for t in threads]
    tree = tmp_path / ".claude" / "worktrees" / "calm-river"
    assert (tree / ".journal" / "port").read_text() == "8421" and (tree / ".journal").is_symlink(), "the worktree reads the project's journal, made four times at once"
    assert (tree / ".claude" / "skills" / "journal" / "SKILL.md").is_file() and (tree / ".claude" / "settings.json").is_symlink(), "an untracked skill and an ignored hook file are shared"
    assert not (tree / "AGENTS.md").is_symlink(), "a tracked file comes with the checkout, never a link"
    assert git("status", "--porcelain", at=tree).stdout == "" and git("status", "--porcelain").stdout == "", "git sees none of it, in the worktree or the project"


def test_a_worktree_links_the_projects_journal_even_when_git_brings_old_journal_files(tmp_path: Path):
    import subprocess
    from journal.support.worktree import Worktree
    git = lambda *args: subprocess.run(["git", "-C", str(tmp_path), *args], capture_output=True, text=True, timeout=30)
    git("init", "-q")
    (tmp_path / ".journal").mkdir()
    (tmp_path / ".journal" / "old.txt").write_text("from long ago")
    git("add", ".journal/old.txt")
    git("-c", "user.email=a@b", "-c", "user.name=a", "commit", "-q", "-m", "start")
    (tmp_path / ".journal" / "port").write_text("8421")
    tree = Worktree(tmp_path, "x").made()
    assert (tree / ".journal").is_symlink() and (tree / ".journal" / "port").read_text() == "8421", "the checked-out old journal files make way for the link"


def test_a_command_or_hook_inside_a_worktree_works_the_worktrees_environment(tmp_path: Path):
    import subprocess
    from journal.support.worktree import Worktree
    git = lambda *args: subprocess.run(["git", "-C", str(tmp_path), *args], capture_output=True, text=True, timeout=30)
    git("init", "-q")
    git("-c", "user.email=a@b", "-c", "user.name=a", "commit", "-q", "--allow-empty", "-m", "start")
    tree = Worktree(tmp_path, "calm-river").made()
    (tree / "deep").mkdir()
    rule = Path(__file__).parents[1] / "src" / "journal" / "hooks" / "environment.sh"
    named = lambda at, env="": subprocess.run(["sh", "-c", f'. "{rule}"; journal_environment'], cwd=at, capture_output=True, text=True, timeout=30, env={"PATH": os.environ["PATH"], **({"JOURNAL_ENV": env} if env else {})}).stdout
    assert named(tree / "deep") == "calm-river", "a command run anywhere inside the worktree works its environment"
    assert named(tmp_path) == "main" and named(tmp_path.parent) == "main", "the project's own checkout, and a folder outside git, work main"
    assert named(tree, "spike") == "spike", "an environment named outright wins"


def test_a_conversation_resumed_runs_in_its_environment_and_that_environments_worktree(tmp_path: Path, monkeypatch):
    import subprocess
    from journal.support.worktree import Worktree
    git = lambda *args: subprocess.run(["git", "-C", str(tmp_path), *args], capture_output=True, text=True, timeout=30)
    git("init", "-q")
    git("-c", "user.email=a@b", "-c", "user.name=a", "commit", "-q", "--allow-empty", "-m", "start")
    tree = Worktree(tmp_path, "calm-river").made()
    menu = menu_answering(tmp_path, monkeypatch, [])
    menu.environments = lambda: [EnvironmentRow("main", last_sessions={"claude": "abc"}), EnvironmentRow("calm-river", last_sessions={"claude": "def"})]
    assert Launch.parse(["claude", "--resume", "def"], tmp_path).resumed_in(menu) == "calm-river", "a conversation is resumed in the environment it last ran in"
    assert Launch.parse(["claude", "--resume", "zzz"], tmp_path).resumed_in(menu) == "" and Launch.parse(["claude"], tmp_path).resumed_in(menu) == ""
    status = StatusLine(tmp_path)
    plain = Launch.parse(["claude", "--resume", "def"], tmp_path)
    assert plain.launch_file(Choice("calm-river", "", False, False), status)["front"]["folder"] == str(tree), "an environment with a worktree runs its agent there, where its conversations are"
    assert plain.launch_file(Choice("main", "", False, False), status)["front"]["folder"] == str(tmp_path)


def test_the_menu_marks_an_environment_with_a_worktree_and_its_branch(tmp_path: Path):
    import subprocess
    from journal.support.worktree import Worktree
    git = lambda *args: subprocess.run(["git", "-C", str(tmp_path), *args], capture_output=True, text=True, timeout=30)
    git("init", "-q")
    git("-c", "user.email=a@b", "-c", "user.name=a", "commit", "-q", "--allow-empty", "-m", "start")
    Worktree(tmp_path, "calm-river").made()
    assert Worktree(tmp_path, "calm-river").badges() == ("worktree on worktree-calm-river",) and Worktree(tmp_path, "main").badges() == ()


def test_a_worktree_whose_folder_and_branch_went_is_made_again_from_its_kept_tip(tmp_path: Path):
    import subprocess
    from journal.support.worktree import Worktree
    git = lambda *args, at=tmp_path: subprocess.run(["git", "-C", str(at), *args], capture_output=True, text=True, timeout=30)
    git("init", "-q")
    git("-c", "user.email=a@b", "-c", "user.name=a", "commit", "-q", "--allow-empty", "-m", "start")
    tree = Worktree(tmp_path, "1012-inventory-page").made()
    (tree / "page.py").write_text("PAGE = 1\n")
    git("add", "page.py", at=tree)
    git("-c", "user.email=a@b", "-c", "user.name=a", "commit", "-q", "-m", "the page", at=tree)
    Worktree(tmp_path, "1012-inventory-page").made()
    git("worktree", "remove", "--force", str(tree))
    git("branch", "-D", "worktree-1012-inventory-page")
    again = Worktree(tmp_path, "1012-inventory-page").made()
    assert (again / "page.py").read_text() == "PAGE = 1\n", "the committed work comes back from the kept tip though the folder and the branch were removed"


def test_a_folder_no_worktree_owns_is_moved_aside_never_deleted_and_a_failed_make_leaves_nothing_half_made(tmp_path: Path):
    import subprocess
    from journal.support.worktree import Worktree
    from journal.support.worktree_not_made import WorktreeNotMade
    git = lambda *args: subprocess.run(["git", "-C", str(tmp_path), *args], capture_output=True, text=True, timeout=30)
    git("init", "-q")
    git("-c", "user.email=a@b", "-c", "user.name=a", "commit", "-q", "--allow-empty", "-m", "start")
    stray = tmp_path / ".claude" / "worktrees" / "calm-river"
    stray.mkdir(parents=True)
    (stray / "mine.txt").write_text("not a worktree's\n")
    made = Worktree(tmp_path, "calm-river").made()
    aside = [p for p in made.parent.iterdir() if p.name.startswith("calm-river.moved-aside-")]
    assert (made / ".git").exists() and len(aside) == 1 and (aside[0] / "mine.txt").read_text() == "not a worktree's\n", "the stray folder is kept aside and the worktree made"
    git("branch", "worktree-taken")
    git("worktree", "add", str(tmp_path / "elsewhere"), "worktree-taken")
    try:
        Worktree(tmp_path, "taken").made()
        raise AssertionError("a branch checked out elsewhere cannot be made a second time")
    except WorktreeNotMade:
        pass
    assert not (tmp_path / ".claude" / "worktrees" / "taken").exists(), "nothing half made is left at the worktree's place"


def test_the_boot_screen_offers_a_newer_release_of_the_same_major_before_the_journal_starts(tmp_path: Path, monkeypatch):
    import io
    from journal.config import Config
    from journal.features.updates.support.release_installer import ReleaseInstaller
    from journal.features.updates.support.release_source import ReleaseSource
    from journal.launcher.support.update_offer import UpdateOffer
    from journal.version import VERSION
    major = VERSION.split(".")[0]
    monkeypatch.setattr(ReleaseSource, "tags", lambda self, prefix: [f"v{VERSION}", f"v{major}.99.0", f"v{int(major) + 1}.0.0"])
    installed = []
    monkeypatch.setattr(ReleaseInstaller, "run", lambda self, release: installed.append(release.version))
    answers = iter(["2", "1"])
    monkeypatch.setattr("builtins.input", lambda: next(answers))
    offer = UpdateOffer(Config(tmp_path), Screen(io.StringIO()), ReleaseSource())
    assert offer.newest().version == f"{major}.99.0", "the newest of the same major, never the next major"
    assert not offer.installed_newer() and installed == [], "Start as it is installs nothing"
    assert offer.installed_newer() and installed == [f"{major}.99.0"], "Update installs it before the journal starts"


def test_every_start_asks_to_skip_the_permission_prompts_with_skip_selected_even_when_carrying_on(tmp_path: Path, monkeypatch):
    asked = []
    menu = menu_answering(tmp_path, monkeypatch, ["", "", ""])
    picked = menu.screen.pick
    monkeypatch.setattr(menu.screen, "pick", lambda heading, notes, options, default: asked.append((heading, default)) or picked(heading, notes, options, default))
    choice = menu.choose("claude")
    assert choice.resume == "abc" and choice.skip_prompts, "carrying on main's conversation still starts with the prompts skipped"
    assert ("Run without permission prompts", 0) in asked, "the question is asked, with skip under the cursor"


def test_a_start_command_that_skips_the_prompts_itself_is_not_asked(tmp_path: Path):
    assert Launch.parse(["claude", "--dangerously-skip-permissions"], tmp_path).is_skipping()
    assert Launch.parse(["codex", "--dangerously-bypass-approvals-and-sandbox"], tmp_path).is_skipping()
    assert Launch.parse(["claude", "--skip"], tmp_path).is_skipping() and not Launch.parse(["claude"], tmp_path).is_skipping()
