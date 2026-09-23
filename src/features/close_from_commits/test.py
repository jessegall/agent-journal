import subprocess


from controllers.types import Todos
from engine.record import Record
from resources.base import AGENT, SYSTEM, USER
from tests.kit import nudges, report


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
    last = lambda: [e for e in record.events() if e.type == "todo"][-1]
    assert (bool(todos.load(1).completed), last().actor, last().data["how"].startswith("a change ("), last().data["cause"]) == \
        (True, SYSTEM, True, AGENT), "a trailer at column 0 closes the row it names, as SYSTEM, citing the commit, caused by the agent's own commit"
    commit("only prose\n\nThis closes to-do 2, honestly.\n    Journal: todos done 2")
    assert todos.load(2).completed == 0.0, "prose and an indented example close nothing"
    commit("with a how\n\nJournal: todos done 2 the placement vocabulary is settled")
    assert (bool(todos.load(2).completed), last().data["how"]) == (True, "the placement vocabulary is settled"), \
        "the words after the number are the how"
    commit("again\n\nJournal: todos done 2")
    assert [e.action for e in record.events() if e.type == "todo"].count("completed") == 2, "a row already closed is left alone"
    commit("no such row\n\nJournal: todos done 99")
    assert todos.load(3).completed == 0.0, "a number with no row is ignored"
    report(record, "idle", "Stop")
    assert [e.action for e in record.events() if e.type == "todo"].count("completed") == 2, "nothing new: nothing happens"
    Todos(record, actor=AGENT).start(3)
    commit("third\n\nJournal: todos done 3")
    assert [n for n in nudges(record) if n.startswith("commit ")][-1].endswith("closed to-do 3 and ended work 1"), \
        "the agent is told what its commit closed and which work that ended"
    from controllers.types import Agents
    branch = git("branch", "--show-current").stdout.strip()
    sha = git("rev-parse", "HEAD").stdout.strip()
    marks = [card["label"] for card in Agents(record, actor=SYSTEM).by_session("claude-1").data["cards"]]
    assert (len(marks), marks[-1]) == (6, f"Agent committed {sha[:8]} on {branch}"), "every commit after the first look is marked in the chat with its hash and branch"
