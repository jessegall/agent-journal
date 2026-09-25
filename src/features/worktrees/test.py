from features import FEATURES
from features.parts import Context
from features.worktrees.interceptors import LinkWorktreeJournal
from providers.payload import Hook
from tests.conftest import fresh


def linked(feature, record, cwd: Path) -> None:
    hook = Hook.read({"hook_event_name": "PreToolUse", "cwd": str(cwd)}, {})
    LinkWorktreeJournal().intercept(Context.of(feature, record, hook=hook), hook.tool)


def test_a_worktree_shares_the_projects_journal_skills_and_hooks_without_git_seeing_them(tmp_path):
    import subprocess
    import threading
    from engine.worktree import share_journal
    record = fresh()
    project = record.root.resolve().parent
    git = lambda *args, where=project: subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", *args], cwd=where, check=True,
                                                      capture_output=True, text=True, timeout=30).stdout
    git("init", "-q")
    (project / ".gitignore").write_text("/.journal\n/.claude/worktrees/\n/.claude/skills/journal*\n/.claude/settings.local.json\n")
    (project / ".claude" / "skills" / "journal").mkdir(parents=True)
    (project / ".claude" / "skills" / "mine").mkdir()
    (project / ".claude" / "skills" / "mine" / "SKILL.md").write_text("mine")
    (project / ".claude" / "settings.local.json").write_text("{}")
    git("add", ".gitignore")
    git("commit", "-q", "-m", "start")
    worktree = project / ".claude" / "worktrees" / "wt"
    git("worktree", "add", "-q", str(worktree))
    runs = [threading.Thread(target=share_journal, args=(worktree, record.root)) for _ in range(4)]
    for run in runs:
        run.start()
    for run in runs:
        run.join()
    linked = [worktree / ".journal", worktree / ".claude" / "skills" / "journal", worktree / ".claude" / "settings.local.json"]
    assert all(path.is_symlink() for path in linked) and (worktree / ".journal").resolve() == record.root.resolve(), \
        "the worktree's agent gets the project's journal, its skills and its hooks, even when four hooks link at once"
    assert git("status", "--porcelain", where=worktree) == "", "git sees none of the links"
    assert (worktree / ".claude" / "skills" / "mine").is_symlink(), "a skill git does not track is shared too, not only the ignored ones"
    other = tmp_path / "other"
    other.mkdir()
    git("init", "-q", where=other)
    git("commit", "-q", "--allow-empty", "-m", "start", where=other)
    git("worktree", "add", "-q", str(tmp_path / "other-wt"), where=other)
    share_journal(tmp_path / "other-wt", record.root)
    assert not (tmp_path / "other-wt" / ".journal").exists(), "another repository's worktree is never linked to this journal"

def worktree_of(tmp_path, name: str):
    main = tmp_path / "main"
    (main / ".git" / "worktrees" / name).mkdir(parents=True, exist_ok=True)
    worktree = tmp_path / name
    worktree.mkdir()
    (worktree / ".git").write_text(f"gitdir: {main / '.git' / 'worktrees' / name}\n")
    return worktree


def hooked(record, session: str, cwd, pid: int, **given) -> None:
    from engine.hooks import answer
    from providers import PROVIDERS
    answer(PROVIDERS["claude"](), record.root, {"hook_event_name": "UserPromptSubmit", "session_id": session, "cwd": str(cwd), **given}, pid)


def test_a_session_started_in_a_worktree_works_the_environment_named_after_it(tmp_path):
    from engine.sessions import Sessions
    record = fresh()
    Sessions(record.root).bind("claude-4242", record.env, pid=4242, provider="claude")
    hooked(record, "in-the-worktree", worktree_of(tmp_path, "feature-x"), 4242)
    sessions = Sessions(record.root)
    assert (sessions.environment("in-the-worktree"), sessions.environment("claude-4242")) == ("feature-x", "feature-x"), \
        "the session and the terminal it runs in both work the worktree's environment"
    import os
    sessions.bind("holder", "feature-y", pid=os.getpid(), provider="claude")
    sessions.bind("wanderer", record.env, pid=5252, provider="claude")
    hooked(record, "wanderer", worktree_of(tmp_path, "feature-y"), 5252)
    assert (Sessions(record.root).environment("wanderer"), Sessions(record.root).environment("holder")) == (record.env, "feature-y"), \
        "a session that only looks into a worktree another agent holds stays where it was, and the holder keeps it"
    from engine.terminal import launch_spec
    from unittest import mock
    with mock.patch("providers.claude.ClaudeDriver.placed", lambda cwd, args: (cwd, args)), mock.patch("engine.terminal.share_journal"):
        spec = launch_spec(record.root, tmp_path / "feature-y", record.env, "claude", [])
    assert spec["env"] == "feature-y-2", "a second agent started in a worktree another agent works gets an environment of its own"


