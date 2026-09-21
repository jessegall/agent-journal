import subprocess


import features
from controllers.types import Todos
from engine.record import Record
from resources.base import SYSTEM, USER
from tests.kit import report


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
    assert (bool(todos.load(1).completed), record.events()[-1].actor, record.events()[-1].data["how"].startswith("a change (")) == \
        (True, SYSTEM, True), "a trailer at column 0 closes the row it names, as SYSTEM, citing the commit"
    commit("only prose\n\nThis closes to-do 2, honestly.\n    Journal: todos done 2")
    assert todos.load(2).completed == 0.0, "prose and an indented example close nothing"
    commit("with a how\n\nJournal: todos done 2 the placement vocabulary is settled")
    assert (bool(todos.load(2).completed), record.events()[-1].data["how"]) == (True, "the placement vocabulary is settled"), \
        "the words after the number are the how"
    commit("again\n\nJournal: todos done 2")
    assert [e.action for e in record.events() if e.type == "todo"].count("completed") == 2, "a row already closed is left alone"
    commit("no such row\n\nJournal: todos done 99")
    assert todos.load(3).completed == 0.0, "a number with no row is ignored"
    report(record, "idle", "Stop")
    assert [e.action for e in record.events() if e.type == "todo"].count("completed") == 2, "nothing new: nothing happens"
