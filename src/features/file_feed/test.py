import pytest
import subprocess
from dataclasses import dataclass
from pathlib import Path

from controllers.types import Agents, Works
from engine import files
from engine.files import announce, announce_writes, blobs
from providers import skill_folders
from features.file_feed.feed import PAGE, Side, edited_file, edits_before, edits_since
from engine.record import Record
from providers.command_effects import inside, may_change_files, writes
from providers.base import Provider
from providers.codex import Codex
from providers.payload import Hook
from tests.conftest import fresh


@dataclass(frozen=True)
class Project:
    record: Record
    root: Path
    agent: int

    def changed(self) -> None:
        announce(self.record, self.agent, skill_folders(), self.root)


def project_with(files: dict[str, str]) -> Project:
    record = fresh()
    project = record.root.parent
    for name, text in files.items():
        (project / name).write_text(text)
    for command in (["init", "-q"], ["add", "-A"], ["-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "start"]):
        subprocess.run(["git", *command], cwd=project, capture_output=True, timeout=10)
    row = Agents(record, actor="system").by_session("claude-1")
    announce(record, row.n, skill_folders(), project)
    return Project(record, project, row.n)


def test_hidden_and_secret_files_never_enter_the_edit_feed_or_git_objects():
    project = project_with({"visible.py": "visible\n"})
    (project.root / ".env").write_text("untracked hidden credential")
    (project.root / "credentials").mkdir()
    (project.root / "credentials" / "prod.json").write_text("untracked folder credential")
    (project.root / "SecretForm.vue").write_text("<template>a form for a secret</template>\n")
    project.changed()
    assert set(blobs(project.record, project.root, skill_folders())) == {"visible.py", "SecretForm.vue"}, \
        "a view file is shown whatever its name says, a file named for a credential is not"
    assert [card.path for card in edits_since(project.record, project.agent, 0, PAGE).edits] == ["SecretForm.vue"], "and an edit to it is a card"
    for path in (".env", "credentials/prod.json"):
        sha = subprocess.run(["git", "hash-object", path], cwd=project.root, capture_output=True, text=True, check=True).stdout.strip()
        assert subprocess.run(["git", "cat-file", "-e", sha], cwd=project.root, capture_output=True).returncode != 0


def test_a_changed_file_becomes_a_card_and_the_cursor_reads_only_what_came_after():
    lines = [f"line {i}" for i in range(1, 51)]
    project = project_with({"a.py": "\n".join(lines) + "\n"})
    lines[3], lines[44] = "LINE 4", "LINE 45"
    (project.root / "a.py").write_text("\n".join(lines) + "\n")
    project.changed()
    first = edits_since(project.record, project.agent, 0, PAGE)
    card = first.edits[0]
    assert (card.path, card.kind, card.added, card.removed, card.first_line, card.last_line) == ("a.py", "edit", 2, 2, 1, 48), \
        "a shell edit is a card, counted and placed"
    assert [(r.kind, r.line) for r in card.rows][2:6] == [("ctx", 3), ("del", 4), ("add", 4), ("ctx", 5)], "the change sits between its context"
    assert "fold" in [r.kind for r in card.rows], "the unchanged lines between changes fold to one row"
    (project.root / "new.py").write_text("one\ntwo\n")
    project.changed()
    after = edits_since(project.record, project.agent, first.cursor, PAGE)
    assert [(c.path, c.kind, [r.kind for r in c.rows]) for c in after.edits] == [("new.py", "new", ["add", "add"])], "a new file is all added lines"
    patch = "*** Begin Patch\n*** Add File: new.py\n+one\n*** End Patch"
    sent = lambda name, given: Hook.read({"hook_event_name": "PostToolUse", "session_id": "codex-1", "tool_name": name, "tool_input": given, "cwd": str(project.root)}, Codex.tool_kinds)
    assert [writes(sent("apply_patch", {"command": patch})), writes(sent("exec", {"cmd": f"await tools.apply_patch({patch!r})"})), writes(sent("exec_command", {"cmd": "ls"}))] == \
        [True, True, False], "a Codex patch, direct or through exec, is a write the snapshot follows"
    root = str(project.root)
    assert [inside(f"python3 {root}/src/x.py", root), inside(f"{root}/src/x.py", root), inside("ls /etc/hosts", root)] == ["python3 src/x.py", "src/x.py", "ls /etc/hosts"], "a command or path inside the project is recorded relative to it"


def test_a_deleted_file_is_one_line_with_its_removed_count():
    project = project_with({"old.md": "a\nb\nc\n"})
    (project.root / "old.md").unlink()
    project.changed()
    card = edits_since(project.record, project.agent, 0, PAGE).edits[0]
    assert (card.kind, card.removed, card.rows) == ("deleted", 3, ()), "a deleted file carries no diff rows"
    from features.file_feed import diff as diffing
    long = diffing.Diff.between([], [f"line {i}" for i in range(diffing.MOST_ROWS + 25)])
    assert (len(long.rows), long.rows[-1].kind, long.added) == (diffing.MOST_ROWS + 1, "fold", diffing.MOST_ROWS + 25), "a very long change shows its first rows and says how many more there are"
    diffing.DIFFS.clear()
    diffing.DIFFS.update({("a", "b"): long, ("c", "d"): long})
    real = diffing.MOST_DIFFS
    diffing.MOST_DIFFS = 1
    try:
        diffing.diffed(project.root, [])
        assert list(diffing.DIFFS) == [("c", "d")], "the oldest diffs are dropped once too many are kept"
    finally:
        diffing.MOST_DIFFS = real
        diffing.DIFFS.clear()


def test_a_change_made_while_work_is_open_is_counted_on_that_work():
    project = project_with({"a.py": "one\ntwo\n"})
    work = Works(project.record, actor="agent").create("change a.py")
    (project.root / "a.py").write_text("one\nTWO\nthree\n")
    project.changed()
    (project.root / "a.py").write_text("one\nTWO\nthree\nfour\n")
    project.changed()
    changed = Works(project.record).load(work.n).changed
    assert [(c["path"], c["added"], c["removed"]) for c in changed] == [("a.py", 3, 1)], "the work counts the file against how it stood when the work began"
    (project.root / "b.py").write_text("brand new\n")
    project.changed()
    made = {c["path"]: c["created"] for c in Works(project.record).load(work.n).changed}
    assert made == {"a.py": False, "b.py": True}, "a file the work made is counted as created"
    (project.root / "a.py").write_text("one\ntwo\n")
    project.changed()
    assert [c["path"] for c in Works(project.record).load(work.n).changed] == ["b.py"], "a file put back as it was is no longer a change of the work"


def test_older_edits_page_back_and_an_edit_gives_its_whole_file():
    project = project_with({"a.py": "0\n"})
    for n in range(1, 4):
        (project.root / "a.py").write_text(f"{n}\n")
        project.changed()
    newest = edits_since(project.record, project.agent, 0, 2)
    assert (len(newest.edits), newest.older) == (2, True), "the newest page says older changes exist"
    older = edits_before(project.record, project.agent, newest.edits[0].at, 2)
    assert (len(older.edits), older.older) == (1, False), "the page before it holds the rest"
    whole = edited_file(project.record, project.agent, older.edits[0].id, Side.AFTER)
    assert (whole.path, whole.text) == ("a.py", "1\n"), "an edit gives the file as it stood after it"
    from commands.http import dispatch
    asked = lambda query: dispatch("GET", f"/api/{project.record.env}/agent/{project.agent}/edits/file", project.record.root, query, {})
    served = asked({"id": older.edits[0].id, "side": Side.AFTER})
    assert (served.code, served.body["text"]) == (200, "1\n"), "the viewer's request for an edited file is served whole"
    assert asked({"id": older.edits[0].id, "side": "sideways"}).code == 400, "a side that is neither before nor after is refused"
    assert asked({"id": "no-such-edit", "side": Side.AFTER}).code == 404, "an edit nobody made is not found"
    import features.file_feed.feed as feeding
    kept = feeding.blob_texts
    feeding.blob_texts = lambda project, shas: {}
    try:
        assert asked({"id": older.edits[0].id, "side": Side.AFTER}).code == 404, "an edit whose file is no longer kept in git is not found either"
    finally:
        feeding.blob_texts = kept
    listed = dispatch("GET", f"/api/{project.record.env}/agent/{project.agent}/edits/older", project.record.root, {"before": str(newest.edits[0].at), "last": "2"}, {})
    assert (listed.code, len(listed.body["edits"])) == (200, 1), "the older page is served as the viewer asks for it"


def test_a_folder_of_repositories_and_a_repository_holding_nested_ones_feed_the_edits_of_each():
    record = fresh()
    project = record.root.parent
    for name in ("api", "site"):
        (project / name).mkdir()
        (project / name / "main.py").write_text("one\ntwo\n")
        for command in (["init", "-q"], ["add", "-A"], ["-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "start"]):
            subprocess.run(["git", *command], cwd=project / name, capture_output=True, timeout=10)
    agent = Agents(record, actor="system").by_session("claude-1").n
    announce(record, agent, skill_folders(), project)
    (project / "site" / "main.py").write_text("one\nTWO\nthree\n")
    (project / "api" / "new.py").write_text("fresh\n")
    announce(record, agent, skill_folders(), project)
    cards = {card.path: (card.kind, card.added, card.removed) for card in edits_since(record, agent, 0, PAGE).edits}
    assert cards == {"site/main.py": ("edit", 2, 1), "api/new.py": ("new", 1, 0)}, cards

    project = project_with({"a.py": "one\n"})
    nested = project.root / "api"
    nested.mkdir()
    (nested / "main.py").write_text("one\ntwo\n")
    for command in (["init", "-q"], ["add", "-A"], ["-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "start"]):
        subprocess.run(["git", *command], cwd=nested, capture_output=True, timeout=10)
    files.REPOSITORIES.clear()
    project.changed()
    (nested / "main.py").write_text("one\nTWO\nthree\n")
    (project.root / "a.py").write_text("one\nmore\n")
    project.changed()
    cards = {card.path: (card.kind, card.added, card.removed) for card in edits_since(project.record, project.agent, 0, PAGE).edits}
    assert cards == {"api/main.py": ("edit", 2, 1), "a.py": ("edit", 1, 0)}, "the edits of the project's own repository and of a repository nested in it are both in the feed"


def test_a_repository_with_nothing_in_it_a_missing_folder_and_a_job_that_fails_are_all_handled_quietly(tmp_path):
    import threading
    import pytest
    from engine import files
    record = fresh()
    project = tmp_path / "project"
    project.mkdir()
    assert files.internal(record, project, ("home",)) == ("home/journal",), "a journal folder outside the project marks nothing of the project as the journal's own"
    assert (files.nested_repositories(project, 0), files.nested_repositories(project / "missing", 2)) == ([], []), "no depth left or a folder that cannot be read has no repositories"
    subprocess.run(["git", "init", "-q", str(project)], check=True, timeout=30)
    assert files.tracked_in(project) == {}, "a repository that has no index yet tracks nothing"
    assert [files.match_rank(path, "note") for path in ("docs/notes.md", "docs/my-notes.md", "docs/x.md")] == [0, 1, 2], \
        "a file that starts with the search ranks before one that only contains it"

    coalesced, ran, release, begun = files.Coalesced(), [], threading.Event(), threading.Event()

    def slow():
        ran.append("first")
        begun.set()
        release.wait(10)
    first = threading.Thread(target=coalesced.run, args=("key", slow))
    first.start()
    assert begun.wait(10)
    coalesced.run("key", lambda: ran.append("second"))
    coalesced.run("key", lambda: ran.append("third"))
    release.set()
    first.join(10)
    assert ran == ["first", "third"], "a job asked for while it runs is run once more afterwards, with only the newest request kept"

    class JobFailed(Exception):
        pass

    def failing():
        raise JobFailed()
    with pytest.raises(JobFailed):
        coalesced.run("key", failing)
    coalesced.run("key", lambda: ran.append("after the failure"))
    assert ran[-1] == "after the failure", "a job that fails does not leave its key blocked"


def test_a_test_run_inside_a_long_compound_background_command_is_named_by_its_test_part():
    from providers.command_effects import test_command
    from providers.tested import tested
    command = f"journal work resume 5 --how '{'x' * 500}'; (cd /project && .venv/bin/python -m pytest -q src/features/plans/test.py > out.txt 2>&1)"
    hook = Hook.read({"hook_event_name": "PreToolUse", "session_id": "claude-1", "tool_name": "Bash", "tool_input": {"command": command, "run_in_background": True}, "cwd": "/project"},
                     Provider.tool_kinds)
    shown = test_command(hook, command[:400])
    assert shown == ".venv/bin/python -m pytest -q src/features/plans/test.py", "the test part is whole even when the shown command is cut before it"
    assert (tested(shown).name, hook.tool.background) == ("Tests of plans", True), "it is named for what it tests, and it is known to run in the background"


def test_edits_in_an_agents_own_worktree_reach_its_feed_and_a_shell_command_counts_unless_it_only_reads(tmp_path):
    project = project_with({"a.py": "one\n"})
    tree = project.root / "wt"
    subprocess.run(["git", "worktree", "add", "-q", str(tree), "-b", "own"], cwd=project.root, capture_output=True, timeout=10)
    announce_writes(project.record, project.agent, skill_folders(), str(tree))
    (tree / "a.py").write_text("one\ntwo\n")
    announce_writes(project.record, project.agent, skill_folders(), str(tree))
    cards = {card.path: (card.kind, card.added, card.removed) for card in edits_since(project.record, project.agent, 0, PAGE).edits}
    assert cards == {"a.py": ("edit", 1, 0)}, "a file changed in the agent's own worktree is in its file changes"
    from engine import bus, files
    from engine.project_files import readable_in
    (project.root / "src").mkdir(exist_ok=True)
    (project.root / "src" / "app.py").write_text("x\n")
    (project.root / "out").symlink_to(tmp_path)
    assert [readable_in(project.root, rel) for rel in ("src/app.py", ".env", "src/.hidden/x.py", "out")] == [True, False, False, False], \
        "a listed path is checked by the names in it, and only a link is followed to see where it leads"
    timers = []

    class Waiting:
        def __init__(self, seconds, job):
            self.seconds, self.job, self.daemon = seconds, job, False

        def start(self):
            timers.append(self)
    with pytest.MonkeyPatch.context() as patch:
        patch.setattr(bus, "BACKGROUND", True)
        patch.setattr(files.threading, "Timer", Waiting)
        files.PENDING.clear()
        announce_writes(project.record, project.agent, skill_folders(), str(tree))
        announce_writes(project.record, project.agent, skill_folders(), str(tree))
        assert [timer.seconds for timer in timers] == [files.ANNOUNCE_AFTER], "a burst of writes asks for one look, a moment after the first, and the hook is not held up"
        timers[0].job()
        announce_writes(project.record, project.agent, skill_folders(), str(tree))
        assert len(timers) == 2, "a write after the look asks for the next one"
        timers[1].job()
        files.LOOKED.update({key: 3.0 for key in files.LOOKED})
        announce_writes(project.record, project.agent, skill_folders(), str(tree))
        assert timers[-1].seconds == files.LOOK_SPACING * 3.0, "after a look that took long the next one waits five times as long, so a big project is not scanned all the time"
    shell = lambda command: Hook.read({"hook_event_name": "PostToolUse", "session_id": "claude-1", "tool_name": "Bash", "tool_input": {"command": command}, "cwd": str(tree)}, Provider.tool_kinds)
    assert [may_change_files(shell(command)) for command in ("cat a.py", "grep -rn one .", "python3 build.py", "git apply fix.patch", "journal todo all")] == \
        [False, False, True, True, False], "any shell command that is not only a read, a search or a journal command is checked for changes"



def test_a_picture_a_helper_makes_is_a_card_with_its_bytes_even_where_the_project_ignores_pictures():
    from features.file_feed.feed import edited_image
    project = project_with({"a.py": "one\n", ".gitignore": "*.png\n"})
    picture = bytes([137, 80, 78, 71, 13, 10, 26, 10, 0, 255, 254, 0, 1, 2, 3])
    (project.root / "art").mkdir()
    (project.root / "art" / "rig.png").write_bytes(picture)
    project.changed()
    cards = edits_since(project.record, project.agent, 0, PAGE).edits
    assert [(card.path, card.kind, card.image, card.rows) for card in cards] == [("art/rig.png", "new", True, ())], "an ignored picture is a card with no lines to diff"
    assert edited_image(project.record, project.agent, cards[0].id).data == picture, "the card's picture comes back byte for byte"