def test_a_resumed_conversation_in_a_worktree_moves_there_with_its_terminal(tmp_path):
    from controllers.types import Environments
    from engine.sessions import Sessions
    from resources.base import SYSTEM
    record = fresh()
    sessions = Sessions(record.root)
    environments = Environments(record, actor=SYSTEM)
    sessions.bind("claude-5151", record.env, pid=5151, provider="claude")
    environments._seat(record.env, "claude-5151")
    sessions.bind("resumed", record.env, pid=5151, provider="claude")
    hooked(record, "resumed", worktree_of(tmp_path, "feature-z") / "src", 5151)
    assert (sessions.environment("resumed"), sessions.environment("claude-5151")) == ("feature-z", "feature-z"), \
        "a conversation the journal already knew follows the worktree it now runs in, and so does its restarted terminal"
    hooked(record, "resumed", tmp_path / "main", 5151, agent_id="helper")
    assert sessions.environment("resumed") == "feature-z", "a subagent's hook outside the worktree never moves the main conversation"


def test_a_subagent_in_its_own_worktree_never_moves_the_main_conversation(tmp_path):
    from engine.sessions import Sessions
    record = fresh()
    Sessions(record.root).bind("main-conversation", record.env, pid=6161, provider="claude")
    hooked(record, "main-conversation", worktree_of(tmp_path, "agent-a1b2"), 6161, agent_id="a1b2")
    assert Sessions(record.root).environment("main-conversation") == record.env, "an isolated subagent's worktree is the subagent's, not the session's"


def test_a_restarted_worker_keeps_the_seat_its_terminal_moved_to():
    from engine.sessions import Sessions
    from engine.terminal import Seat, seated
    record = fresh()
    first = seated(Seat(record.root, record.env, "claude", "claude-7171"))
    Sessions(record.root).bind("claude-7171", "elsewhere")
    again = seated(Seat(record.root, record.env, "claude", "claude-7171"))
    assert (first.env, again.env, Sessions(record.root).environment("claude-7171")) == (record.env, "elsewhere", "elsewhere"), \
        "a new build restarts the worker, and the terminal stays where it was moved"


