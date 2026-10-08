import subprocess


from controllers.types import Todos
from engine.record import Record
from resources.base import AGENT, SYSTEM, USER
from tests.kit import nudges, report


def test_a_checkout_change_is_seen_in_each_environment(tmp_path):
    from engine.git import checkout_of
    from features.close_from_commits.handlers import CloseRowsFromCommits

    subprocess.run(["git", "init", "-q"], cwd=tmp_path, check=True)
    subprocess.run(["git", "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "--allow-empty", "-m", "start"], cwd=tmp_path, check=True)
    handler = CloseRowsFromCommits()
    log = checkout_of(tmp_path).head_log
    assert handler.moved(log, "main")
    assert handler.moved(log, "helper")
    assert not handler.moved(log, "main")


def test_a_journal_trailer_at_column_0_closes_the_row_it_names(tmp_path):
    project = tmp_path

    def git(*a):
        return subprocess.run(["git", *a], cwd=project, capture_output=True, text=True, timeout=5, check=True)

    git("init", "-q")
    git("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "--allow-empty", "-m", "before the journal looked")
    record = Record(project / ".journal", "t")
    todos = Todos(record, actor=USER)
    todos.create("first")
    todos.create("second")
    todos.create("third")

    def commit(message):
        git("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "--allow-empty", "-m", message)
        report(record, "working", "PostToolUse")

    report(record, "idle", "SessionStart")
    assert [t.completed for t in todos.all()] == [0.0, 0.0, 0.0], "the first look closes nothing: it only marks where the log was"
    commit("a change\n\nJournal: todos done 1")
    last = lambda: [e for e in record.event_log.events() if e.type == "todo"][-1]
    assert (bool(todos.load(1).completed), last().actor, last().data["how"].startswith("a change ("), last().data["cause"]) == \
        (True, SYSTEM, True, AGENT), "a trailer at column 0 closes the row it names, as SYSTEM, citing the commit, caused by the agent's own commit"
    commit("only prose\n\nThis closes to-do 2, honestly.\n    Journal: todos done 2")
    assert todos.load(2).completed == 0.0, "prose and an indented example close nothing"
    commit("with a how\n\nJournal: todos done 2 the placement vocabulary is settled")
    assert (bool(todos.load(2).completed), last().data["how"]) == (True, "the placement vocabulary is settled"), \
        "the words after the number are the how"
    commit("again\n\nJournal: todos done 2")
    assert [e.action for e in record.event_log.events() if e.type == "todo"].count("completed") == 2, "a row already closed is left alone"
    commit("no such row\n\nJournal: todos done 99")
    assert todos.load(3).completed == 0.0, "a number with no row is ignored"
    report(record, "idle", "Stop")
    assert [e.action for e in record.event_log.events() if e.type == "todo"].count("completed") == 2, "nothing new: nothing happens"
    Todos(record, actor=AGENT).start(3)
    commit("third\n\nJournal: todos done 3")
    assert [n for n in nudges(record) if n.startswith("commit ")][-1].endswith("closed to-do 3 and ended work 1"), \
        "the agent is told what its commit closed and which work that ended"
    todos.create("fourth")
    git("update-ref", "--create-reflog", "refs/remotes/origin/main", "HEAD")
    git("symbolic-ref", "refs/remotes/origin/HEAD", "refs/remotes/origin/main")
    report(record, "working", "PostToolUse")
    elsewhere = git("-c", "user.name=t", "-c", "user.email=t@t", "commit-tree", "HEAD^{tree}", "-p", "HEAD", "-m", "made in a worktree\n\nJournal: todos done 4").stdout.strip()
    git("update-ref", "-m", "push", "refs/remotes/origin/main", elsewhere)
    report(record, "working", "PostToolUse")
    assert bool(todos.load(4).completed), "a commit made in another worktree closes its rows once it lands on main"
    from controllers.types import Agents
    branch = git("branch", "--show-current").stdout.strip()
    sha = git("rev-parse", "HEAD").stdout.strip()
    marks = [card["label"] for card in Agents(record, actor=SYSTEM).by_session("claude-1").data["cards"]]
    assert (len(marks), marks[-1]) == (6, f"Agent committed {sha[:8]} on `{branch}`"), "every commit after the first look is marked in the chat with its hash and branch"
    fourth = todos.create("fourth").n
    elsewhere = tmp_path.parent / f"{tmp_path.name}-other"
    git("worktree", "add", "-q", "-b", "other", str(elsewhere))
    subprocess.run(["git", "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "--allow-empty", "-m", f"another ticket\n\nJournal: todos done {fourth}"],
                   cwd=elsewhere, capture_output=True, timeout=5, check=True)
    git("-c", "user.name=t", "-c", "user.email=t@t", "merge", "-q", "--no-edit", "other")
    report(record, "working", "PostToolUse")
    assert todos.load(fourth).completed == 0.0, "a trailer merged in from another worktree's commit closes nothing here"
    several = [todos.create(f"one of several {i}").n for i in range(3)]
    commit(f"several at once\n\nJournal: todos done {several[0]} {several[1]} and {several[2]}")
    assert [bool(todos.load(n).completed) for n in several] == [True, True, True], \
        "every number after todos done closes, separated by spaces, commas or and"
    counted = lambda: len(Agents(record, actor=SYSTEM).by_session("claude-1").data["cards"])
    before = counted()
    for cursor in (record.home / "runtime").glob("cursor-close_from_commits-*"):
        cursor.write_text("0" * 40)
    commit("after an update")
    assert counted() == before, "a last seen commit this checkout's history does not hold replays nothing: it is a first look"
    commit("the next one")
    assert counted() == before + 1, "and the commit after it is marked, once"


def test_a_trailer_on_main_closes_a_row_a_helper_holds_whatever_the_sha_and_the_sweep_closes_any_open_row(tmp_path):
    from features.close_from_commits.commands import SweepLanded

    def git(*a):
        return subprocess.run(["git", "-c", "user.name=t", "-c", "user.email=t@t", *a], cwd=tmp_path, capture_output=True, text=True, timeout=5, check=True).stdout.strip()

    git("init", "-q")
    git("commit", "-q", "--allow-empty", "-m", "start")
    git("update-ref", "--create-reflog", "refs/remotes/origin/main", "HEAD")
    git("symbolic-ref", "refs/remotes/origin/HEAD", "refs/remotes/origin/main")
    record = Record(tmp_path / ".journal", "t")
    todos = Todos(record, actor=SYSTEM)
    held, plain, pending = (todos.create(title).n for title in ("held", "plain", "pending"))
    todos.assign(held, to="helper:1")
    todos.assign(pending, to="helper:1")
    git("update-ref", "-m", "push", "refs/remotes/origin/main", git("commit-tree", "HEAD^{tree}", "-p", "HEAD", "-m", f"copied over\n\nJournal: todos done {held}, {plain}, {pending}"))
    report(record, "idle", "SessionStart")
    assert [bool(todos.load(n).completed) for n in (held, plain, pending)] == [True, False, True], \
        "a first look at main closes the rows a helper holds whose trailer is already on main, and leaves the agent's own rows"
    assert SweepLanded().run(type("C", (), {"record": record})(), todos) == f"closed to-do {plain}" and todos.load(plain).completed, \
        "the sweep closes any open row whose trailer is on main"