def test_journal_claude_with_a_worktree_makes_it_itself_and_starts_claude_inside_it(tmp_path, monkeypatch):
    import subprocess
    import pytest
    from providers.claude import ClaudeDriver
    project = tmp_path / "project"
    project.mkdir()
    for command in (["git", "init", "-q"], ["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "--allow-empty", "-m", "start"]):
        subprocess.run(command, cwd=project, check=True, timeout=30)
    (project / ".env").write_text("SECRET=1\n")
    (project / ".worktreeinclude").write_text("/.env\nconfig/\n")
    (project / "config").mkdir()
    (project / "config" / "local.toml").write_text("x = 1\n")
    import json
    monkeypatch.setenv("CLAUDE_CONFIG_DIR", str(tmp_path / "claude"))
    state = tmp_path / "claude" / ".claude.json"
    trust = lambda folder: json.loads(state.read_text())["projects"].get(str(folder.resolve()))
    cwd, args = ClaudeDriver.placed(project, ["--dangerously-skip-permissions", "--worktree=feature-q", "--resume", "c1"])
    assert trust(cwd) == {"hasTrustDialogAccepted": True, "enabledMcpjsonServers": ["journal"]}, \
        "a new worktree is trusted with the journal's server approved, so Claude asks nothing at start, even with no state file yet"
    assert trust(project) is None, "the project itself is left to Claude"
    assert (cwd, args) == (project / ".claude" / "worktrees" / "feature-q", ["--dangerously-skip-permissions", "--resume", "c1"]), \
        "Claude starts inside the worktree without a worktree of its own to clean up"
    assert ((cwd / ".env").read_text(), subprocess.run(["git", "branch", "--show-current"], cwd=cwd, capture_output=True, text=True, timeout=30).stdout.strip()) == \
        ("SECRET=1\n", "worktree-feature-q"), "it is made on Claude's branch name, with the files .worktreeinclude lists"
    assert (cwd / "config" / "local.toml").is_file(), ".worktreeinclude reads like a gitignore: a leading slash and a folder both work"
    inner, _ = ClaudeDriver.placed(cwd, ["-w", "other"])
    assert inner == project / ".claude" / "worktrees" / "other", "launched from inside a worktree, a new one is still made beside it in the project"
    import shutil
    shutil.rmtree(inner)
    assert ClaudeDriver.placed(project, ["-w", "other"])[0].is_dir(), "a worktree folder deleted by hand is made again on the next launch"
    (project / ".claude" / "worktrees" / "stray").mkdir()
    with pytest.raises(SystemExit):
        ClaudeDriver.placed(project, ["-w", "stray"])
    assert trust(project / ".claude" / "worktrees" / "stray") is None, "a refused launch trusts nothing"
    subprocess.run(["git", "worktree", "add", "-q", "-b", "hotfix", str(tmp_path / "hotfix")], cwd=project, check=True, timeout=30)
    known = json.loads(state.read_text())
    known["numStartups"] = 7
    known["projects"][str((tmp_path / "hotfix").resolve())] = {"allowedTools": ["Bash"], "enabledMcpjsonServers": ["other"]}
    state.write_text(json.dumps(known))
    assert ClaudeDriver.placed(project, ["-w", "hotfix"])[0] == tmp_path / "hotfix", "a worktree made by hand is launched where it is"
    assert (trust(tmp_path / "hotfix"), json.loads(state.read_text())["numStartups"], trust(cwd)["enabledMcpjsonServers"]) == \
        ({"allowedTools": ["Bash"], "enabledMcpjsonServers": ["other", "journal"], "hasTrustDialogAccepted": True}, 7, ["journal"]), \
        "what Claude already keeps for the folder, its other servers and every other project stay as they were"
    before = (state.read_bytes(), state.stat().st_mtime_ns)
    assert ClaudeDriver.placed(project, ["-w", "feature-q"]) == (cwd, []), "an existing worktree is reused"
    assert (state.read_bytes(), state.stat().st_mtime_ns) == before, "a folder already trusted is not written again"
    git = ["git", "-c", "user.email=t@t", "-c", "user.name=t"]
    subprocess.run([*git, "commit", "-q", "--allow-empty", "-m", "work in the worktree"], cwd=cwd, check=True, timeout=30)
    from commands.queries import kept_work
    kept_work(cwd)
    subprocess.run(["git", "worktree", "remove", "--force", str(cwd)], cwd=project, check=True, timeout=30)
    subprocess.run(["git", "branch", "-D", "worktree-feature-q"], cwd=project, check=True, capture_output=True, timeout=30)
    assert ClaudeDriver.placed(project, ["-w", "feature-q"])[0] == cwd and "work in the worktree" in \
        subprocess.run(["git", "log", "-1", "--format=%s"], cwd=cwd, capture_output=True, text=True, timeout=30).stdout, \
        "a worktree removed with its branch comes back with the work its last launch recorded"
    assert ClaudeDriver.placed(project, ["-c"]) == (project, ["-c"]), "without a worktree Claude starts in the project"
    named, rest = ClaudeDriver.placed(project, ["-w", "--dangerously-skip-permissions"])
    assert (named.parent, rest) == (project / ".claude" / "worktrees", ["--dangerously-skip-permissions"]), \
        "a bare -w gets a name from the journal, so the worktree and its links exist before Claude starts"
    from engine.worktree import environment
    assert environment(project / ".claude" / "worktrees" / "main") == "", "a worktree named main never joins the project's own environment"
    for name in ("a:b", "a/b"):
        with pytest.raises(SystemExit):
            ClaudeDriver.placed(project, ["-w", name])
    folder = tmp_path / "workspace"
    for repo in ("site", "chronos"):
        (folder / repo).mkdir(parents=True)
        for command in (["git", "init", "-q"], [*git, "commit", "-q", "--allow-empty", "-m", "start"]):
            subprocess.run(command, cwd=folder / repo, check=True, timeout=30)
    (folder / "CLAUDE.md").write_text("# the whole project\n")
    made, _ = ClaudeDriver.placed(folder, ["-w", "calm-river"])
    branches = [subprocess.run(["git", "branch", "--show-current"], cwd=made / repo, capture_output=True, text=True, timeout=30).stdout.strip() for repo in ("site", "chronos")]
    assert (made, branches, (made / "CLAUDE.md").is_symlink()) == (folder / ".claude" / "worktrees" / "calm-river", ["worktree-calm-river"] * 2, True), \
        "in a folder of repositories, a worktree holds a worktree of each one on the same branch, with the folder's own files linked in"
    subprocess.run([*git, "commit", "-q", "--allow-empty", "-m", "site work"], cwd=made / "site", check=True, timeout=30)
    kept_work(made)
    assert "site work" in subprocess.run(["git", "log", "-1", "--format=%s", "refs/journal/worktrees/calm-river"], cwd=folder / "site", capture_output=True, text=True, timeout=30).stdout, \
        "leaving it keeps each repository's work under the worktree's name"


def test_a_command_run_inside_a_worktree_works_the_worktrees_environment(tmp_path):
    from commands.cli import captured
    record = fresh()
    main = tmp_path / "main"
    (main / ".git" / "worktrees" / "feature-y").mkdir(parents=True)
    worktree = tmp_path / "feature-y"
    worktree.mkdir()
    (worktree / ".git").write_text(f"gitdir: {main / '.git' / 'worktrees' / 'feature-y'}\n")
    (record.root / "environments" / "feature-y").mkdir(parents=True)
    text, code = captured(["--cwd", str(worktree), "todo", "create", "from the worktree"], record.root)
    assert (code, (record.root / "environments" / "feature-y" / "todo").is_dir()) == (0, True), text


def test_continuing_names_the_folders_latest_conversation(tmp_path, monkeypatch):
    import os
    import re
    from providers.claude import ClaudeDriver
    monkeypatch.setenv("HOME", str(tmp_path))
    project = tmp_path / "my.project"
    folder = tmp_path / ".claude" / "projects" / re.sub(r"[^A-Za-z0-9]", "-", str(project))
    folder.mkdir(parents=True)
    for age, name in ((20, "older"), (10, "newer")):
        (folder / f"{name}.jsonl").write_text("{}\n")
        os.utime(folder / f"{name}.jsonl", (0, 1_000_000 - age))
    assert (ClaudeDriver.continued(["-c"], project), ClaudeDriver.continued(["--resume"], project), ClaudeDriver.continued([], tmp_path / "elsewhere")) == \
        ("newer", "", ""), "--continue names the folder's latest conversation, so it goes back to that conversation's environment"


def test_a_bare_worktree_flag_is_named_after_the_chosen_environment():
    from providers import DRIVERS
    claude = DRIVERS["claude"]
    assert claude.within(["--worktree", "--continue"], "feature-x") == ["--worktree", "feature-x", "--continue"], \
        "a --worktree given without a name takes the environment chosen in the boot menu"
    assert claude.within(["--worktree", "mine"], "feature-x") == ["--worktree", "mine"], "a named worktree is kept"
    assert claude.asks_worktree(["--worktree"]) and not claude.asks_worktree(["--continue"])


def test_a_worktree_links_the_projects_journal_even_when_git_brings_old_journal_files(tmp_path):
    import subprocess
    from engine.worktree import share_journal
    record = fresh()
    project = record.root.resolve().parent
    git = lambda *args, where=project: subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", *args], cwd=where, check=True,
                                                      capture_output=True, text=True, timeout=30).stdout
    git("init", "-q")
    (project / ".gitignore").write_text("/.claude/worktrees/\n")
    (record.root / "README.md").write_text("an old journal, committed long ago")
    git("add", ".gitignore")
    git("add", "-f", ".journal/README.md")
    (project / ".claude" / "skills" / "mine").mkdir(parents=True)
    (project / ".claude" / "skills" / "mine" / "SKILL.md").write_text("the project's own skill")
    git("add", ".claude/skills/mine/SKILL.md")
    git("commit", "-q", "-m", "start")
    worktree = project / ".claude" / "worktrees" / "wt"
    git("worktree", "add", "-q", str(worktree))
    (project / ".claude" / "skills" / "journal-boards").mkdir()
    (project / ".claude" / "skills" / "journal-boards" / "SKILL.md").write_text("never committed nor ignored")
    assert (worktree / ".journal" / "README.md").is_file(), "the checkout brings the committed journal files"
    share_journal(worktree, record.root)
    assert (worktree / ".journal").is_symlink() and (worktree / ".journal").resolve() == record.root.resolve(), \
        "committed journal files are not a journal: the worktree still gets the project's own"
    assert (worktree / ".claude" / "skills" / "journal-boards").is_symlink(), "a skill git neither tracks nor ignores is linked"
    assert not (worktree / ".claude" / "skills" / "mine").is_symlink(), "a skill the branch carries stays its own"
    assert git("status", "--porcelain", where=worktree) == "", "and git sees no change in the worktree"
    share_journal(worktree, record.root)
    assert (worktree / ".journal").resolve() == record.root.resolve(), "linking again changes nothing"
    (worktree / ".journal").unlink()
    (worktree / ".journal").symlink_to(tmp_path / "gone")
    share_journal(worktree, record.root)
    assert (worktree / ".journal").resolve() == record.root.resolve(), "a link to a journal that is gone is replaced"
    (worktree / ".journal").unlink()
    git("update-index", "--no-skip-worktree", ".journal/README.md", where=worktree)
    git("checkout", "--", ".journal/README.md", where=worktree)
    share_journal(worktree, record.root)
    assert (worktree / ".journal").resolve() == record.root.resolve(), "committed files checked out again do not win either"
    own = project / ".claude" / "worktrees" / "own"
    git("worktree", "add", "-q", str(own))
    (own / ".journal" / "environments").mkdir()
    share_journal(own, record.root)
    assert not (own / ".journal").is_symlink(), "a worktree with a journal record of its own keeps it"
